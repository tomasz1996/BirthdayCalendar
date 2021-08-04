const specialCharactersRegex = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
const numbersRegex = /^\d*$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const fullName = document.getElementById("fullName");
const birthDate = document.getElementById("birthDate");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const form = document.getElementById("form");
const photoWrapper = document.getElementById("photoWrapper");
const now = new Date();
var checkArray = [false, false, false, false];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();
    if (checkArray.every(Boolean)) {
        form.submit();
    }
})

const KEY_API = "P1Yn0b3SL4AUslBMVLLh9F9Iqap3LpCYu53nDecQ"
const url = "https://api.nasa.gov/planetary/apod?api_key="

function setImage(url){
        photoWrapper.style.background = "url("+ url +") center";
        photoWrapper.style.backgroundSize = "cover";
}

function fetchPicture(inputShortDate){
    fetch(url + KEY_API + "&date=" + inputShortDate)
        .then(res => {
            return res.json();
            })
        .then(result => {
            if(result.media_type === "image"){
                const imageUrl = result.url
                setImage(imageUrl);
            }else{
                setImage("/images/no-image.jpg");
            }
        })
        .catch(error => {
            setImage("/images/no-image.jpg");
        });
}

function checkDate(e,object){
    const birthDateValue = birthDate.value;
    const inputDate = new Date(birthDateValue);
    const apiLimitDate = new Date(1995,06,16);
    const inputShortDate = object.value;
    //take year digit from choosen date
    const subInt = parseInt(inputShortDate.substr(3,3))

    //check the images limit on nasa api website (16-06-1995)
    if(inputDate < apiLimitDate){
        setImage("/images/no-image.jpg");
    //check if date is from the future
    }else if(inputDate.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0)){
    //decrease year by 1
        const changedInput = inputShortDate.toString().replace(1, (subInt - 1).toString());
        fetchPicture(changedInput);
    }else{
        fetchPicture(inputShortDate);
    }   
}

function checkInputs(){
    //'name' is deprecated.
    const nameValue = fullName.value.trim();
    const birthDateValue = birthDate.value;
    const emailValue = email.value.trim();
    const phoneValue = phone.value;

    if(specialCharactersRegex.test(nameValue)){
        setError("fullName","Special characters are not allowed");
        checkArray[0] = false;
    }else if(numbersRegex.test(nameValue)){
        setError("fullName","Numbers are not allowed");
        checkArray[0] = false;
    }else if(nameValue.length < 3){
        setError("fullName","Name is too short (min 3 characters)");
        checkArray[0] = false;
    }else{
        setSuccess("fullName");
        checkArray[0] = true;
    }

    if(birthDateValue!= ""){
        setSuccess("birthDate");
        checkArray[1] = true;
    }   

    if(emailValue.match(emailRegex)){
        setSuccess("email");
        checkArray[2] = true;
    }else{
        setError("email","Incorrect email adress");
        checkArray[2] = false;
    }

    if(numbersRegex.test(phoneValue) && phoneValue.length === 9){
        setSuccess("phone");
        checkArray[3] = true;
    }else{
        setError("phone","Incorrect phone number (9 digits required)");
        checkArray[3] = false;
    }
}

function setError(input, message){
    const formInput = document.getElementById(input).parentElement;
    const small = formInput.querySelector("small");
    small.innerText = message;
    formInput.className = "formInput error"
}

function setSuccess(input){
    const formInput = document.getElementById(input).parentElement;
    formInput.className = "formInput success"
}
