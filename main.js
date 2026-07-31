/*
=====================================
UPMINAA FAN HUB
main.js
FINAL VERSION
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
.fact-card,
.cosplay-card,
.gallery-card,
.live-player-card,
.youtube-card,
.social-card,
.reference-card
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

}


);






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


const lightbox =
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




let savedScrollPosition = 0;







function openLightbox(
src,
altText=""
){



if(
!lightbox ||
!lightboxImage
){

return;

}





savedScrollPosition =
window.scrollY;




lightboxImage.src =
src;



lightboxImage.alt =
altText;



lightbox.classList.add(
"active"
);



document.body.style.overflow =
"hidden";



}





function closeLightbox(){



if(!lightbox){

return;

}





lightbox.classList.remove(
"active"
);



document.body.style.overflow =
"";




setTimeout(()=>{


window.scrollTo({

top:savedScrollPosition

});


},10);



}/*
=====================================
CLICKABLE IMAGES
=====================================
*/


const clickableImages =
document.querySelectorAll(
".lightbox-trigger"
);





clickableImages.forEach(
image=>{


image.style.cursor =
"pointer";




image.addEventListener(
"click",
event=>{


event.preventDefault();





const card =
image.closest(
".cosplay-card, .gallery-card"
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
image.alt

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






if(lightbox){


lightbox.addEventListener(
"click",
event=>{


if(
event.target === lightbox
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
TWITCH PLAYER CHECK
=====================================
*/


const twitchPlayers =
document.querySelectorAll(
".player-wrapper iframe"
);





twitchPlayers.forEach(
player=>{


player.addEventListener(
"load",
()=>{


console.log(
"Twitch player loaded"
);


});





player.addEventListener(
"error",
()=>{


console.warn(
"Twitch player error"
);


});


});









/*
=====================================
YOUTUBE PLAYER CHECK
=====================================
*/


const youtubePlayers =
document.querySelectorAll(
".video-wrapper iframe"
);





youtubePlayers.forEach(
player=>{


player.addEventListener(
"load",
()=>{


console.log(
"YouTube player loaded"
);


});





player.addEventListener(
"error",
()=>{


console.warn(
"YouTube player error"
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


}/*
=====================================
LIVE STATUS
=====================================
*/


const liveBadge =
document.querySelector(
".live-status"
);






function updateLiveStatus(
isLive
){



if(!liveBadge){

return;

}





if(isLive){



liveBadge.classList.remove(
"offline"
);



liveBadge.classList.add(
"online"
);



liveBadge.textContent =
"● LIVE";



}else{



liveBadge.classList.remove(
"online"
);



liveBadge.classList.add(
"offline"
);



liveBadge.textContent =
"● OFFLINE";



}


}





/*

Padrão começa offline.

Quando conectar Twitch API:

updateLiveStatus(true);

para LIVE.

updateLiveStatus(false);

para OFFLINE.

*/



updateLiveStatus(false);












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
