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
.forEach(
link=>{


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
.cosplay-card,
.gallery-card,
.stream-card,
.video-card,
.social-card,
.reference-card,
.fact-card,
.source-card
`
);





if(revealItems.length){



const observer =
new IntersectionObserver(
entries=>{


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
/*
=====================================
IMAGE LIGHTBOX
=====================================
*/


const imageLightbox =
document.querySelector(
"#imageLightbox"
);



const lightboxImage =
document.querySelector(
"#lightboxImage"
);



const lightboxClose =
document.querySelector(
".lightbox-close"
);








function openLightbox(
image,
title = "",
description = ""
){



if(
!imageLightbox ||
!lightboxImage
){

return;

}



lightboxImage.src =
image;



lightboxImage.alt =
title || "Expanded image";



imageLightbox.classList.add(
"active"
);



document.body.style.overflow =
"hidden";



}








function closeLightbox(){



if(!imageLightbox){

return;

}



imageLightbox.classList.remove(
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
".gallery-card img"
)
.forEach(
image=>{


image.addEventListener(
"click",
()=>{


openLightbox(

image.src,

image.alt

);


});


});









/*
=====================================
COSPLAY CLICK
=====================================
*/


document
.querySelectorAll(
".cosplay-card img"
)
.forEach(
image=>{


image.addEventListener(
"click",
()=>{


const card =
image.closest(
".cosplay-card"
);



const title =
card?.querySelector(
"h3"
);



openLightbox(

image.src,

title
?
title.textContent
:
"Cosplay"

);


});


});









/*
=====================================
CLOSE LIGHTBOX
=====================================
*/


if(lightboxClose){


lightboxClose.addEventListener(
"click",
closeLightbox
);


}









if(imageLightbox){


imageLightbox.addEventListener(
"click",
event=>{


if(
event.target === imageLightbox
){


closeLightbox();


}


});


}









document.addEventListener(
"keydown",
event=>{


if(
event.key === "Escape"
){


closeLightbox();


}


});









/*
=====================================
TWITCH PLAYERS
=====================================
*/


const twitchFrames =
document.querySelectorAll(
".stream-card iframe"
);





twitchFrames.forEach(
frame=>{


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
frame=>{


frame.addEventListener(
"load",
()=>{


console.log(
"YouTube player loaded:",
frame.src
);


});



frame.addEventListener(
"error",
()=>{


console.warn(
"YouTube player error:",
frame.src
);


});


});
/*
=====================================
SOCIAL LINKS
=====================================
*/


document
.querySelectorAll(
".social-card a"
)
.forEach(
link=>{


link.addEventListener(
"click",
()=>{


console.log(
"Opening social:",
link.href
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


if(
window.scrollY > 500
){


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








/*
=====================================
END DOM CONTENT LOADED
=====================================
*/


});
