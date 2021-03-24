// Hoisted functions
makeImgtag();

//iputs
const inputImg = document.getElementById('gamerAva');
const inputName = document.getElementById('username');
const inputGame = document.getElementById('game');
const inputMainChar = document.getElementById('console');

//Elments
const imgTag = document.getElementById("avatarPreview");

//Event lisneters 
inputImg.addEventListener("change", upImg, false);

inputImg.addEventListener("click", deleteImg, false);

inputName.addEventListener("input", check, false);

inputGame.addEventListener("change", selectCheck, false);

inputMainChar.addEventListener("input", checkChar, false);


// functions
function upImg() {

    imgTag.src = URL.createObjectURL(event.target.files[0]);    
    imgTag.onload = function checkImg() {
        // goodCheck()
        URL.revokeObjectURL(imgTag.src) // free memory 
        if(imgTag.src.includes('user-astronaut-solid.svg')){
            imgTag.classList.remove("border-green");
            imgTag.classList.add("border-red");
            inputImg.classList.remove("border-green");
            inputImg.classList.add("border-red");
            goodCheck()
        } else{
            imgTag.classList.remove("border-red");
            imgTag.classList.add("border-green");
            inputImg.classList.remove("border-red");
            inputImg.classList.add("border-green");
            goodCheck()
    }
}
};

function deleteImg() {
    imgTag.classList.remove("border-green");
    imgTag.classList.add("border-red");
    imgTag.setAttribute("src", "./assets/images/user-astronaut-solid.svg");

    if(imgTag.src.includes('user-astronaut-solid.svg')){
        imgTag.classList.remove("border-green");
        imgTag.classList.add("border-red");
        inputImg.classList.remove("border-green");
        inputImg.classList.add("border-red");
    } 
    if(inputImg.accept.includes('image/*')){

    } else{
        inputImg.setAttribute("accept", "image/*");
    }
    
};

function check(){


    if(inputName.value.length > 4){
        inputName.classList.remove('border-red');
        inputName.classList.add('border-green');
        goodCheck()
        
    } else {
        inputName.classList.remove('border-green');
        inputName.classList.add('border-red');
        goodCheck()
        save.classList.add('hide'); 
    }

}

function selectCheck(){
    if(inputGame.value == ''){
        inputGame.classList.add('border-red');
        inputGame.classList.remove('border-green');
        inputGame.required = "required";
        goodCheck()


    }else{
        inputGame.classList.add('border-green')
        inputGame.classList.remove('border-red');
        goodCheck()
        save.classList.add('hide'); 
    }
};


function checkChar(){


    if(inputMainChar.value.length > 0){
        inputMainChar.classList.remove('border-red');
        inputMainChar.classList.add('border-green');
        goodCheck()
        
    } else {
        inputMainChar.classList.remove('border-green');
        inputMainChar.classList.add('border-red');
        goodCheck()

    }
};


const save = document.getElementById('extraCheck');
// const save = document.getElementById('extraCheck');

    save.addEventListener('click', checkAll, false);

    
function goodCheck(){
    if(document.getElementsByClassName('border-green').length == 5){
        save.classList.remove('no-click');
        save.classList.remove('purple-bg');
        save.classList.add('show');

        let txt = "Alle velden zijn ingevuld dankjewel (^.^)!";
        let paragraph = document.getElementById("massage");
        paragraph.innerHTML = "<span class='green'>" + txt + "</span>";

    } else{
        checkAll()
    }
    if(document.getElementsByClassName('border-green').length < 5){
        save.classList.add('hide');   
    }
    
};



function checkAll(){

    if(document.getElementsByClassName('border-green').length < 5){  
        save.classList.remove('show');   
        save.classList.add('hide');
        save.classList.add('purple-bg');
        save.classList.add('message');

        //Check the if the input are filled
        if(imgTag.src.includes('user-astronaut-solid.svg')){
            imgTag.classList.remove("border-green");
            imgTag.classList.add("border-red");
            inputImg.classList.add("border-red");
        } else{
            imgTag.classList.remove("border-red");
            imgTag.classList.add("border-green");
            inputImg.classList.add("border-green");
        };

        // Set input as required
        inputImg.required = "required";
        inputName.required = "required";
        inputGame.required = "required";
        inputMainChar.required = "required";

        let txt = "Maak alle velden groen s.v.p. (*.*)!";
        let paragraph = document.getElementById("massage");
        paragraph.classList.add('show')
        paragraph.innerHTML = "<span class='yellow'>" + txt + "</span>";

    }
}

function makeImgtag(){
    const spanImage = document.getElementById("imageSpace");
    spanImage.innerHTML = '<img class="ava-prvu" src="./assets/images/user-astronaut-solid.svg" id="avatarPreview" alt="Avatar preview">';
}
