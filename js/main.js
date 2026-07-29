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
CARD REVEAL ANIMATION
=====================================
*/


const animatedElements =
document.querySelectorAll(
`
.fact-card,
.cosplay-card,
.gallery-item,
.youtube-card,
.live-player-card,
.latest-stream-card
`
);



if(animatedElements.length){



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

threshold:.15

});





animatedElements.forEach(
element=>{


observer.observe(
element
);


});


}









/*
=====================================
REMOVE BROKEN IFRAME SOURCES
=====================================
*/


document
.querySelectorAll(
"iframe"
)
.forEach(frame=>{


frame.addEventListener(
"error",
()=>{


console.warn(
"Iframe failed:",
frame.src
);


});



});






});/*
=====================================
LIGHTBOX
=====================================
*/


const lightbox =
document.querySelector(
"#imageLightbox"
);



const lightboxImage =
document.querySelector(
"#lightboxImage"
);



const closeLightbox =
document.querySelector(
".lightbox-close"
);






function openLightbox(imageSrc){


if(!lightbox || !lightboxImage)
return;



lightboxImage.src =
imageSrc;



lightbox.classList.add(
"active"
);



document.body.style.overflow =
"hidden";


}






function closeImageLightbox(){


if(!lightbox)
return;



lightbox.classList.remove(
"active"
);



document.body.style.overflow =
"";


}







/*
=====================================
IMAGENS CLICÁVEIS
=====================================
*/


document
.querySelectorAll(
".cosplay-link, .gallery-link"
)
.forEach(item=>{


item.addEventListener(
"click",
event=>{


event.preventDefault();



const image =
item.querySelector(
"img"
);



if(image){


openLightbox(
image.src
);


}



});


});







/*
=====================================
FECHAR LIGHTBOX
=====================================
*/


if(closeLightbox){


closeLightbox.addEventListener(
"click",
closeImageLightbox
);


}






if(lightbox){


lightbox.addEventListener(
"click",
event=>{


if(
event.target === lightbox
){


closeImageLightbox();


}


});


}






document.addEventListener(
"keydown",
event=>{


if(
event.key === "Escape"
&&
lightbox?.classList.contains("active")
){


closeImageLightbox();


}


});/*
=====================================
TWITCH PLAYER
=====================================
*/


const twitchFrame =
document.querySelector(
".twitch-player iframe"
);



if(twitchFrame){


twitchFrame.addEventListener(
"load",
()=>{


console.log(
"Twitch player loaded"
);


});



}









/*
=====================================
YOUTUBE PLAYERS
=====================================
*/


const youtubeFrames =
document.querySelectorAll(
".youtube-card iframe"
);



youtubeFrames.forEach(
(frame)=>{


const src =
frame.getAttribute(
"src"
);



/*
 Remove players sem ID real
*/


if(
!src ||
src.includes(
"VIDEO_ID"
)
){


frame.parentElement.style.display =
"none";



console.warn(
"YouTube iframe sem vídeo configurado"
);


return;


}




frame.addEventListener(
"load",
()=>{


console.log(
"YouTube player loaded"
);


});



});









/*
=====================================
IMAGENS QUEBRADAS
=====================================
*/


document
.querySelectorAll(
"img"
)
.forEach(
(img)=>{


img.addEventListener(
"error",
()=>{


console.warn(
"Imagem não encontrada:",
img.src
);



img.style.opacity =
"0.4";



});



});








/*
=====================================
LINKS SOCIAIS
=====================================
*/


const socialLinks =
document.querySelectorAll(
".social-card"
);



socialLinks.forEach(
(link)=>{


link.addEventListener(
"click",
()=>{


console.log(
"Social opened:",
link.textContent.trim()
);


});


});








/*
=====================================
PROTEÇÃO CONTRA ERROS
=====================================
*/


window.addEventListener(
"error",
(event)=>{


console.warn(
"Frontend error:",
event.message
);


});
