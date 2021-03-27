// Matches page
defaultAvatar();
coverSizes();

// If there is no avatar image get a default image
function defaultAvatar(){
    let userAvaDef = document.querySelectorAll('.avatar');
    for(i = 0; i < userAvaDef.length; i++){
        userAvaDef[i].setAttribute("onerror", "this.onerror=null; this.src='./assets/images/user-astronaut-solid.svg'");
    }
    
};

// Cover Size bigger
function coverSizes(){
    let cover = document.querySelectorAll('.cover');

    for(i = 0; i < cover.length; i++){
        let coverIds = cover[i].src.slice(0 - 10);
        let coverBigger = cover[i].setAttribute('src', '//images.igdb.com/igdb/image/upload/t_cover_big/' + coverIds);
        cover[i].setAttribute("onerror", "this.onerror=null; this.src='./assets/images/def-cover.jpg'");
    }

};