/*
=====================================
UPMINAA FAN HUB
MAIN.JS FINAL VERSION
=====================================
*/


/*
=====================================
LOADER
=====================================
*/


const loader = document.getElementById("loader");


window.addEventListener("load",()=>{

    if(loader){

        setTimeout(()=>{

            loader.classList.add("hidden");

        },500);

    }

});





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


});


}




document
.querySelectorAll("#navLinks a")
.forEach(link=>{


link.addEventListener(
"click",
()=>{


nav?.classList.remove("open");

menu?.classList.remove("open");


});


});







/*
=====================================
SMOOTH SCROLL
=====================================
*/


document
.querySelectorAll('a[href^="#"]')
.forEach(anchor=>{


anchor.addEventListener(
"click",
e=>{


const target =
document.querySelector(
anchor.getAttribute("href")
);



if(target){


e.preventDefault();


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
document.getElementById("backTop");



if(backTop){


window.addEventListener(
"scroll",
()=>{


if(window.scrollY > 500){


backTop.classList.add("show");


}else{


backTop.classList.remove("show");


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
REVEAL CARDS
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





revealElements.forEach(
item=>{


observer.observe(item);


});


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







clickableImages.forEach(
image=>{


image.addEventListener(
"click",
()=>{


openLightbox(image);


});


});








const closeButton =
document.querySelector(
".lightbox-close"
);



if(closeButton){


closeButton.addEventListener(
"click",
()=>{


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
IMAGE ERROR CHECK
=====================================
*/


document
.querySelectorAll("img")
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










async function checkTwitchLive(){



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
"Twitch status error:",
error
);


return false;


}



}









async function updateLiveStatus(){



const online =
await checkTwitchLive();






/*
==============================
HERO STATUS
==============================
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
"LIVE";


heroStatus.classList.add(
"offline"
);



heroStatus.classList.remove(
"online"
);



}



}









/*
==============================
TWITCH PLAYER
==============================
*/


if(
twitchLivePlayer
){



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



}



}










/*
==============================
BADGE
==============================
*/


if(twitchBadge){



const text =
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



if(text){

text.textContent =
"LIVE";

}


}else{



twitchBadge.classList.remove(
"online"
);



twitchBadge.classList.add(
"offline"
);



if(text){

text.textContent =
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
TWITCH LAST VOD
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



const data =
await response.json();




if(
data &&
data.length
){



const latest =
data[0];





vodContainer.innerHTML = `


<iframe

src="https://player.twitch.tv/?video=${latest.id}&parent=${getParentDomain()}&muted=true"

width="100%"

height="100%"

frameborder="0"

allowfullscreen>

</iframe>


`;



}else{


vodContainer.innerHTML = `

<p>

Nenhuma live gravada encontrada.

</p>

`;


}



}

catch(error){



console.warn(
"Erro VOD:",
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
.slice(0,4)
.map(video=>{



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



})
.filter(
video=>video.id
);









renderYoutube(videos);





}

catch(error){



console.warn(
"YouTube error:",
error
);



youtubeGrid.innerHTML = `

<article class="youtube-card">

<div class="video-wrapper">

<p>

Vídeos indisponíveis.

</p>

</div>

</article>

`;


}



}









function renderYoutube(videos){



youtubeGrid.innerHTML =
"";





videos.forEach(video=>{



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
(player)=>{


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
GLOBAL ERROR HANDLER
=====================================
*/


window.addEventListener(
"error",
(event)=>{


console.error(
`
==============================
UPMINAA FAN HUB ERROR
==============================

Mensagem:
${event.message}

Arquivo:
${event.filename}

Linha:
${event.lineno}

==============================
`
);



});









/*
=====================================
LAZY UPDATE
=====================================
*/


function refreshMedia(){


updateLiveStatus();


loadLatestVod();


loadYoutube();



}








/*
Atualiza mídia a cada 5 minutos
*/


setInterval(
refreshMedia,
300000
);









/*
=====================================
FINAL STATUS
=====================================
*/


console.log(`


=================================

UPMINAA FAN HUB

MAIN.JS FINAL VERSION

SYSTEM ONLINE ✅


Features:

✓ Loader
✓ Mobile Menu
✓ Smooth Scroll
✓ Reveal Animation
✓ Lightbox
✓ Twitch Live System
✓ Hero LIVE Status
✓ Twitch VOD
✓ YouTube Feed
✓ Responsive Players

=================================


`);




});
