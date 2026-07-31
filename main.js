/*
=====================================
UPMINAA FAN HUB
MAIN.JS
FINAL CORRECTED VERSION
=====================================
*/


document.addEventListener(
"DOMContentLoaded",
()=>{


/* ==============================
MOBILE MENU
============================== */


const menuButton =
document.querySelector(".nav-toggle");


const navLinks =
document.querySelector(".nav-links");



if(menuButton && navLinks){


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



target.scrollIntoView({

behavior:"smooth"

});


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
.bio-card,
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


if(entry.isIntersecting){


entry.target.classList.add(
"visible"
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
"#backTop"
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
/* ==============================
LIGHTBOX SYSTEM
============================== */


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






function openLightbox(
image
){



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
!lightbox ||
!lightboxImage
){

return;

}




lightbox.classList.remove(
"active"
);



lightboxImage.src =
"";



}









/* ==============================
CLICKABLE IMAGES
============================== */


const clickableImages =
document.querySelectorAll(
".cosplay-card img, .gallery-card img"
);





clickableImages.forEach(
image=>{



image.classList.add(
"lightbox-image"
);




image.addEventListener(
"click",
event=>{



event.stopPropagation();



openLightbox(
image
);



});



});









/* ==============================
CARD CLICK SUPPORT
============================== */



const clickableCards =
document.querySelectorAll(
".cosplay-card, .gallery-card"
);





clickableCards.forEach(
card=>{



card.addEventListener(
"click",
event=>{



const image =
card.querySelector(
"img"
);




if(
image &&
event.target !== image
){


openLightbox(
image
);


}



});



});









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
&&
lightbox?.classList.contains(
"active"
)
){


closeLightbox();


}



});/* ==============================
TWITCH SYSTEM
============================== */


const TWITCH_CHANNEL =
"upminaa";



const twitchEmbed =
document.querySelector(
"#twitchEmbedWrap"
);



const latestVod =
document.querySelector(
"#latestVod"
);



const heroLiveStatus =
document.querySelector(
".hero-image .live-status"
);



const liveBadge =
document.querySelector(
"#twitchStatusBadge"
);









function getParentDomain(){



let domain =
window.location.hostname;




if(
domain === ""
||
domain === "localhost"
){


return "localhost";


}



return domain;


}









function createTwitchPlayer(){



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









async function checkTwitchStatus(){



try{



const response =
await fetch(

`https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`

);





const data =
await response.text();






return !data
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









function updateLiveStyle(
online
){



const badges = [

heroLiveStatus,

liveBadge

];





badges.forEach(
badge=>{



if(!badge){

return;

}




if(online){



badge.classList.add(
"online"
);



badge.classList.remove(
"offline"
);



}

else{



badge.classList.add(
"offline"
);



badge.classList.remove(
"online"
);



}



});



}









async function updateTwitch(){



const online =
await checkTwitchStatus();





updateLiveStyle(
online
);








/* ==============================
HERO LIVE STATUS
============================== */



if(heroLiveStatus){



heroLiveStatus.innerHTML = `

<span class="status-dot"></span>

LIVE

`;



}









/* ==============================
LIVE PLAYER
============================== */


if(
twitchEmbed
){



if(
online
&&
!twitchEmbed.querySelector(
"iframe"
)
){



twitchEmbed.innerHTML =
"";



twitchEmbed.appendChild(
createTwitchPlayer()
);



}



}









/* ==============================
LIVE BADGE
============================== */


if(
liveBadge
){



liveBadge.innerHTML = `

<span class="status-dot"></span>

LIVE

`;



}



}









updateTwitch();





setInterval(

updateTwitch,

120000

);/* ==============================
TWITCH LAST VOD SYSTEM
============================== */


async function loadLatestVod(){



if(
!latestVod
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
videos &&
videos.length
){



const latest =
videos[0];







latestVod.innerHTML = `



<iframe

src="https://player.twitch.tv/?video=${latest.id}&parent=${getParentDomain()}&muted=true"

title="Latest Upminaa Twitch Stream"

allowfullscreen

frameborder="0"

>

</iframe>



`;





}

else{



latestVod.innerHTML = `



<p>

No recorded streams available.

</p>



`;



}





}

catch(error){



console.warn(

"Latest VOD error:",

error

);






latestVod.innerHTML = `



<p>

Unable to load latest stream.

</p>



`;




}



}









/* ==============================
YOUTUBE SYSTEM
============================== */



const YOUTUBE_CHANNEL_ID =

"UCw3CBMvVjZJNfQR3tEvTodQ";






const youtubeGrid =

document.querySelector(
"#youtubeGrid"
);









async function loadYoutubeVideos(){



if(
!youtubeGrid
){

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

encodeURIComponent(
feed
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








const entries =

[

...xml.querySelectorAll(
"entry"
)

];







const videos =

entries
.slice(0,4)

.map(

entry=>{



return {



id:

entry
.querySelector(
"yt\\:videoId"
)

?.textContent,





title:

entry
.querySelector(
"title"
)

?.textContent

||

"Upminaa Video"



};



})

.filter(

video=>

video.id

);








renderYoutubeVideos(
videos
);






}

catch(error){



console.warn(

"YouTube loading error:",

error

);







youtubeGrid.innerHTML = `



<article class="youtube-card">



<div class="video-wrapper">


<p>

Videos unavailable.

</p>


</div>



</article>



`;



}



}









function renderYoutubeVideos(
videos
){



if(
!youtubeGrid
){

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

allowfullscreen

>

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








loadLatestVod();



loadYoutubeVideos();/* ==============================
IMAGE ERROR HANDLER
============================== */


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



});


});









/* ==============================
PLAYER DEBUG
============================== */


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









/* ==============================
GLOBAL ERROR HANDLER
============================== */


window.addEventListener(
"error",
event=>{


console.error(`

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

`);



});









/* ==============================
MEDIA AUTO REFRESH
============================== */



function refreshMedia(){



updateTwitch();



loadLatestVod();



loadYoutubeVideos();



}







setInterval(

refreshMedia,

300000

);









/* ==============================
FINAL STATUS
============================== */



console.log(`


=================================

UPMINAA FAN HUB

MAIN.JS ONLINE ✅


Systems:


✓ Mobile Navigation

✓ Smooth Scroll

✓ Reveal Animations

✓ About Her Animation

✓ Lightbox Gallery

✓ Clickable Cosplays

✓ Twitch Live System

✓ Twitch Latest Stream

✓ YouTube Feed

✓ Responsive Players


=================================


`);





});
