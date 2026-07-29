/* =====================================
   UPMINAA FAN HUB
   MAIN JAVASCRIPT
===================================== */



document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Upminaa Fan Hub loaded successfully"
);



initLightbox();


initBackTop();


initImageProtection();


initScrollReveal();


initFooterYear();


initTwitchStatus();



});/* =====================================
   IMAGE LIGHTBOX SYSTEM
===================================== */


function initLightbox(){



const imageLinks = 
document.querySelectorAll(
".cosplay-link, .gallery-link"
);



const lightbox =
document.querySelector(
"#imageLightbox"
);



const lightboxImage =
document.querySelector(
"#lightboxImage"
);



const closeButton =
document.querySelector(
".lightbox-close"
);





if(
!lightbox ||
!lightboxImage
){

return;

}








imageLinks.forEach(
(link)=>{



link.addEventListener(
"click",
(event)=>{



event.preventDefault();





const image =
link.querySelector(
"img"
);





if(!image){

return;

}





lightboxImage.src =
image.src;



lightboxImage.alt =
image.alt;



lightbox.classList.add(
"active"
);





document.body.style.overflow =
"hidden";



});



});









function closeLightbox(){



lightbox.classList.remove(
"active"
);



document.body.style.overflow =
"";



}








closeButton?.addEventListener(
"click",
()=>{


closeLightbox();


});









lightbox.addEventListener(
"click",
(event)=>{



if(
event.target === lightbox
){


closeLightbox();


}



});









document.addEventListener(
"keydown",
(event)=>{



if(
event.key === "Escape"
){


closeLightbox();


}



});





}/* =====================================
   BACK TO TOP BUTTON
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
()=>{



if(window.scrollY > 500){



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
()=>{



window.scrollTo({

top:0,

behavior:"smooth"

});



});



}









/* =====================================
   SCROLL REVEAL ANIMATION
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






if(!elements.length){

return;

}







const observer =
new IntersectionObserver(
(entries)=>{



entries.forEach(
(entry)=>{



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

}

);








elements.forEach(
(element)=>{


observer.observe(
element
);



});



}









/* =====================================
   IMAGE ERROR PROTECTION
===================================== */


function initImageProtection(){



const images =
document.querySelectorAll(
"img"
);






images.forEach(
(image)=>{



image.addEventListener(
"error",
()=>{



console.warn(
"Failed image:",
image.src
);





image.style.opacity =
"0.35";



image.alt =
"Image unavailable";



});



});



}









/* =====================================
   AUTOMATIC FOOTER YEAR
===================================== */


function initFooterYear(){



const copyright =
document.querySelector(
".copyright"
);





if(!copyright){

return;

}






const year =
new Date()
.getFullYear();





copyright.innerHTML =
copyright.innerHTML.replace(
/20\d\d/,
year
);



}/* =====================================
   TWITCH STATUS SYSTEM
===================================== */


function initTwitchStatus(){



const liveCard =
document.querySelector(
".live-player-card"
);



const liveStatus =
document.querySelector(
"#liveStatus"
);






if(
!liveCard ||
!liveStatus
){

return;

}





/*

O GitHub Pages não consegue
consultar a Twitch API diretamente
sem expor chave.

Por enquanto o player funciona
normalmente e o status fica preparado
para API futura.

*/





const iframe =
liveCard.querySelector(
"iframe"
);






if(iframe){



liveStatus.textContent =
"STREAM PLAYER READY";



}





}









/* =====================================
   IFRAME ERROR PROTECTION
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
   SMOOTH INTERNAL LINKS
===================================== */


function initSmoothLinks(){



const links =
document.querySelectorAll(
'a[href^="#"]'
);






links.forEach(
(link)=>{



link.addEventListener(
"click",
(event)=>{



const target =
document.querySelector(
link.getAttribute("href")
);





if(target){



event.preventDefault();



target.scrollIntoView({

behavior:"smooth"

});



}



});



});



}









/* =====================================
   FINAL INITIALIZATION
===================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


initIframeProtection();


initSmoothLinks();



});
