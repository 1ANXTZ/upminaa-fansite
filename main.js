/*
=====================================
UPMINAA FAN HUB
MAIN.JS
FINAL POLISHED VERSION
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

        }
    );


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
        nav.classList.toggle("open");


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
.querySelectorAll("#navLinks a")
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
.querySelectorAll('a[href^="#"]')
.forEach(link=>{


    link.addEventListener(
    "click",
    event=>{


        const id =
        link.getAttribute("href");


        const target =
        document.querySelector(id);



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


const revealItems =
document.querySelectorAll(
`
.profile-card,
.fact-card,
.curiosity-card,
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


entries.forEach(entry=>{


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





revealItems.forEach(item=>{


    revealObserver.observe(item);


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






document
.querySelectorAll(
".lightbox-image"
)
.forEach(image=>{


    image.addEventListener(
    "click",
    event=>{


        /*
        impede qualquer
        comportamento padrão
        */

        event.preventDefault();


        event.stopPropagation();



        openLightbox(
            image
        );



    });


});






const closeButton =
document.querySelector(
".lightbox-close"
);



if(closeButton){


    closeButton.addEventListener(
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
IMAGE DEBUG
=====================================
*/


document
.querySelectorAll("img")
.forEach(img=>{


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
LIVE STATUS HERO
=====================================
*/


const heroLive =
document.querySelector(
".hero-image .live-status"
);



function updateHeroLive(
online
){



if(!heroLive){

    return;

}




if(online){


    heroLive.textContent =
    "LIVE";


    heroLive.classList.add(
        "online"
    );


    heroLive.classList.remove(
        "offline"
    );



}
else{


    heroLive.textContent =
    "LIVE";


    heroLive.classList.add(
        "offline"
    );


    heroLive.classList.remove(
        "online"
    );



}



}








/*
=====================================
TWITCH CONFIG
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";






function twitchParent(){


    const host =
    window.location.hostname;



    if(
        !host ||
        host === "localhost"
    ){

        return "localhost";

    }



    return host;


}









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
TWITCH PLAYER SYSTEM
=====================================
*/


function createTwitchPlayer(
type
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
LOAD TWITCH LIVE
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
==========================
ONLINE
==========================
*/


if(online){



    liveContainer.innerHTML =
    "";



    liveContainer.appendChild(
        createTwitchPlayer(
            "live"
        )
    );




    badge?.classList.add(
        "online"
    );


    badge?.classList.remove(
        "offline"
    );





    if(statusText){

        statusText.textContent =
        "LIVE";

    }






    updateHeroLive(
        true
    );





    console.log(
        "Upminaa está LIVE"
    );





}

/*
==========================
OFFLINE
==========================
*/


else{



    badge?.classList.add(
        "offline"
    );


    badge?.classList.remove(
        "online"
    );





    if(statusText){

        statusText.textContent =
        "LIVE";

    }






    updateHeroLive(
        false
    );





    console.log(
        "Upminaa offline"
    );



}





}









/*
=====================================
LATEST TWITCH LIVE CARD
=====================================
*/


async function loadLatestVod(){



const vodCard =
document.getElementById(
"twitchVodCard"
);



if(!vodCard){

    return;

}





const iframeBox =
vodCard.querySelector(
"#latestVod"
);





if(!iframeBox){

    return;

}





/*
Twitch não libera
busca pública de VOD
sem API oficial.

Então usamos o player
de vídeos do canal.
*/





iframeBox.innerHTML = `


<iframe

src="https://www.twitch.tv/embed/${TWITCH_CHANNEL}/videos?parent=${twitchParent()}"

title="Últimas lives da Upminaa"

frameborder="0"

scrolling="no"

allowfullscreen>

</iframe>


`;





}










/*
=====================================
INITIALIZE TWITCH
=====================================
*/


loadTwitchLive();


loadLatestVod();






/*
Atualiza status
a cada 2 minutos
*/


setInterval(
loadTwitchLive,
120000
);







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



const YOUTUBE_LIMIT =
4;





const youtubeFeed =
`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;






const youtubeProxy =
url =>
`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
/*
=====================================
YOUTUBE FETCH SYSTEM
=====================================
*/


async function getYoutubeVideos(){



try{


const response =
await fetch(
    youtubeProxy(
        youtubeFeed
    )
);



if(!response.ok){

    throw new Error(
        "YouTube RSS erro"
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
];






return entries
.slice(
    0,
    YOUTUBE_LIMIT
)
.map(entry=>{


    const id =
    entry
    .getElementsByTagName(
        "yt:videoId"
    )[0]
    ?.textContent;





    const title =
    entry
    .getElementsByTagName(
        "title"
    )[0]
    ?.textContent
    ||
    "Upminaa Video";





    return {

        id,

        title

    };





})
.filter(
video=>video.id
);






}

catch(error){


console.warn(
    "YouTube não carregou:",
    error
);



return [];



}



}









/*
=====================================
CREATE YOUTUBE CARDS
=====================================
*/


function renderYoutube(
videos
){



if(!youtubeGrid){

    return;

}




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









/*
=====================================
LOAD YOUTUBE
=====================================
*/


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
    "YouTube carregado:",
    videos.length
);




}
else{



console.warn(
    "Nenhum vídeo encontrado"
);



if(youtubeGrid){


youtubeGrid.innerHTML = `


<article class="youtube-card">


<div class="video-wrapper">


<p>

Não foi possível carregar os vídeos.

</p>


</div>


</article>


`;



}



}



}






loadYoutube();









/*
=====================================
PLAYER LOAD DEBUG
=====================================
*/


document
.querySelectorAll(
"iframe"
)
.forEach(player=>{


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
FINAL STATUS
=====================================
*/


console.log(`

=================================

UPMINAA FAN HUB

MAIN.JS FINAL POLISHED VERSION

SYSTEM ONLINE

=================================

`);





});
