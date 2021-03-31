// drop down menu tags and filterresults
const filterKnop = document.querySelector("button.verbergButton");
const inklapMenu = document.querySelector("div.filters");

function menuClose (){
  inklapMenu.classList.toggle("close");
  if (inklapMenu.className.includes('close')){
    filterKnop.innerHTML = "Show filters";
  }  else{
      filterKnop.innerHTML = "Verberg filters";
  }
}

 filterKnop.addEventListener("click", menuClose);
