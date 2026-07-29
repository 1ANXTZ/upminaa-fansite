/* =====================================
   UPMINAA FAN HUB
   MAIN JAVASCRIPT
===================================== */


"use strict";





document.addEventListener(
"DOMContentLoaded",
function(){



console.log(
"Upminaa Fan Hub initialized"
);





initLightbox();


initBackTop();


initScrollReveal();


initImageProtection();


initSmoothScroll();


initTwitchStatus();


initVideoPlaceholders();




});/* =====================================
   IMAGE LIGHTBOX
===================================== */


function initLightbox(){



const links = document.querySelectorAll(
".cosplay-link, .gallery-link"
);



const lightbox = document.querySelector(
"#imageLightbox"
);



const image = document.querySelector(
"#lightboxImage"
);



const close = document.querySelector(
".lightbox-close"
);





if(
!lightbox ||
!image
){

return;

}







function openLightbox(src, alt){



image.src = src;


image.alt = alt;



lightbox.classList.add(
"active"
);



document.body.style.overflow =
"hidden";



}







function closeLightbox(){



lightbox.classList.remove(
"active"
);



image.src = "";



document.body.style.overflow =
"";



}








links.forEach(
(link)=>{



link.addEventListener(
"click",
function(event){



event.preventDefault();





const img =
link.querySelector(
"img"
);





if(!img){

return;

}





openLightbox(
img.src,
img.alt
);



});



});









close?.addEventListener(
"click",
closeLightbox
);









lightbox.addEventListener(
"click",
function(event){



if(
event.target === lightbox
){


closeLightbox();


}



});









document.addEventListener(
"keydown",
function(event){



if(
event.key === "Escape"
){


closeLightbox();


}



});



}/* =====================================
   BACK TO TOP
===================================== */


function initBackTop(){



const button =
document.querySelector(
".back-top"
);





if(!button){

return;

}








window.addEventListener(
"scroll",
function(){



if(
window.scrollY > 500
){



button.classList.add(
"show"
);



}else{



button.classList.remove(
"show"
);



}



});









button.addEventListener(
"click",
function(){



window.scrollTo({

top:0,

behavior:"smooth"

});



});



}









/* =====================================
   SCROLL REVEAL
===================================== */


function initScrollReveal(){



const elements =
document.querySelectorAll(
`
.fact-card,
.cosplay-card,
.featured-cosplay-card,
.gallery-item,
.community-card,
.youtube-card,
.live-player-card,
.latest-stream-card
`
);






if(
!elements.length
){

return;

}








const observer =
new IntersectionObserver(
function(entries){



entries.forEach(
function(entry){



if(
entry.isIntersecting
){



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

}

);








elements.forEach(
function(element){



observer.observe(
element
);



});



}









/* =====================================
   IMAGE ERROR HANDLER
===================================== */


function initImageProtection(){



const images =
document.querySelectorAll(
"img"
);








images.forEach(
function(image){



image.addEventListener(
"error",
function(){



console.warn(
"Image not found:",
image.src
);





image.style.objectFit =
"cover";



image.style.opacity =
"0.4";



});



});



}









/* =====================================
   SMOOTH SCROLL
===================================== */


function initSmoothScroll(){



const links =
document.querySelectorAll(
'a[href^="#"]'
);








links.forEach(
function(link){



link.addEventListener(
"click",
function(event){



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



}/* =====================================
   TWITCH PLAYER STATUS
===================================== */


function initTwitchStatus(){



const status =
document.querySelector(
"#liveStatus"
);



const heroStatus =
document.querySelector(
"#heroLiveStatus"
);





if(!status){

return;

}






/*

GitHub Pages não consegue
consultar Twitch API diretamente.

Esse sistema deixa o player pronto
e evita erro visual.

A API real deve ficar em
Netlify Function futuramente.

*/






const player =
document.querySelector(
"#twitchPlayer"
);







if(player){



status.textContent =
"PLAYER READY";



}





if(heroStatus){



heroStatus.innerHTML =
`
<span></span>
STREAM AVAILABLE
`;



}



}









/* =====================================
   YOUTUBE VIDEO HANDLER
===================================== */


function initVideoPlaceholders(){



const videos =
document.querySelectorAll(
".youtube-card iframe"
);






if(!videos.length){

return;

}







videos.forEach(
(video)=>{



if(
video.src.includes(
"VIDEO_ID"
)
){



video.parentElement.style.display =
"none";



}



});



}









/* =====================================
   IFRAME LOAD CHECK
===================================== */


function initIframeProtection(){



const frames =
document.querySelectorAll(
"iframe"
);






frames.forEach(
(frame)=>{



frame.addEventListener(
"load",
()=>{



frame.classList.add(
"loaded"
);



});



});



}








/* =====================================
   FOOTER YEAR
===================================== */


function updateFooterYear(){



const copyright =
document.querySelector(
".copyright"
);






if(!copyright){

return;

}







copyright.textContent =
copyright.textContent.replace(
/20\d{2}/,
new Date()
.getFullYear()
);



}





document.addEventListener(
"DOMContentLoaded",
function(){



initIframeProtection();


updateFooterYear();



});
