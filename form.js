const specialCharactersRegex = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
const numbersRegex = /^\d*$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const fullName = document.getElementById("fullName");
const birthDate = document.getElementById("birthDate");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

const editFullName = document.getElementById("editFullName");
const editBirthDate = document.getElementById("editBirthDate");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");
const photoWrapper = document.getElementById("photoWrapper");
const now = new Date();
var checkArray = [false, false, false, false];
let photoLoaded = false;
let dateFromTheFuture = false;
let id = 0;
var users = [];
let user = {
    id: "",
    name: "",
    date: "",
    email: "",
    phone: "",
    picture: ""
}

function submitForm(){
    checkInputs("form");
    if (checkArray.every(Boolean) && photoLoaded) {
        checkArray = [false, false, false, false];
        user.id = id++;
        users.push(user);
        appendListElement(user.id,user.name, user.date, user.email, user.picture);
        load();
        photoLoaded = false;
        //reset the user
        user = {
            id: "",
            name: "",
            date: "",
            email: "",
            phone: "",
            picture: "",
            mediaType: "",
            title: "",
            explanation:""
        }
        fullName.value ="";
        birthDate.value ="";
        email.value ="";
        phone.value ="";
        resetInputs();
        goToCalendar();
    }
}

function goToCalendar(){
    document.getElementById("formWrapper").className = "hidden";
    document.getElementById("editFormWrapper").className = "hidden";
    document.getElementById("container").className = "";
}

function setImage(url){
        photoWrapper.style.background = "url("+ url +") center";
        photoWrapper.style.backgroundSize = "cover";
}

const KEY_API = "P1Yn0b3SL4AUslBMVLLh9F9Iqap3LpCYu53nDecQ"
const url = "https://api.nasa.gov/planetary/apod?api_key="

function fetchPicture(inputShortDate){
    fetch(url + KEY_API + "&date=" + inputShortDate)
        .then(res => {
            return res.json();
            })
        .then(result => {
            if(result.media_type === "image"){
                const imageUrl = result.url
                setImage(imageUrl);
                user.picture = result.url;
                user.mediaType = result.media_type;
                user.title = result.title;
                user.explanation = result.explanation;
                photoLoaded = true;
            }else{
                setImage("/images/no-image.jpg");
                user.picture = "/images/no-image.jpg";
                user.mediaType = "no-image";
                user.title = "No title";
                user.explanation = "We apologise, but the picture for this user is unavailable";
                photoLoaded = true;
            }
        })
        .catch(error => {
            setImage("/images/no-image.jpg");
        });
}

function checkDate(e,object){
    const inputShortDate = object.value;
    const inputDate = new Date(inputShortDate);
    const apiLimitDate = new Date(1995,06,16);
    //take year digits from choosen date
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

let nameValue = "";
let birthDateValue ="";
let emailValue ="";
let phoneValue ="";

function checkInputs(flag){
    if (flag==="form") {
        nameValue = fullName.value.trim();
        birthDateValue = birthDate.value;
        emailValue = email.value.trim();
        phoneValue = phone.value;
    }else{
        nameValue = editFullName.value.trim();
        birthDateValue = editBirthDate.value;
        emailValue = editEmail.value.trim();
        phoneValue = editPhone.value;
    }
    //name validation
    if(nameValue !== ""){
        if(specialCharactersRegex.test(nameValue)){
            setError(flag==="form" ? "fullName":"editFullName","Special characters are not allowed");
            checkArray[0] = false;
        }else if(numbersRegex.test(nameValue)){
            setError(flag==="form" ? "fullName":"editFullName","Numbers are not allowed");
            checkArray[0] = false;
        }else if(nameValue.length < 3){
            setError(flag==="form" ? "fullName":"editFullName","Name is too short (min 3 characters)");
            checkArray[0] = false;
        }else{
            setSuccess(flag==="form" ? "fullName":"editFullName");
            checkArray[0] = true;
            user.name = nameValue;
        }
    }
    //birthday validation
    if(birthDateValue!= ""){
        setSuccess(flag==="form" ? "birthDate":"editBirthDate");
        user.date = birthDateValue;
        // users.length == 0 ? null : users[idToEdit].date = birthDateValue;
        checkArray[1] = true;
    }   
    //email validation
    if(emailValue !== ""){
        if(emailValue.match(emailRegex)){
            setSuccess(flag==="form" ? "email":"editEmail");
            user.email = emailValue;
            // users.length == 0 ? null : users[idToEdit].email = emailValue;
            checkArray[2] = true;
        }else{
            setError(flag==="form" ? "email":"editEmail","Incorrect email adress");
            checkArray[2] = false;
        }
    }
    //Phone number validation
    if(phoneValue !== ""){
        if(numbersRegex.test(phoneValue) && phoneValue.length === 9){
            setSuccess(flag==="form" ? "phone":"editPhone");
            user.phone = phoneValue;
            // users.length == 0 ? null : users[idToEdit].phone = phoneValue;
            checkArray[3] = true;
        }else{
            setError(flag==="form" ? "phone":"editPhone","Incorrect phone number (9 digits required)");
            checkArray[3] = false;
        }
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

function resetInputs(){
    document.getElementById("fullName").parentElement.className = "formInput";
    document.getElementById("editFullName").parentElement.className = "formInput";
    document.getElementById("birthDate").parentElement.className = "formInput";
    document.getElementById("editBirthDate").parentElement.className = "formInput";
    document.getElementById("email").parentElement.className = "formInput";
    document.getElementById("editEmail").parentElement.className = "formInput";
    document.getElementById("phone").parentElement.className = "formInput";
    document.getElementById("editPhone").parentElement.className = "formInput";
}

// ________________________________CALENDAR__CODE______________________________________

let nav = 0;
let idToEdit = null;
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];

function appendListElement(id,name,date, email, url){

    const userList = document.getElementById("userList");
    const userWrapper = document.createElement('div');
    userWrapper.id = id;
    userWrapper.className="userWrapper";

    const personalInfoWrapper = document.createElement('div');
    const personalInfoName = document.createElement('div');
    const personalInfoDate = document.createElement('div');
    const personalInfoEmail = document.createElement('div');

    personalInfoWrapper.className = "personalInfoWrapper";
    personalInfoName.className = "personalInfo personalName";
    personalInfoDate.className = "personalInfo personapersonalDatelName";
    personalInfoEmail.className = "personalInfo personalEmail";

    personalInfoName.innerHTML = name;
    personalInfoDate.innerHTML =  date; 
    personalInfoEmail.innerHTML = email;

    personalInfoWrapper.appendChild(personalInfoName)
    personalInfoWrapper.appendChild(personalInfoDate)
    personalInfoWrapper.appendChild(personalInfoEmail)

    const personalPhotoWrapper = document.createElement('div');
    personalPhotoWrapper.style.cssText = `
    width: 60px;
    height: 60px;
    background: url(${url}) center;
    background-size: cover;
    float: right;
    margin: 10px 8% 10px 0;
    `;
    
    const personalButtonsWrapper = document.createElement('div');
    personalButtonsWrapper.className = "personalButtonsWrapper";
    //add id of user to the button parent to determine which wrapper to edit/remove

    const editButton = document.createElement('button');
    const removeButton = document.createElement('button');
    editButton.className = "editButton";
    editButton.id = "editButton";
    removeButton.className = "removeButton";
    removeButton.id = "removeButton";
    editButton.innerText = "Edit";
    removeButton.innerText = "Remove";
    personalButtonsWrapper.appendChild(editButton);
    personalButtonsWrapper.appendChild(removeButton);

    removeButton.onclick = (e) => {
        const idToRemove = e.currentTarget.parentElement.parentElement.id;
        for(let i = 0; i < users.length; i++){
            if(users[i].id == idToRemove){
                //remove user from users array
                users.splice(i,1);
                const userWrapperToRemove = document.getElementById(idToRemove);
                userWrapperToRemove.parentElement.removeChild(userWrapperToRemove);
                load();
            }
        }
    }

    editButton.onclick = (e) => {
        document.getElementById("container").className = "hidden";
        document.getElementById("editFormWrapper").classList = "";
        idToEdit = e.currentTarget.parentElement.parentElement.id;
    }

    userWrapper.appendChild(personalInfoWrapper);
    userWrapper.appendChild(personalPhotoWrapper);
    userWrapper.appendChild(personalButtonsWrapper);
    userList.appendChild(userWrapper);
}

function submitEdit(){
    checkInputs("edit")
    if (checkArray.every(Boolean)) {
        checkArray = [false, false, false, false];

        users[idToEdit].name = nameValue;
        users[idToEdit].email = emailValue;
        users[idToEdit].date = birthDateValue;
        users[idToEdit].phone = phoneValue;

        editFullName.value ="";
        editBirthDate.value ="";
        editEmail.value ="";
        editPhone.value ="";
        resetInputs();
        goToCalendar();
        load();
    }
}

const modalWindow = document.getElementById("modalWindow");
const modaltextWrapper = document.createElement("div");
const modalTitle = document.createElement("div");
const modalExplanation = document.createElement("div");
modaltextWrapper.className = "modaltextWrapper";
modalTitle.className = "modalTitle";
modalExplanation.className = "modalExplanation";
modaltextWrapper.appendChild(modalTitle);
modaltextWrapper.appendChild(modalExplanation);
modalWindow.appendChild(modaltextWrapper);

function openModal(picture, title, explanation){
    modalWindow.classList =""
    document.getElementById("container").classList = "hidden";
    modalWindow.style.background = "url("+ picture +") no-repeat center center";
    modalWindow.style.backgroundSize = "cover";
    modalExplanation.innerHTML = explanation;
    modalTitle.innerHTML = title;
}

function closeModal(){
    modalWindow.classList = "hidden"
    document.getElementById("container").classList = "";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    // Reset calendar before rerendering
    calendar.innerHTML = '';

    //render calendar
  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    //start rendering from the #1 day ,not padding day
    if (i > paddingDays) {
        const dayNumber = i - paddingDays
        daySquare.innerText = dayNumber;
        for(let i = 0; i < users.length; i++){

            let age = year - parseInt(users[i].date.substr(0,4)) ;
            if(new Date(users[i].date).setHours(0,0,0,0) > now.setHours(0,0,0,0)) age = 0;
            
            let daySquareStyle = `
            background: url(${users[i].picture}) center;
            background-size: cover;
            color: white;
            text-shadow: 0px 0px 3px black, 0px 0px 3px black;
            `
            let daySquareHTML = dayNumber + "<br />" + 
            "<div class='daySquareInfo'>"+users[i].name + "<br />" +
            "Age: "+ age +"<br />" + 
            users[i].email+"</div>" 
 
            //check if month is the same on calendar and user's and starts with 0 
            if (users[i].date[5] === "0"){
                if(users[i].date[6] == month + 1){
                    //check if day is the same on calendar and user's in months 01-09
                    if (users[i].date[8] === "0"){
                        if(users[i].date[9] == dayNumber){
                            daySquare.innerHTML = daySquareHTML;
                            daySquare.style.cssText = daySquareStyle;
                            daySquare.onclick = () => openModal(users[i].picture, users[i].title, users[i].explanation);
                        }
                    }else{
                        if(users[i].date[8] + users[i].date[9] == dayNumber){
                            daySquare.innerHTML = daySquareHTML;
                            daySquare.style.cssText = daySquareStyle;
                            daySquare.onclick = () => openModal(users[i].picture, users[i].title, users[i].explanation);
                        }
                    }
                }
            }else{
                if(users[i].date[5] + users[i].date[6]  == month + 1){
                    //check if day is the same on calendar and user's in months 10-12
                    if (users[i].date[8] === "0"){
                        if(users[i].date[9] == dayNumber){
                            daySquare.innerHTML = daySquareHTML;
                            daySquare.style.cssText = daySquareStyle; 
                            daySquare.onclick = () => openModal(users[i].picture, users[i].title, users[i].explanation);
                        }
                    }else{
                        if(users[i].date[8] + users[i].date[9] == dayNumber){
                            daySquare.innerHTML = daySquareHTML;
                            daySquare.style.cssText = daySquareStyle;
                            daySquare.onclick = () => openModal(users[i].picture, users[i].title, users[i].explanation);
                        }
                    }
                }
            }
        }
//highlight current day 
        if (i - paddingDays === day && nav === 0){
            daySquare.id = 'currentDay';
        }
    }else {
        daySquare.classList.add('padding');
    }
        calendar.appendChild(daySquare);    
    }
    
}

document.getElementById('returnButton').addEventListener('click', () => {
    document.getElementById("container").className = "hidden";
    document.getElementById("formWrapper").className = "";
    setImage("/images/no-image.jpg");
})

function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

initButtons();
load();