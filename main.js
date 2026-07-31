/*
=====================================
UPMINAA FAN HUB
MAIN.JS
FINAL VERSION
=====================================
*/


/*
=====================================
LOADER
=====================================
*/


const loader = document.getElementById("loader");


window.addEventListener(
"load",
()=>{

if(loader){

setTimeout(
()=>{

loader.classList.add("hidden");

},
500
);

}

}

);








/*
=====================================
DOM READY
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{





/*
=====================================
YEAR
=====================================
*/


const year =
document.getElementById("year");



if(year){

year.textContent =
new Date().getFullYear();

}








/*
=====================================
MOBILE MENU
=====================================
*/


const menu =
document.getElementById("navToggle");


const nav =
document.getElementById("navLinks");





if(menu && nav){


menu.addEventListener(
"click",
()=>{


nav.classList.toggle("open");


menu.classList.toggle("open");


}

);


}





document
.querySelectorAll("#navLinks a")
.forEach(
link=>{


link.addEventListener(
"click",
()=>{


nav?.classList.remove("open");


menu?.classList.remove("open");


}

);


}

);









/*
=====================================
SMOOTH SCROLL
=====================================
*/


document
.querySelectorAll('a[href^="#"]')
.forEach(
anchor=>{


anchor.addEventListener(
"click",
event=>{


const target =
document.querySelector(
anchor.getAttribute("href")
);




if(target){


event.preventDefault();



target.scrollIntoView({

behavior:"smooth"

});


}



}

);


}

);








/*
=====================================
BACK TO TOP
=====================================
*/


const backTop =
document.getElementById(
"backTop"
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



}

);






backTop.addEventListener(
"click",
()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


}

);

}


/*
=====================================
REVEAL ANIMATION
=====================================
*/


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



}

);



},

{

threshold:.15

}

);







revealElements.forEach(

element=>{


observer.observe(element);


}

);









/*
=====================================
LIGHTBOX SYSTEM
=====================================
*/


const lightbox =

document.getElementById(
"imageLightbox"
);




const lightboxImage =

document.getElementById(
"lightboxImage"
);






const clickableImages =

document.querySelectorAll(

".lightbox-image"

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
CLICKABLE IMAGES
=====================================
*/


clickableImages.forEach(

image=>{


image.addEventListener(

"click",

()=>{


openLightbox(image);


}

);


}

);








/*
CLOSE BUTTON
=====================================
*/


const closeButton =

document.querySelector(
".lightbox-close"
);




if(closeButton){



closeButton.addEventListener(

"click",

()=>{


closeLightbox();


}

);


}








/*
CLICK OUTSIDE IMAGE
=====================================
*/


if(lightbox){



lightbox.addEventListener(

"click",

event=>{



if(event.target === lightbox){


closeLightbox();


}



}

);


}









/*
ESC KEY CLOSE
=====================================
*/


document.addEventListener(

"keydown",

event=>{


if(event.key === "Escape"){


closeLightbox();


}



}

);









/*
=====================================
IMAGE ERROR HANDLER
=====================================
*/


document

.querySelectorAll("img")

.forEach(

image=>{



image.addEventListener(

"error",

()=>{



console.warn(

"Image not found:",

image.src

);



}

);



}

);





/*
=====================================
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =

"upminaa";





const twitchLivePlayer =

document.getElementById(
"twitchEmbedWrap"
);





const twitchBadge =

document.getElementById(
"twitchStatusBadge"
);





const heroStatus =

document.querySelector(
".hero-image .live-status"
);









function getParentDomain(){



let host =

window.location.hostname;





if(

host === "" ||

host === "localhost"

){


return "localhost";


}





return host;



}









/*
CREATE TWITCH LIVE PLAYER
=====================================
*/


function createTwitchLive(){



const iframe =

document.createElement(
"iframe"
);





iframe.src =

`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;





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









/*
CHECK LIVE STATUS
=====================================
*/


async function checkTwitchLive(){



try{



const response =

await fetch(

`https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`

);





const text =

await response.text();







return !text

.toLowerCase()

.includes(

"offline"

);





}

catch(error){



console.warn(

"Twitch status error:",

error

);



return false;



}



}









/*
UPDATE LIVE STATUS
=====================================
*/


async function updateLiveStatus(){



const online =

await checkTwitchLive();







/*
HERO LIVE BADGE
*/




if(heroStatus){



if(online){



heroStatus.textContent =

"LIVE";



heroStatus.classList.add(
"online"
);



heroStatus.classList.remove(
"offline"
);





}else{



heroStatus.textContent =

"OFFLINE";



heroStatus.classList.add(
"offline"
);



heroStatus.classList.remove(
"online"
);



}



}









/*
LIVE PLAYER
*/




if(twitchLivePlayer){



if(online){



if(

!twitchLivePlayer.querySelector(
"iframe"
)

){



twitchLivePlayer.innerHTML =

"";




twitchLivePlayer.appendChild(

createTwitchLive()

);



}



}else{



twitchLivePlayer.innerHTML =

`

<div class="offline-message">

<p>

Stream is currently offline.

</p>

</div>

`;



}



}









/*
STATUS BADGE
*/


if(twitchBadge){



const statusText =

twitchBadge.querySelector(
".status-text"
);





if(online){



twitchBadge.classList.add(
"online"
);



twitchBadge.classList.remove(
"offline"
);





if(statusText){


statusText.textContent =

"LIVE";


}





}else{



twitchBadge.classList.add(
"offline"
);



twitchBadge.classList.remove(
"online"
);





if(statusText){


statusText.textContent =

"OFFLINE";


}





}



}



}









updateLiveStatus();





setInterval(

updateLiveStatus,

120000

);









/*
=====================================
LATEST TWITCH LIVE / VOD
=====================================
*/


const vodContainer =

document.getElementById(
"latestVod"
);









async function loadLatestVod(){



if(!vodContainer){

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

videos &&

videos.length

){





const latest =

videos[0];








vodContainer.innerHTML =

`

<iframe

src="https://player.twitch.tv/?video=${latest.id}&parent=${getParentDomain()}&muted=true"

title="Latest Upminaa stream"

frameborder="0"

scrolling="no"

allowfullscreen>

</iframe>

`;







}else{



vodContainer.innerHTML =

`

<p>

No recorded streams available.

</p>

`;



}







}

catch(error){



console.warn(

"Latest VOD loading error:",

error

);





vodContainer.innerHTML =

`

<p>

Unable to load latest stream.

</p>

`;



}





}








loadLatestVod();/*
=====================================
YOUTUBE SYSTEM
=====================================
*/


const YOUTUBE_CHANNEL_ID =

"UCw3CBMvVjZJNfQR3tEvTodQ";





const youtubeGrid =

document.getElementById(
"youtubeGrid"
);









async function loadYoutube(){



if(!youtubeGrid){

return;

}






try{



const feed =

`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;






const proxy =

"https://api.allorigins.win/raw?url=";







const response =

await fetch(

proxy +

encodeURIComponent(feed)

);







const xmlText =

await response.text();







const xml =

new DOMParser()

.parseFromString(

xmlText,

"text/xml"

);







const entries =

[

...xml.querySelectorAll(
"entry"
)

];







const videos =

entries

.slice(

0,

4

)

.map(

video=>{





return {


id:

video

.querySelector(
"yt\\:videoId"
)

?.textContent,





title:

video

.querySelector(
"title"
)

?.textContent

||

"Upminaa Video"





};





}

)

.filter(

video=>video.id

);








if(videos.length){



renderYoutube(videos);



}else{



showYoutubeError();



}







}

catch(error){



console.warn(

"YouTube loading error:",

error

);





showYoutubeError();



}





}









/*
YOUTUBE ERROR MESSAGE
=====================================
*/


function showYoutubeError(){



youtubeGrid.innerHTML =

`

<article class="youtube-card">

<div class="video-wrapper">

<p>

Videos are currently unavailable.

</p>

</div>

</article>

`;



}









/*
RENDER YOUTUBE CARDS
=====================================
*/


function renderYoutube(videos){



youtubeGrid.innerHTML =

"";







videos.forEach(

video=>{






const card =

document.createElement(
"article"
);





card.className =

"youtube-card";








card.innerHTML =

`

<div class="video-wrapper">


<iframe


src="https://www.youtube.com/embed/${video.id}"


title="${video.title}"


loading="lazy"


allowfullscreen>


</iframe>


</div>





<div class="video-info">


<h4>

${video.title}

</h4>


</div>

`;







youtubeGrid.appendChild(
card
);






}

);



}









loadYoutube();









/*
=====================================
PLAYER DEBUG
=====================================
*/


document

.querySelectorAll(
"iframe"
)

.forEach(

player=>{



player.addEventListener(

"load",

()=>{



console.log(

"Player loaded:",

player.src

);



}

);



}

);/*
=====================================
GLOBAL ERROR HANDLER
=====================================
*/


window.addEventListener(

"error",

event=>{


console.error(

`

=================================

UPMINAA FAN HUB ERROR

=================================


Message:

${event.message}



File:

${event.filename}



Line:

${event.lineno}



=================================

`

);



}

);









/*
=====================================
MEDIA AUTO UPDATE
=====================================
*/


function refreshMedia(){



updateLiveStatus();



loadLatestVod();



loadYoutube();



}







/*
Refresh media every 5 minutes
*/


setInterval(

refreshMedia,

300000

);









/*
=====================================
FINAL SYSTEM STATUS
=====================================
*/


console.log(

`

=================================

UPMINAA FAN HUB

MAIN.JS FINAL VERSION


SYSTEM ONLINE ✅



FEATURES:



✓ Loader System

✓ Mobile Navigation

✓ Smooth Scrolling

✓ Reveal Animations

✓ Image Lightbox

✓ Clickable Cosplay Cards

✓ Twitch Live Detection

✓ Twitch Live Player

✓ Latest Twitch VOD

✓ YouTube Video Feed

✓ Responsive Media Players

✓ Auto Media Refresh



=================================

`

);







});
