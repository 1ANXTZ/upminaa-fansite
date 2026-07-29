/* =====================================
   UPMINAA FAN HUB
   Main Javascript
===================================== */


/* =====================================
   GLOBAL SETTINGS
===================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Upminaa Fan Hub loaded"
);



initLightbox();

initBackTop();

initImageFallback();

initYear();

initLiveSystem();

initYoutubeSystem();



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





if(!lightbox || !lightboxImage){

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







closeButton?.addEventListener(
"click",
()=>{


closeImage();


});







lightbox.addEventListener(
"click",
(event)=>{


if(event.target === lightbox){


closeImage();


}


});







document.addEventListener(
"keydown",
(event)=>{


if(event.key === "Escape"){


closeImage();


}



});







function closeImage(){



lightbox.classList.remove(
"active"
);



document.body.style.overflow =
"";



}



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
   IMAGE FALLBACK SYSTEM
===================================== */


function initImageFallback(){



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
"Image failed:",
image.src
);




image.style.filter =
"grayscale(1)";



image.style.opacity =
"0.4";



});


});



}









/* =====================================
   FOOTER YEAR UPDATE
===================================== */


function initYear(){



const year =
new Date()
.getFullYear();





const copyright =
document.querySelector(
".copyright"
);





if(copyright){



copyright.innerHTML =
copyright.innerHTML.replace(
/20\d\d/,
year
);



}



}









/* =====================================
   SCROLL REVEAL ANIMATION
===================================== */


function initScrollReveal(){



const elements =
document.querySelectorAll(
".fact-card, .cosplay-card, .gallery-card, .community-card, .youtube-card, .live-player-card"
);





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
   MOBILE MENU SUPPORT
===================================== */


function initMobileMenu(){



const button =
document.querySelector(
".menu-toggle"
);



const menu =
document.querySelector(
".nav-links"
);





if(!button || !menu){

return;

}






button.addEventListener(
"click",
()=>{



menu.classList.toggle(
"active"
);



button.classList.toggle(
"open"
);



});



}/* =====================================
   TWITCH LIVE SYSTEM
===================================== */


async function initLiveSystem(){


const status =
document.querySelector(
"#liveStatus"
);



const liveCard =
document.querySelector(
".live-player-card"
);




if(!status || !liveCard){

return;

}





try{



const response =
await fetch(
"/api/twitch"
);





if(!response.ok){

throw new Error(
"Twitch API unavailable"
);

}





const data =
await response.json();







if(data.online){



status.textContent =
"LIVE NOW";



liveCard.classList.remove(
"offline"
);



liveCard.classList.add(
"online"
);




if(data.viewers){



status.textContent +=

" • "
+
data.viewers
+
" viewers";


}





}else{



status.textContent =
"OFFLINE";



liveCard.classList.remove(
"online"
);



liveCard.classList.add(
"offline"
);



}





}catch(error){



console.log(
"Twitch API waiting setup:",
error.message
);



status.textContent =
"OFFLINE";



}







}










/* =====================================
   AUTO REFRESH LIVE STATUS
===================================== */


function startLiveRefresh(){



setInterval(
()=>{


initLiveSystem();



},
60000
);



}









/* =====================================
   YOUTUBE VIDEO SYSTEM
===================================== */


async function initYoutubeSystem(){



const players =
document.querySelectorAll(
".youtube-card iframe"
);





if(!players.length){

return;

}






try{



const response =
await fetch(
"/api/youtube"
);






if(!response.ok){

throw new Error(
"YouTube API unavailable"
);

}






const videos =
await response.json();






players.forEach(
(player,index)=>{



const video =
videos[index];



if(video){



player.src =

"https://www.youtube.com/embed/"

+
video.id;



}



});






}catch(error){



console.log(
"YouTube API waiting setup:",
error.message
);



}





}









/* =====================================
   AUTO LOAD YOUTUBE WHEN READY
===================================== */


function setupYoutubePlaceholders(){



const cards =
document.querySelectorAll(
".youtube-card"
);






cards.forEach(
(card,index)=>{



card.dataset.position =
index + 1;



});



}










/* =====================================
   API STARTUP
===================================== */



function initAPISystems(){



initLiveSystem();


initYoutubeSystem();


setupYoutubePlaceholders();


startLiveRefresh();



}
