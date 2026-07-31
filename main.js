/*
=====================================
UPMINAA FAN HUB
MAIN.JS
FINAL VERSION
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


/* ==============================
MOBILE MENU
============================== */


const menuButton =
document.querySelector(
".nav-toggle"
);


const navLinks =
document.querySelector(
".nav-links"
);



if(
menuButton &&
navLinks
){


menuButton.addEventListener(
"click",
()=>{


navLinks.classList.toggle(
"open"
);


});


}






/* ==============================
SMOOTH SCROLL
============================== */


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


target.scrollIntoView(
{

behavior:"smooth"

}

);


}


});


});







/* ==============================
REVEAL ANIMATION
============================== */


const revealElements =
document.querySelectorAll(
`
.profile-card,
.curiosity-card,
.cosplay-card,
.gallery-card,
.live-player-card,
.youtube-card,
.social-card
`
);



const revealObserver =
new IntersectionObserver(
entries=>{


entries.forEach(
entry=>{


if(
entry.isIntersecting
){


entry.target.classList.add(
"visible"
);


}


});


},
{

threshold:0.1

}

);





revealElements.forEach(
element=>{


revealObserver.observe(
element
);


});







/* ==============================
BACK TO TOP
============================== */


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


}

else{


backTop.classList.remove(
"show"
);


}


});




backTop.addEventListener(
"click",
()=>{


window.scrollTo(
{

top:0,

behavior:"smooth"

}

);


});


}






/* ==============================
YEAR
============================== */


const year =
document.querySelector(
"#year"
);



if(year){


year.textContent =
new Date()
.getFullYear();


}





});/*
=====================================
LIGHTBOX SYSTEM
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{



const lightbox =
document.querySelector(
".lightbox"
);



const lightboxImage =
document.querySelector(
".lightbox img"
);



const closeButton =
document.querySelector(
".lightbox-close"
);





const clickableImages =
document.querySelectorAll(
`
.cosplay-card img,
.gallery-card img
`
);







function openLightbox(image){


if(
!lightbox ||
!lightboxImage
){

return;

}



lightboxImage.src =
image.src;


lightboxImage.alt =
image.alt;


lightbox.classList.add(
"active"
);



}








function closeLightbox(){


if(
!lightbox
){

return;

}



lightbox.classList.remove(
"active"
);



}





clickableImages.forEach(
image=>{


image.classList.add(
"lightbox-image"
);



image.addEventListener(
"click",
event=>{


event.preventDefault();


event.stopPropagation();


openLightbox(
image
);



});


});









if(closeButton){


closeButton.addEventListener(
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



});/*
=====================================
TWITCH LIVE SYSTEM
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{



const TWITCH_CHANNEL =
"upminaa";



const twitchContainer =
document.querySelector(
"#twitchEmbedWrap"
);



const heroLive =
document.querySelector(
".hero-image .live-status"
);



const streamLiveBadge =
document.querySelector(
"#twitchStatusBadge"
);






function getParent(){


const host =
window.location.hostname;



if(
host === ""
||
host === "localhost"
){


return "localhost";


}



return host;


}







function createTwitchIframe(){



const iframe =
document.createElement(
"iframe"
);



iframe.src =

`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParent()}&muted=true`;



iframe.width =
"100%";



iframe.height =
"100%";



iframe.frameBorder =
"0";



iframe.allowFullscreen =
true;



iframe.allow =
"autoplay; fullscreen";



return iframe;



}








function setLiveStatus(
online
){



const badges = [

heroLive,

streamLiveBadge

];





badges.forEach(
badge=>{


if(
!badge
){

return;

}



badge.classList.remove(
"online",
"offline"
);





if(
online
){


badge.classList.add(
"online"
);


}

else{


badge.classList.add(
"offline"
);


}




});


}








async function checkLive(){



try{



const response =
await fetch(

`https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`

);



const text =
await response.text();





return !

text
.toLowerCase()
.includes(
"offline"
);



}

catch(error){



console.warn(
"Twitch check unavailable",
error
);



return false;


}



}








async function updateLive(){



const online =
await checkLive();




setLiveStatus(
online
);








/*
==============================
HERO BADGE
==============================
*/


if(
heroLive
){


heroLive.innerHTML = `

<span class="status-dot"></span>

LIVE

`;


}








/*
==============================
PLAYER
==============================
*/


if(
twitchContainer &&
online
){



const hasPlayer =
twitchContainer.querySelector(
"iframe"
);



if(
!hasPlayer
){


twitchContainer.innerHTML =
"";


twitchContainer.appendChild(
createTwitchIframe()
);


}


}








}



updateLive();




setInterval(
updateLive,
120000
);



});/*
=====================================
LATEST STREAM + YOUTUBE SYSTEM
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{





/* ==============================
LATEST TWITCH STREAM
============================== */


const latestStream =
document.querySelector(
"#latestVod"
);




const TWITCH_CHANNEL =
"upminaa";







function twitchParent(){


const host =
window.location.hostname;



if(
!host
||
host === "localhost"
){


return "localhost";


}



return host;


}








async function loadLatestStream(){



if(
!latestStream
){

return;

}




try{



const response =
await fetch(

`https://decapi.me/twitch/videos/${TWITCH_CHANNEL}`

);





const videos =
await response.json();






if(
Array.isArray(videos)
&&
videos.length > 0
){



const vod =
videos[0];






latestStream.innerHTML = `


<iframe

src="https://player.twitch.tv/?video=${vod.id}&parent=${twitchParent()}"

title="Latest Upminaa Twitch Stream"

allowfullscreen

frameborder="0"

>

</iframe>


`;



}





}

catch(error){



console.warn(

"Latest stream unavailable:",

error

);



}






}









loadLatestStream();











/* ==============================
YOUTUBE PLAYERS
============================== */



const youtubeCards =
document.querySelectorAll(
".youtube-card"
);







youtubeCards.forEach(
card=>{



const iframe =
card.querySelector(
"iframe"
);





if(
iframe
){



iframe.loading =
"lazy";



iframe.allowFullscreen =
true;



}



});









/*
DO NOT REMOVE STATIC HTML

The YouTube cards are already
inside index.html.

The JS only improves them.
*/


});/*
=====================================
FINAL SYSTEM CHECK
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{






/* ==============================
IMAGE ERROR PROTECTION
============================== */


const images =
document.querySelectorAll(
"img"
);



images.forEach(
image=>{


image.addEventListener(
"error",
()=>{


console.warn(

"Image failed:",
image.src

);



});


});









/* ==============================
IFRAME MONITOR
============================== */


const players =
document.querySelectorAll(
"iframe"
);



players.forEach(
player=>{


player.addEventListener(
"load",
()=>{


console.log(

"Media loaded:",
player.src

);



});


});









/* ==============================
ACTIVE NAV LINK
============================== */


const sections =
document.querySelectorAll(
"section"
);



const navItems =
document.querySelectorAll(
".nav-links a"
);







if(
sections.length &&
navItems.length
){



window.addEventListener(
"scroll",
()=>{


let current = "";



sections.forEach(
section=>{


const top =
section.offsetTop - 150;



if(
window.scrollY >= top
){


current =
section.id;


}



});






navItems.forEach(
link=>{


link.classList.remove(
"active"
);



if(
link
.getAttribute(
"href"
)
===
`#${current}`
){


link.classList.add(
"active"
);



}



});




});



}








/* ==============================
CLOSE MOBILE MENU
============================== */


const links =
document.querySelectorAll(
".nav-links a"
);



const menu =
document.querySelector(
".nav-links"
);





links.forEach(
link=>{


link.addEventListener(
"click",
()=>{


if(
menu
){


menu.classList.remove(
"open"
);


}



});


});









/* ==============================
FINAL READY MESSAGE
============================== */


console.log(`

=================================

UPMINAA FAN HUB

SYSTEM READY ✅


Loaded:

✓ Navigation
✓ Smooth Scroll
✓ Reveal Animation
✓ Lightbox
✓ Twitch Support
✓ Latest Stream
✓ YouTube Players
✓ Image Protection
✓ Responsive Controls


=================================

`);





});
