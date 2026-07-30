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
.cosplay-card,
.gallery-card,
.live-player-card,
.youtube-card,
.social-card,
.reference-card,
.bio-card,
.detail-card
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

threshold:.15

});






revealItems.forEach(
item=>{


observer.observe(item);


});


}







/*
=====================================
IMAGE ERROR CHECK
=====================================
*/


document
.querySelectorAll("img")
.forEach(image=>{


image.addEventListener(
"error",
()=>{


console.warn(
"Image missing:",
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
"#lightboxClose"
);





function openLightbox(src, alt="Image"){


if(
!imageLightbox ||
!lightboxImage
){

return;

}



lightboxImage.src = src;


lightboxImage.alt = alt;



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
COSPLAY IMAGES
=====================================
*/


document
.querySelectorAll(
".cosplay-card img"
)
.forEach(image=>{


image.style.cursor =
"zoom-in";



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
GALLERY IMAGES
=====================================
*/


document
.querySelectorAll(
".gallery-card img"
)
.forEach(image=>{


image.style.cursor =
"zoom-in";



image.addEventListener(
"click",
()=>{


const card =
image.closest(
".gallery-card"
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
"Gallery image"

);



});


});









/*
=====================================
CLOSE BUTTON
=====================================
*/


if(lightboxClose){


lightboxClose.addEventListener(
"click",
closeLightbox
);


}









/*
=====================================
CLICK OUTSIDE IMAGE
=====================================
*/


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
){


closeLightbox();


}



});/*
=====================================
TWITCH STATUS
=====================================
*/


const liveBadge =
document.querySelector(
".live-status"
);



async function updateTwitchStatus(){


if(!liveBadge){

return;

}



try{


/*
 
A API oficial da Twitch exige
OAuth no backend.

Por enquanto deixamos
o sistema preparado para
receber o status real.

*/


const isLive =
false;



if(isLive){


liveBadge.classList.remove(
"offline"
);


liveBadge.classList.add(
"online"
);



liveBadge.innerHTML =
`
<span></span>
LIVE
`;



}else{


liveBadge.classList.remove(
"online"
);


liveBadge.classList.add(
"offline"
);



liveBadge.innerHTML =
`
<span></span>
OFFLINE
`;



}



}catch(error){


console.warn(
"Twitch status error:",
error
);



}


}



updateTwitchStatus();









/*
=====================================
YOUTUBE AUTO UPDATE
=====================================
*/


/*

Para atualizar automaticamente
os últimos vídeos do YouTube
é necessário usar:

- YouTube Data API
- ou backend próprio

O HTML fica preparado
para receber os vídeos.

*/


const youtubeCards =
document.querySelectorAll(
".youtube-card"
);



if(youtubeCards.length){


console.log(
"YouTube cards ready:",
youtubeCards.length
);


}









/*
=====================================
SOCIAL LINKS TRACK
=====================================
*/


document
.querySelectorAll(
".social-info a,
.reference-card a,
.player-info a"
)
.forEach(link=>{


link.addEventListener(
"click",
()=>{


console.log(
"External link opened:",
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
window.scrollY > 600
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
END
=====================================
*/


});
