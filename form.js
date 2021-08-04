
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

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();
})

const KEY_API = "P1Yn0b3SL4AUslBMVLLh9F9Iqap3LpCYu53nDecQ"
const url = "https://api.nasa.gov/planetary/apod?api_key="

function fetchPicture(e,object){

    function setImage(url){
        photoWrapper.style.background = "url("+ url +") center";
        photoWrapper.style.backgroundSize = "cover";
    }

    const birthDateValue = birthDate.value;
    const inpDate = new Date(birthDateValue);
    const apiLimitDate = new Date(1995,06,16);
    
    //check if date is from the future
    if(inpDate.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0)){
        console.log("Future date");
    //check the images limit on nasa api website (16-06-1995)
    }else if(inpDate < apiLimitDate){
        setImage("/images/no-image.jpg");
    }else{
        fetch(url + KEY_API + "&date=" + object.value)
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
}

function checkInputs(){
    //'name' is deprecated.
    const nameValue = fullName.value.trim();
    const birthDateValue = birthDate.value;
    const emailValue = email.value.trim();
    const phoneValue = phone.value;
    const inpDate = new Date(birthDateValue);

    if(specialCharactersRegex.test(nameValue)){
        setError("fullName","Special characters are not allowed");
    }else if(numbersRegex.test(nameValue)){
        setError("fullName","Numbers are not allowed");
    }else if(nameValue.length < 3){
        setError("fullName","Name is too short (min 3 characters)");
    }else{
        setSuccess("fullName");
    }

    //All zeroes are passed to make all hour, min, sec and millisec to 0.
    if(inpDate.setHours(0, 0, 0, 0) > now.setHours(0, 0, 0, 0)){
        setError("birthDate","Date can't be from the future");
    }else{
        setSuccess("birthDate");
    }   
    
    if(emailValue.match(emailRegex)){
        setSuccess("email");
    }else{
        setError("email","Incorrect email adress");
    }

    if(numbersRegex.test(phoneValue) && phoneValue.length === 9){
        setSuccess("phone");
    }else{
        setError("phone","Incorrect phone number (9 digits required)");
    }
}

function setError(input, message){
    const formInput = document.getElementById(input).parentElement;
    const small = formInput.querySelector("small");
    small.innerText = message;
    formInput.className = "formInput error"
    // formInput.
}

function setSuccess(input){
    const formInput = document.getElementById(input).parentElement;
    formInput.className = "formInput success"
}
