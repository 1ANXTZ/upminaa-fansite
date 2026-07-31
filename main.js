/*
=====================================
UPMINAA FAN HUB
MAIN.JS
FINAL REWORK VERSION
=====================================
*/


/*
=====================================
LOADER
=====================================
*/

const loader = document.getElementById("loader");


if(loader){

window.addEventListener(
"load",
()=>{

setTimeout(()=>{

loader.classList.add("hidden");

},500);

});


setTimeout(()=>{

loader.classList.add("hidden");

},2500);


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


const menuButton =
document.getElementById("navToggle");


const nav =
document.getElementById("navLinks");



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
.forEach(link=>{


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
.forEach(link=>{


link.addEventListener(
"click",
event=>{


const id =
link.getAttribute(
"href"
);



const target =
document.querySelector(
id
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
BACK TOP BUTTON
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
.social-card,
.reference-card
`
);



const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(
entry=>{


if(entry.isIntersecting){


entry.target.classList.add(
"in-view"
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



revealElements.forEach(
element=>{


element.classList.add(
"reveal"
);


observer.observe(
element
);


});/*
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




clickableImages.forEach(
image=>{


image.style.cursor =
"pointer";



image.addEventListener(
"click",
event=>{


/*
Impede qualquer link
ou comportamento padrão
*/

event.preventDefault();

event.stopPropagation();



openLightbox(
image
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
event=>{


event.preventDefault();


closeLightbox();


});


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
IMAGE ERROR DEBUG
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


});/*
=====================================
TWITCH SYSTEM
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";





function getTwitchParent(){


const host =
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
=====================================
HERO LIVE STATUS
=====================================
*/


const heroLive =
document.querySelector(
".hero-image .live-status"
);



function updateHeroLiveStatus(
online
){



if(!heroLive){

return;

}




heroLive.textContent =
"LIVE";



if(online){


heroLive.classList.add(
"online"
);



heroLive.classList.remove(
"offline"
);



}
else{


heroLive.classList.remove(
"online"
);



heroLive.classList.add(
"offline"
);



}



}









/*
=====================================
CREATE TWITCH PLAYER
=====================================
*/


function createTwitchPlayer(){



const iframe =
document.createElement(
"iframe"
);



iframe.src =

`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getTwitchParent()}&muted=true`;




iframe.title =
"Upminaa Twitch Live";



iframe.allow =
"autoplay; fullscreen";



iframe.frameBorder =
"0";



iframe.allowFullscreen =
true;



return iframe;


}









/*
=====================================
CHECK TWITCH LIVE
=====================================
*/


async function checkTwitchStatus(){


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
"Erro Twitch:",
error
);



return false;


}


}









/*
=====================================
LOAD LIVE PLAYER
=====================================
*/


async function loadTwitchLive(){



const liveContainer =
document.getElementById(
"twitchEmbedWrap"
);



const badge =
document.getElementById(
"twitchStatusBadge"
);



const statusText =
badge?.querySelector(
".status-text"
);





if(!liveContainer){

return;

}




const online =
await checkTwitchStatus();





/*
Atualiza badge do card
*/

if(badge){


if(online){


badge.classList.add(
"online"
);



badge.classList.remove(
"offline"
);



if(statusText){

statusText.textContent =
"AO VIVO";

}



}
else{


badge.classList.remove(
"online"
);



badge.classList.add(
"offline"
);



if(statusText){

statusText.textContent =
"OFFLINE";

}



}



}




/*
Atualiza Hero
*/


updateHeroLiveStatus(
online
);







/*
Player Live
*/


if(online){



if(
!liveContainer.querySelector(
"iframe"
)
){



liveContainer.innerHTML =
"";



liveContainer.appendChild(
createTwitchPlayer()
);



}



}
else{


liveContainer.innerHTML = "";



}




console.log(
"Twitch status:",
online
?
"AO VIVO"
:
"OFFLINE"
);



}







/*
=====================================
INIT TWITCH
=====================================
*/


loadTwitchLive();



setInterval(
loadTwitchLive,
120000
);/*
=====================================
TWITCH LATEST VOD
=====================================
*/


async function loadLatestVod(){


const vodContainer =
document.getElementById(
"latestVod"
);



if(!vodContainer){

return;

}




/*
Busca vídeos recentes do canal
pela página pública da Twitch
*/


try{


const response =
await fetch(
`https://decapi.me/twitch/videos/${TWITCH_CHANNEL}`
);



const text =
await response.text();



console.log(
"Último VOD:",
text
);





/*
Caso a API retorne ID do vídeo
*/


const match =
text.match(
/videos\/(\d+)/
);



if(match){



const videoId =
match[1];



vodContainer.innerHTML = `


<iframe

src="https://player.twitch.tv/?video=${videoId}&parent=${getTwitchParent()}"

title="Última Live Upminaa"

frameborder="0"

allowfullscreen>

</iframe>


`;



}
else{


vodContainer.innerHTML = `

<p>

Última live disponível no canal da Twitch.

</p>

`;



}



}
catch(error){


console.warn(
"Erro carregando VOD:",
error
);



vodContainer.innerHTML = `

<p>

Não foi possível carregar a última live.

</p>

`;



}



}







loadLatestVod();









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





const youtubeRSS =
`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;






const youtubeProxy =

url =>
`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;









async function getYoutubeVideos(){


try{


const response =
await fetch(
youtubeProxy(
youtubeRSS
)
);



const xmlText =
await response.text();





const xml =
new DOMParser()
.parseFromString(
xmlText,
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
video=>{


return {

id:

video
.getElementsByTagName(
"yt:videoId"
)[0]
?.textContent,


title:

video
.getElementsByTagName(
"title"
)[0]
?.textContent
||
"Upminaa Video"


};


}
)
.filter(
video=>video.id
);





return videos;



}
catch(error){


console.warn(
"YouTube erro:",
error
);



return [];


}


}











function renderYoutube(
videos
){



if(!youtubeGrid){

return;

}



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





card.innerHTML = `


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



});


}









async function loadYoutube(){


const videos =
await getYoutubeVideos();



if(
videos.length
){



renderYoutube(
videos
);



console.log(
"YouTube atualizado"
);



}
else{


console.warn(
"Nenhum vídeo encontrado"
);



}




}






loadYoutube();/*
=====================================
PLAYER LOAD DEBUG
=====================================
*/


document
.querySelectorAll(
"iframe"
)
.forEach(
iframe=>{


iframe.addEventListener(
"load",
()=>{


console.log(
"Player carregado:",
iframe.src
);


});


});









/*
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
ERRO NO UPMINAA FAN HUB

Mensagem:
${event.message}

Arquivo:
${event.filename}

Linha:
${event.lineno}

=================================
`
);


});









/*
=====================================
IMAGE FALLBACK CHECK
=====================================
*/


document
.querySelectorAll(
"img"
)
.forEach(
img=>{


if(!img.complete){


img.addEventListener(
"load",
()=>{


console.log(
"Imagem carregada:",
img.src
);


});


}



});









/*
=====================================
FINAL SYSTEM STATUS
=====================================
*/


console.log(

`

=================================

UPMINAA FAN HUB

FINAL REWORK VERSION

SYSTEM ONLINE

✓ Loader
✓ Mobile Menu
✓ Smooth Scroll
✓ Reveal Animation
✓ Lightbox
✓ Hero LIVE Status
✓ Twitch Live System
✓ Twitch VOD
✓ YouTube Feed
✓ Image Debug

=================================

`

);



});
