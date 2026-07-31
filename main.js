/*
=====================================
UPMINAA FAN HUB
main.js
FINAL PLAYER VERSION
=====================================
*/


/*
=====================================
LOADER
=====================================
*/

const loaderEl = document.getElementById("loader");

if(loaderEl){

window.addEventListener(
"load",
()=>{

setTimeout(
()=>loaderEl.classList.add("hidden"),
400
);

});

setTimeout(
()=>loaderEl.classList.add("hidden"),
2000
);

}





/*
=====================================
YOUTUBE AUTO VIDEOS
=====================================
*/


const YT_CHANNEL_ID =
"UCw3CBMvVjZJNfQR3tEvTodQ";


const YT_VIDEO_COUNT = 4;


const YT_RSS_URL =
`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;



const YT_PROXIES = [

url =>
`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,

url =>
`https://corsproxy.io/?url=${encodeURIComponent(url)}`

];





async function fetchLatestVideos(){


let lastError;



for(
const proxy of YT_PROXIES
){


try{


const response =
await fetch(
proxy(YT_RSS_URL)
);



if(!response.ok){

throw new Error(
"RSS error"
);

}




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
]
.slice(
0,
YT_VIDEO_COUNT
);





const videos =
entries.map(
entry=>({

id:
entry
.getElementsByTagName(
"yt:videoId"
)[0]
?.textContent,


title:
entry
.getElementsByTagName(
"title"
)[0]
?.textContent ||
"Upminaa Video"

})
)
.filter(
video=>video.id
);





if(videos.length){

return videos;

}



}

catch(error){

lastError = error;

}



}



throw lastError;


}







function renderYoutubeVideos(
videos
){


const grid =
document.getElementById(
"galleryGrid"
);



if(!grid){

return;

}




grid
.querySelectorAll(
".yt-video-card"
)
.forEach(
item=>item.remove()
);





videos.forEach(
video=>{


const card =
document.createElement(
"figure"
);



card.className =
"gallery-card embed-card yt-video-card";




const iframe =
document.createElement(
"iframe"
);



iframe.src =
`https://www.youtube.com/embed/${video.id}`;



iframe.title =
video.title;



iframe.loading =
"lazy";



iframe.allowFullscreen =
true;



iframe.setAttribute(
"allow",
"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
);




card.appendChild(
iframe
);



grid.appendChild(
card
);



});


}







async function loadYoutubeVideos(){


try{


const videos =
await fetchLatestVideos();


renderYoutubeVideos(
videos
);


console.log(
"YouTube player loaded"
);



}
catch(error){

console.warn(
"YouTube error:",
error
);


}


}



loadYoutubeVideos();





/*
=====================================
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";


const TWITCH_CLIENT_ID =
"kimne78kx3ncx6brgo4mv6wki5h1ko";


const TWITCH_GQL_URL =
"https://gql.twitch.tv/gql";





async function twitchQuery(
query
){


const response =
await fetch(
TWITCH_GQL_URL,
{

method:"POST",

headers:{

"Client-Id":
TWITCH_CLIENT_ID,

"Content-Type":
"application/json"

},


body:
JSON.stringify({

query

})


}

);



const json =
await response.json();



if(json.errors){

throw new Error(
"Twitch API error"
);

}



return json.data;


}/*
=====================================
TWITCH LIVE STATUS
=====================================
*/


async function checkTwitchLive(){


try{


const data =
await twitchQuery(
`
query {

user(login:"${TWITCH_CHANNEL}") {

stream {

id

}

}

}
`
);



return Boolean(
data?.user?.stream
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








async function getLatestTwitchVod(){


try{


const data =
await twitchQuery(
`
query {

user(login:"${TWITCH_CHANNEL}") {

videos(
first:1,
type:ARCHIVE
){

edges {

node {

id

title

}

}

}

}

}
`
);




return data
?.user
?.videos
?.edges?.[0]
?.node || null;



}
catch(error){


console.warn(
"Twitch VOD error:",
error
);



return null;


}


}







function twitchParent(){


return window.location.hostname;


}







function updateTwitchBadge(
online
){


const badge =
document.getElementById(
"twitchStatusBadge"
);



if(!badge){

return;

}



const text =
badge.querySelector(
".status-text"
);



if(online){


badge.classList.remove(
"is-off"
);



badge.classList.add(
"is-on"
);



if(text){

text.textContent =
"AO VIVO";

}



}
else{


badge.classList.remove(
"is-on"
);



badge.classList.add(
"is-off"
);



if(text){

text.textContent =
"OFFLINE";

}



}



}








function createTwitchLivePlayer(){



const wrap =
document.getElementById(
"twitchEmbedWrap"
);



const photo =
document.getElementById(
"twitchStatusPhoto"
);



if(
!wrap ||
wrap.dataset.loaded
){

return;

}




const iframe =
document.createElement(
"iframe"
);



iframe.src =
`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${twitchParent()}&muted=true`;



iframe.title =
"Upminaa Twitch Live";



iframe.allowFullscreen =
true;



iframe.setAttribute(
"allow",
"autoplay"
);



wrap.appendChild(
iframe
);



wrap.classList.add(
"is-visible"
);



wrap.dataset.loaded =
"true";



if(photo){

photo.style.opacity =
"0";

}



console.log(
"Twitch player loaded"
);



}







async function updateTwitch(){


const live =
await checkTwitchLive();



updateTwitchBadge(
live
);



if(live){

createTwitchLivePlayer();

}



}








async function loadTwitchVod(){


const card =
document.getElementById(
"twitchVodCard"
);



if(!card){

return;

}





const vod =
await getLatestTwitchVod();



if(!vod){


card.innerHTML =
`
<div class="yt-loading">
Nenhum VOD encontrado.
</div>
`;


return;


}





const iframe =
document.createElement(
"iframe"
);



iframe.src =
`https://player.twitch.tv/?video=${vod.id}&parent=${twitchParent()}&muted=true`;



iframe.title =
vod.title;



iframe.allowFullscreen =
true;



card.innerHTML =
"";



card.appendChild(
iframe
);



console.log(
"Twitch VOD loaded"
);



}






updateTwitch();


loadTwitchVod();



setInterval(
updateTwitch,
120000
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
FOOTER YEAR
*/


const year =
document.getElementById(
"year"
);



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
document.querySelector(
".menu-toggle, #navToggle"
);



const nav =
document.querySelector(
".nav-links, #navLinks"
);



if(
menu &&
nav
){


menu.addEventListener(
"click",
()=>{


nav.classList.toggle(
"active"
);



nav.classList.toggle(
"open"
);



});



}





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

behavior:"smooth"

});


}


});


});
/*
=====================================
SCROLL REVEAL
=====================================
*/


const revealItems =
document.querySelectorAll(
`
.about-card,
.social-card,
.gallery-card,
.cosplay-card,
.fact-card,
.reference-card,
.section-heading
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
item=>observer.observe(item)
);



}









/*
=====================================
LIGHTBOX
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



const closeLightbox =
document.querySelector(
".lightbox-close"
);





let lastScroll = 0;






function openImage(
src,
alt=""
){



if(
!lightbox ||
!lightboxImage
){

return;

}



lastScroll =
window.scrollY;



lightboxImage.src =
src;



lightboxImage.alt =
alt;



lightbox.classList.add(
"active"
);



document.body.style.overflow =
"hidden";



}







function hideLightbox(){


if(!lightbox){

return;

}



lightbox.classList.remove(
"active"
);



document.body.style.overflow =
"";



window.scrollTo(
{

top:lastScroll

}
);



}









document
.querySelectorAll(
`
.cosplay-card img,
.gallery-card img
`
)
.forEach(
image=>{


image.style.cursor =
"pointer";



image.addEventListener(
"click",
()=>{


const card =
image.closest(
".cosplay-card, .gallery-card"
);



const title =
card
?.querySelector(
"h3"
)
?.textContent ||
image.alt;



openImage(
image.src,
title
);



});



});








if(closeLightbox){


closeLightbox.addEventListener(
"click",
hideLightbox
);



}



if(lightbox){


lightbox.addEventListener(
"click",
event=>{


if(
event.target === lightbox
){

hideLightbox();

}



});


}






document.addEventListener(
"keydown",
event=>{


if(
event.key === "Escape"
){

hideLightbox();

}



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









/*
=====================================
HERO PARALLAX
=====================================
*/


const orbA =
document.querySelector(
".orb-a"
);



const orbB =
document.querySelector(
".orb-b"
);



const heroFrame =
document.querySelector(
".hero-frame"
);



let ticking =
false;





window.addEventListener(
"scroll",
()=>{


if(!ticking){


window.requestAnimationFrame(
()=>{


const y =
window.scrollY;



if(orbA){

orbA.style.transform =
`translate(${y*.06}px,${y*.12}px)`;

}



if(orbB){

orbB.style.transform =
`translate(${-y*.05}px,${-y*.08}px)`;

}



if(heroFrame){

heroFrame.style.transform =
`translateY(${y*-.08}px)`;

}



ticking =
false;



});


ticking =
true;



}



},
{
passive:true
}
);









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
img=>{


img.addEventListener(
"error",
()=>{


console.warn(
"Imagem não encontrada:",
img.src
);



img.classList.add(
"image-error"
);



});


});









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
frame=>{


frame.addEventListener(
"load",
()=>{


console.log(
"Player loaded:",
frame.src
);



});



});









/*
=====================================
GLOBAL ERROR
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



});
