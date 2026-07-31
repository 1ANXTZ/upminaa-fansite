/*
=====================================
UPMINAA FAN HUB
main.js
FINAL STABLE VERSION
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



if(menuButton && nav){


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


nav?.classList.remove(
"open"
);


menuButton?.classList.remove(
"open"
);


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
BACK TOP
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






/*
=====================================
REVEAL ANIMATION FIX
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




const revealObserver =
new IntersectionObserver(
entries=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"in-view"
);



revealObserver.unobserve(
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


item.classList.add(
"reveal"
);



revealObserver.observe(
item
);



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
".gallery-card img, .cosplay-card img"
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



lightboxImage.alt =
image.alt;



lightbox.classList.add(
"active"
);



});


});






const lightboxClose =
document.querySelector(
".lightbox-close"
);



if(lightboxClose){


lightboxClose.addEventListener(
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
IMAGE DEBUG
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



});


});







/*
=====================================
YOUTUBE SYSTEM
=====================================
*/


const YOUTUBE_CHANNEL_ID =
"UCw3CBMvVjZJNfQR3tEvTodQ";


const YOUTUBE_LIMIT =
4;



const youtubeGrid =
document.getElementById(
"youtubeGrid"
);





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



const xml =
new DOMParser()
.parseFromString(
await response.text(),
"text/xml"
);





const videos =
[
...xml.querySelectorAll(
"entry"
)
]
.slice(
0,
YOUTUBE_LIMIT
)
.map(
entry=>{


return {


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



};


})
.filter(
video=>video.id
);




if(videos.length){

return videos;

}



}
catch(error){


console.warn(
"YouTube proxy falhou",
error
);



}



}



return [];

}







function createYoutubePlayers(
videos
){


if(!youtubeGrid){

return;

}



youtubeGrid.innerHTML = "";





videos.forEach(
video=>{


const card =
document.createElement(
"article"
);



card.className =
"youtube-card";




card.innerHTML = `


<div class="video-wrapper">


<iframe

src="https://www.youtube.com/embed/${video.id}"

title="${video.title}"

loading="lazy"

allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

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
"YouTube carregado"
);



}
else{


console.warn(
"Nenhum vídeo YouTube encontrado"
);



}



}



loadYoutube();
/*
=====================================
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";





function twitchParent(){


const host =
window.location.hostname;



return host === ""

?
"localhost"

:

host;


}







function createTwitchPlayer(
type,
id=""
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
"Upminaa Última Live";



}






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






const statusText =
badge?.querySelector(
".status-text"
);







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





if(statusText){

statusText.textContent =
"AO VIVO";

}





badge?.classList.add(
"online"
);



badge?.classList.remove(
"offline"
);





console.log(
"Twitch AO VIVO"
);



}

else{



badge?.classList.add(
"offline"
);



badge?.classList.remove(
"online"
);





if(statusText){

statusText.textContent =
"OFFLINE";

}




console.log(
"Twitch offline"
);



}



}









/*
=====================================
LATEST TWITCH VOD
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







/*

A API antiga decapi retornava texto.

Ela quebrava com:

Unexpected token ❤

Então removido o JSON.

*/


card.innerHTML = `


<div class="player-wrapper">


<iframe

src="https://www.twitch.tv/embed/${TWITCH_CHANNEL}/videos?parent=${twitchParent()}"

title="Últimas lives da Upminaa"

frameborder="0"

scrolling="no"

allowfullscreen>

</iframe>


</div>


`;





console.log(
"Twitch VOD carregado"
);



}







loadTwitchLive();


loadLatestVod();





setInterval(
loadTwitchLive,
120000
);
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
"Player carregado:",
player.src
);



});


});








/*
=====================================
GLOBAL ERROR DEBUG
=====================================
*/


window.addEventListener(
"error",
event=>{


console.error(
"Erro no site:",
event.message,
event.filename,
event.lineno
);



});







/*
=====================================
UPMINAA FAN HUB READY
=====================================
*/


console.log(
`
=================================

UPMINAA FAN HUB

MAIN.JS FINAL VERSION

SYSTEM ONLINE

=================================
`
);



});
