/*
=====================================
UPMINAA FAN HUB
main.js
FIXED VERSION
=====================================
*/


/*
=====================================
LOADER
=====================================
*/


const loader =
document.getElementById("loader");


if(loader){


window.addEventListener(
"load",
()=>{


setTimeout(
()=>{

loader.classList.add(
"hidden"
);

},
500
);


});


setTimeout(
()=>{

loader.classList.add(
"hidden"
);

},
2500
);


}









/*
=====================================
YOUTUBE AUTO LOAD
=====================================
*/


const YOUTUBE_CHANNEL_ID =
"UCw3CBMvVjZJNfQR3tEvTodQ";


const YOUTUBE_LIMIT =
4;



const YOUTUBE_FEED =
`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;





const RSS_PROXIES = [


(url)=>
`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,


(url)=>
`https://corsproxy.io/?url=${encodeURIComponent(url)}`


];







async function getYoutubeVideos(){


for(
const proxy of RSS_PROXIES
){



try{


const response =
await fetch(
proxy(YOUTUBE_FEED)
);



if(!response.ok){

continue;

}




const text =
await response.text();





const xml =
new DOMParser()
.parseFromString(
text,
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
YOUTUBE_LIMIT
);






const videos =
entries.map(
item=>{


return {


id:
item
.getElementsByTagName(
"yt:videoId"
)[0]
?.textContent,


title:
item
.getElementsByTagName(
"title"
)[0]
?.textContent ||
"Upminaa Video"


};


}
)
.filter(
video=>video.id
);





if(videos.length){

return videos;

}



}
catch(error){


console.warn(
"YouTube proxy failed",
error
);


}



}



return [];

}








function createYoutubePlayers(
videos
){



const gallery =
document.getElementById(
"youtubeGrid"
);





if(!gallery){

return;

}







gallery
.querySelectorAll(
".yt-video-card"
)
.forEach(
card=>card.remove()
);






videos.forEach(
video=>{


const card =
document.createElement(
"article"
);



card.className =
"youtube-card yt-video-card";





const wrapper =
document.createElement(
"div"
);


wrapper.className =
"video-wrapper";





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



iframe.allow =
"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";





wrapper.appendChild(
iframe
);



card.appendChild(
wrapper
);



gallery.appendChild(
card
);



});



}







async function loadYoutube(){


const videos =
await getYoutubeVideos();





if(videos.length){


createYoutubePlayers(
videos
);


console.log(
"YouTube loaded"
);



}
else{


console.warn(
"No YouTube videos found"
);


}



}



loadYoutube();/*
=====================================
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";





function twitchParent(){


return window.location.hostname;


}







function createTwitchPlayer(
type,
id
){


const iframe =
document.createElement(
"iframe"
);





if(type === "live"){


iframe.src =
`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${twitchParent()}&muted=true`;



iframe.title =
"Upminaa Twitch Live";



}
else{



iframe.src =
`https://player.twitch.tv/?video=${id}&parent=${twitchParent()}&muted=true`;



iframe.title =
"Última live da Upminaa";



}





iframe.allowFullscreen =
true;



iframe.frameBorder =
"0";



iframe.allow =
"autoplay; fullscreen";



return iframe;



}









/*
=====================================
TWITCH STATUS
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






return !text.includes(
"offline"
);



}
catch(error){


console.warn(
"Twitch status error",
error
);



return false;


}



}









async function loadTwitchLive(){



const wrap =
document.getElementById(
"twitchEmbedWrap"
);



const badge =
document.getElementById(
"twitchStatusBadge"
);






if(!wrap){

return;

}







const live =
await checkTwitchLive();






if(live){



wrap.innerHTML =
"";



wrap.appendChild(
createTwitchPlayer(
"live"
)
);





wrap.classList.add(
"is-visible"
);







if(badge){


badge.classList.add(
"online"
);



badge.classList.remove(
"offline"
);




const status =
badge.querySelector(
".status-text"
);



if(status){

status.textContent =
"AO VIVO";

}



}






console.log(
"Twitch live loaded"
);





}
else{





if(badge){


badge.classList.remove(
"online"
);



badge.classList.add(
"offline"
);




const status =
badge.querySelector(
".status-text"
);



if(status){

status.textContent =
"OFFLINE";

}



}






console.log(
"Twitch offline"
);





}



}









/*
=====================================
ULTIMA LIVE / VOD
=====================================
*/


async function loadLatestVod(){


const card =
document.getElementById(
"twitchVodCard"
);



if(!card){

return;

}






try{



const response =
await fetch(
`https://decapi.me/twitch/videos/${TWITCH_CHANNEL}`
);






const text =
await response.text();






console.log(
"VOD API response:",
text
);







if(
!text ||
text.includes("offline") ||
text.includes("error") ||
text.includes("❤") ||
text.includes("❤️")
){



card.innerHTML =
`
<div class="yt-error">

Nenhuma live recente encontrada.

</div>
`;



return;



}







let data;






try{



data =
JSON.parse(
text
);



}
catch(error){



console.warn(
"VOD JSON parse failed:",
error
);



card.innerHTML =
`
<div class="yt-error">

Última live indisponível no momento.

</div>
`;



return;



}






if(
!data ||
!data[0] ||
!data[0].id
){



card.innerHTML =
`
<div class="yt-error">

Nenhuma live encontrada.

</div>
`;



return;



}






const vod =
data[0];






card.innerHTML =
"";





card.appendChild(

createTwitchPlayer(
"vod",
vod.id
)

);






console.log(
"Latest Twitch VOD loaded"
);





}

catch(error){



console.warn(
"VOD error:",
error
);






card.innerHTML =
`
<div class="yt-error">

Erro ao carregar última live.

</div>
`;



}



}






loadTwitchLive();

loadLatestVod();





setInterval(
loadTwitchLive,
120000
);/*
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
document.getElementById(
"year"
);



if(year){


year.textContent =
new Date()
.getFullYear();


}









/*
=====================================
MOBILE MENU
=====================================
*/


const menuButton =
document.getElementById(
"navToggle"
);



const nav =
document.getElementById(
"navLinks"
);






if(
menuButton &&
nav
){



menuButton.addEventListener(
"click",
()=>{


const open =
nav.classList.toggle(
"open"
);




menuButton.classList.toggle(
"open",
open
);




menuButton.setAttribute(
"aria-expanded",
open
);



});


}









document
.querySelectorAll(
"#navLinks a"
)
.forEach(
link=>{


link.addEventListener(
"click",
()=>{


if(nav){

nav.classList.remove(
"open"
);


}


if(menuButton){

menuButton.classList.remove(
"open"
);


}



});


});









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
link.getAttribute(
"href"
)
);



if(target){


event.preventDefault();


target.scrollIntoView({

behavior:
"smooth"

});


}



});


});









/*
=====================================
REVEAL ANIMATION
=====================================
*/


const reveal =
document.querySelectorAll(
`
.fact-card,
.cosplay-card,
.gallery-card,
.live-player-card,
.youtube-card,
.social-card
`
);







const observer =
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



observer.unobserve(
entry.target
);



}



});


},
{

threshold:
0.15

}

);







reveal.forEach(
item=>{


item.classList.add(
"reveal"
);



observer.observe(
item
);



});









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
"Image missing:",
img.src
);



});


});









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









document
.querySelectorAll(
".gallery-card img"
)
.forEach(
image=>{


image.addEventListener(
"click",
()=>{


if(
!lightbox ||
!lightboxImage
){

return;

}



lightboxImage.src =
image.src;




lightbox.classList.add(
"active"
);



});


});







const closeLightbox =
document.querySelector(
".lightbox-close"
);





if(closeLightbox){


closeLightbox.addEventListener(
"click",
()=>{


lightbox.classList.remove(
"active"
);



});


}








if(lightbox){


lightbox.addEventListener(
"click",
event=>{


if(
event.target === lightbox
){


lightbox.classList.remove(
"active"
);


}



});


}
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



});


});









/*
=====================================
CLOSE MENU OUTSIDE CLICK
=====================================
*/


document.addEventListener(
"click",
event=>{


if(
!nav ||
!menuButton
){

return;

}





const insideMenu =
nav.contains(
event.target
)
||
menuButton.contains(
event.target
);





if(!insideMenu){


nav.classList.remove(
"open"
);



menuButton.classList.remove(
"open"
);



}



});









/*
=====================================
ESC CLOSE LIGHTBOX
=====================================
*/


document.addEventListener(
"keydown",
event=>{


if(
event.key === "Escape"
&&
lightbox
){


lightbox.classList.remove(
"active"
);



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


window.scrollTo({

top:0,

behavior:"smooth"

});



});



}








});
