/*
=====================================
UPMINAA FAN HUB
main.js
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Upminaa Fan Hub initialized"
);





/*
=====================================
SMOOTH SCROLL
=====================================
*/


document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(link=>{


link.addEventListener(
"click",
event=>{


const target =
document.querySelector(
link.getAttribute("href")
);



if(target){


event.preventDefault();



target.scrollIntoView({

behavior:"smooth",

block:"start"

});


}


});


});







/*
=====================================
MOBILE MENU
=====================================
*/


const menuButton =
document.querySelector(
".menu-toggle"
);


const navigation =
document.querySelector(
".nav-links"
);



if(menuButton && navigation){


menuButton.addEventListener(
"click",
()=>{


navigation.classList.toggle(
"active"
);


});


}







/*
=====================================
SCROLL REVEAL
=====================================
*/


const revealItems =
document.querySelectorAll(
`
.bio-card,
.character-card,
.gallery-item,
.media-card,
.video-card,
.community-card,
.credit-card
`
);



if(revealItems.length){


const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"visible"
);



observer.unobserve(
entry.target
);


}


});


},
{

threshold:0.15

});




revealItems.forEach(
item=>{


observer.observe(
item
);


});


}







/*
=====================================
IMAGE ERROR CHECK
=====================================
*/


document
.querySelectorAll(
"img"
)
.forEach(
image=>{


image.addEventListener(
"error",
()=>{


console.warn(
"Image not found:",
image.src
);



image.classList.add(
"image-error"
);


});


});





});/*
=====================================
IMAGE MODAL
=====================================
*/


const imageModal =
document.querySelector(
"#imageModal"
);



const modalImage =
document.querySelector(
"#modalImage"
);



const modalTitle =
document.querySelector(
"#modalTitle"
);



const modalDescription =
document.querySelector(
"#modalDescription"
);



const modalClose =
document.querySelector(
".modal-close"
);







function openImageModal(
image,
title = "Gallery image",
description = "Community content."
){



if(
!imageModal ||
!modalImage
){

return;

}




modalImage.src =
image;



if(modalTitle){

modalTitle.textContent =
title;

}



if(modalDescription){

modalDescription.textContent =
description;

}




imageModal.classList.add(
"active"
);



document.body.style.overflow =
"hidden";


}









function closeImageModal(){



if(!imageModal){

return;

}



imageModal.classList.remove(
"active"
);



document.body.style.overflow =
"";



}









/*
=====================================
GALLERY CLICK
=====================================
*/


document
.querySelectorAll(
".gallery-item"
)
.forEach(
item=>{


item.addEventListener(
"click",
()=>{


const image =
item.querySelector(
"img"
);



if(image){


openImageModal(

image.src,

image.alt

);


}


});


});









/*
=====================================
COSPLAY CLICK
=====================================
*/


document
.querySelectorAll(
".character-card"
)
.forEach(
card=>{


card.addEventListener(
"click",
()=>{


const image =
card.querySelector(
"img"
);



const title =
card.querySelector(
"h3"
);



const description =
card.querySelector(
"p"
);



if(image){


openImageModal(

image.src,

title ?
title.textContent :
"Cosplay",

description ?
description.textContent :
"Cosplay content."

);


}


});


});









/*
=====================================
CLOSE BUTTON
=====================================
*/


if(modalClose){


modalClose.addEventListener(
"click",
closeImageModal
);


}









/*
=====================================
CLICK OUTSIDE MODAL
=====================================
*/


if(imageModal){


imageModal.addEventListener(
"click",
event=>{


if(
event.target === imageModal
){


closeImageModal();


}


});


}









/*
=====================================
ESC CLOSE
=====================================
*/


document.addEventListener(
"keydown",
event=>{


if(
event.key === "Escape"
&&
imageModal?.classList.contains("active")
){


closeImageModal();


}


});/*
=====================================
TWITCH PLAYERS
=====================================
*/


const twitchFrames =
document.querySelectorAll(
".twitch-live iframe"
);



twitchFrames.forEach(
(frame)=>{


frame.addEventListener(
"load",
()=>{


console.log(
"Twitch player loaded:",
frame.src

);


});



frame.addEventListener(
"error",
()=>{


console.warn(
"Twitch player error:",
frame.src

);


});


});









/*
=====================================
YOUTUBE PLAYERS
=====================================
*/


const youtubeFrames =
document.querySelectorAll(
".video-card iframe"
);



youtubeFrames.forEach(
(frame)=>{


const source =
frame.getAttribute(
"src"
);



if(!source){


console.warn(
"YouTube player without source"
);



return;


}



frame.addEventListener(
"load",
()=>{


console.log(
"YouTube player loaded:",
source

);


});



frame.addEventListener(
"error",
()=>{


console.warn(
"YouTube iframe error:",
source

);


});


});









/*
=====================================
EXTERNAL LINKS
=====================================
*/


document
.querySelectorAll(
".social-links a"
)
.forEach(
(link)=>{


link.addEventListener(
"click",
()=>{


console.log(
"Opening social:",
link.textContent.trim()

);


});


});









/*
=====================================
BACK TO TOP
=====================================
*/


const backTop =
document.querySelector(
".back-top"
);



if(backTop){



window.addEventListener(
"scroll",
()=>{


if(window.scrollY > 500){


backTop.classList.add(
"show"
);


}else{


backTop.classList.remove(
"show"
);


}


});





backTop.addEventListener(
"click",
()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


});


}









/*
=====================================
GLOBAL ERROR HANDLER
=====================================
*/


window.addEventListener(
"error",
event=>{


console.warn(
"Frontend error:",
event.message

);


});



});
