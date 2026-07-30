/*
=====================================
UPMINAA FAN HUB
MAIN JAVASCRIPT
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


const nav =
document.querySelector(
".nav-links"
);



if(menuButton && nav){


menuButton.addEventListener(
"click",
()=>{


nav.classList.toggle(
"active"
);



});


}









/*
=====================================
SCROLL REVEAL
=====================================
*/


const revealElements =
document.querySelectorAll(
`
.cosplay-card,
.gallery-card,
.stream-card,
.video-card,
.social-card,
.reference-card,
.bio-card,
.detail-card,
.source-card
`
);






const observer =
new IntersectionObserver(
entries=>{


entries.forEach(entry=>{


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






revealElements.forEach(
element=>{


observer.observe(
element
);



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



const closeButton =
document.querySelector(
"#lightboxClose"
);






function openLightbox(
imageSrc,
imageAlt
){


if(
!lightbox ||
!lightboxImage
){

return;

}



lightboxImage.src =
imageSrc;



lightboxImage.alt =
imageAlt || "Expanded image";



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



}









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
"pointer";



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
COSPLAY IMAGES
=====================================
*/


document
.querySelectorAll(
".cosplay-card img"
)
.forEach(image=>{


image.style.cursor =
"pointer";



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
CLOSE BUTTON
=====================================
*/


if(closeButton){


closeButton.addEventListener(
"click",
closeLightbox
);



}








/*
=====================================
CLICK OUTSIDE IMAGE
=====================================
*/


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








/*
=====================================
ESC KEY
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
IMAGE ERROR CHECK
=====================================
*/


document
.querySelectorAll(
"img"
)
.forEach(image=>{


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
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";



const twitchFrames =
document.querySelectorAll(
".stream-card iframe"
);





twitchFrames.forEach(
(frame,index)=>{


frame.addEventListener(
"load",
()=>{


console.log(
"Twitch player loaded:",
index + 1
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
YOUTUBE AUTO UPDATE
=====================================
*/


/*

Para ativar:

1 - criar uma API Key do YouTube
2 - colocar abaixo
3 - colocar o ID do canal

*/




const YOUTUBE_API_KEY =
"YOUR_API_KEY";



const YOUTUBE_CHANNEL_ID =
"YOUR_CHANNEL_ID";







async function loadYoutubeVideos(){



if(
YOUTUBE_API_KEY === "YOUR_API_KEY"
||
YOUTUBE_CHANNEL_ID === "YOUR_CHANNEL_ID"
){

console.log(
"YouTube API not configured"
);


return;


}





try{


const response =
await fetch(

`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=4`

);



const data =
await response.json();





const videos =
data.items.filter(
item=>

item.id.kind ===
"youtube#video"

);





const containers =
document.querySelectorAll(
".video-card"
);





videos.forEach(
(video,index)=>{



if(containers[index]){



const iframe =
containers[index]
.querySelector(
"iframe"
);



if(iframe){



iframe.src =

`https://www.youtube.com/embed/${video.id.videoId}`;



}





const title =
containers[index]
.querySelector(
"h4"
);



if(title){



title.textContent =
video.snippet.title;



}



}



});




}
catch(error){


console.error(
"Youtube error:",
error
);



}



}




loadYoutubeVideos();









/*
=====================================
SOCIAL LINKS TRACK
=====================================
*/


document
.querySelectorAll(
".social-content a"
)
.forEach(link=>{


link.addEventListener(
"click",
()=>{


console.log(
"Opening:",
link.href
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
'a[target="_blank"]'
)
.forEach(link=>{


link.setAttribute(
"rel",
"noopener noreferrer"
);



});/*
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



}
else
{



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
LAZY LOAD IMAGES
=====================================
*/


document
.querySelectorAll(
"img"
)
.forEach(
image=>{


image.loading =
"lazy";



});









/*
=====================================
CURRENT YEAR
=====================================
*/


const year =
document.querySelector(
".copyright"
);



if(year){


year.innerHTML =

year.innerHTML.replace(

"2026",

new Date()
.getFullYear()

);



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
PAGE READY
=====================================
*/


console.log(

"Upminaa Fan Hub fully loaded"

);



});
