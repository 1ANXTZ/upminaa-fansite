/*
=====================================
UPMINAA FAN HUB
main.js
FINAL CORRECTED VERSION
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


        const opened =
        nav.classList.toggle("open");


        menuButton.classList.toggle(
        "open",
        opened
        );


        menuButton.setAttribute(
        "aria-expanded",
        opened
        );


    });


}



document
.querySelectorAll("#navLinks a")
.forEach(link=>{


    link.addEventListener(
    "click",
    ()=>{


        nav?.classList.remove("open");


        menuButton?.classList.remove("open");


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
BACK TO TOP
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

    }
    else{

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
REVEAL ANIMATION
=====================================
*/


const revealItems =
document.querySelectorAll(
`
.fact-card,
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
threshold:0.15
}
);



revealItems.forEach(item=>{


    revealObserver.observe(item);


});


/*
=====================================
LIGHTBOX SYSTEM FIXED
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



const imageTargets =
document.querySelectorAll(
    ".lightbox-image"
);



imageTargets.forEach(
    image => {


        image.addEventListener(
            "click",
            function(event){


                event.preventDefault();


                event.stopPropagation();



                if(
                    !lightbox ||
                    !lightboxImage
                ){

                    return;

                }



                lightboxImage.src =
                this.src;



                lightboxImage.alt =
                this.alt;



                lightbox.classList.add(
                    "active"
                );



                document.body.style.overflow =
                "hidden";



            }
        );


    }
);






const closeLightbox =
document.querySelector(
    ".lightbox-close"
);



function closeImageLightbox(){


    if(!lightbox){

        return;

    }



    lightbox.classList.remove(
        "active"
    );



    document.body.style.overflow =
    "";



}




if(closeLightbox){


    closeLightbox.addEventListener(
        "click",
        function(event){


            event.preventDefault();


            closeImageLightbox();



        }
    );


}





if(lightbox){


    lightbox.addEventListener(
        "click",
        function(event){



            if(
                event.target === lightbox
            ){


                closeImageLightbox();


            }



        }
    );


}







document.addEventListener(
    "keydown",
    function(event){


        if(
            event.key === "Escape"
        ){


            closeImageLightbox();


        }


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
    img => {


        img.addEventListener(
            "error",
            ()=>{


                console.warn(
                    "Imagem não encontrada:",
                    img.src
                );


            }
        );


    }
); /*
=====================================
YOUTUBE SYSTEM FIXED
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





const youtubeFeed =
`https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;






const youtubeProxies = [


    url =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,


    url =>
    `https://corsproxy.io/?url=${encodeURIComponent(url)}`


];







async function fetchYoutubeVideos(){



    for(
        const proxy of youtubeProxies
    ){



        try{



            const response =
            await fetch(
                proxy(youtubeFeed)
            );



            if(
                !response.ok
            ){

                continue;

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







            const videos =
            entries
            .slice(
                0,
                YOUTUBE_LIMIT
            )
            .map(
                entry=>{


                    const videoId =
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


                        id:
                        videoId,


                        title:
                        title



                    };


                }
            )
            .filter(
                video =>
                video.id
            );






            if(
                videos.length
            ){


                return videos;


            }





        }
        catch(error){



            console.warn(
                "Falha YouTube:",
                error
            );



        }



    }





    return [];

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

            allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share
            "

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









async function initializeYoutube(){



    const videos =
    await fetchYoutubeVideos();





    if(
        videos.length
    ){



        renderYoutubeVideos(
            videos
        );



        console.log(
            "YouTube carregado:",
            videos.length,
            "vídeos"
        );



    }
    else{



        console.warn(
            "Nenhum vídeo recente encontrado"
        );



        if(youtubeGrid){


            youtubeGrid.innerHTML = `

            <article class="youtube-card">


            <div class="video-wrapper">


            <p>
            Não foi possível carregar os vídeos no momento.
            </p>


            </div>


            </article>


            `;


        }



    }



}





initializeYoutube();/*
=====================================
TWITCH SYSTEM FIXED
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";





function getTwitchParent(){


    const hostname =
    window.location.hostname;



    if(
        !hostname ||
        hostname === "localhost"
    ){

        return "localhost";

    }



    return hostname;


}








function createTwitchIframe(
    type,
    id=""
){



    const iframe =
    document.createElement(
        "iframe"
    );



    if(
        type === "live"
    ){



        iframe.src =
        `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getTwitchParent()}&muted=true`;



        iframe.title =
        "Upminaa Twitch Live";



    }
    else if(
        type === "vod"
    ){



        iframe.src =
        `https://player.twitch.tv/?video=${id}&parent=${getTwitchParent()}&muted=true`;



        iframe.title =
        "Última Live Upminaa";



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
CHECK LIVE STATUS
=====================================
*/


async function isTwitchLive(){



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
            "Erro verificando Twitch:",
            error
        );



        return false;



    }


}









/*
=====================================
LOAD TWITCH LIVE
=====================================
*/


async function loadTwitchLive(){



    const container =
    document.getElementById(
        "twitchEmbedWrap"
    );



    const badge =
    document.getElementById(
        "twitchStatusBadge"
    );



    const status =
    badge?.querySelector(
        ".status-text"
    );





    if(
        !container
    ){

        return;

    }





    const online =
    await isTwitchLive();







    if(
        online
    ){



        container.innerHTML =
        "";



        container.appendChild(
            createTwitchIframe(
                "live"
            )
        );




        badge?.classList.add(
            "online"
        );


        badge?.classList.remove(
            "offline"
        );



        if(status){

            status.textContent =
            "AO VIVO";

        }





        console.log(
            "Twitch online"
        );



    }
    else{





        badge?.classList.remove(
            "online"
        );



        badge?.classList.add(
            "offline"
        );




        if(status){

            status.textContent =
            "OFFLINE";

        }





        console.log(
            "Twitch offline"
        );



    }



}









/*
=====================================
LATEST VOD
=====================================
*/


async function loadLatestVod(){



    const card =
    document.getElementById(
        "twitchVodCard"
    );



    if(
        !card
    ){

        return;

    }






    /*
    
    Twitch não permite buscar VOD
    confiável sem API oficial.

    Então deixamos o bloco preparado
    sem iframe quebrado.

    */






    const vodBox =
    document.getElementById(
        "latestVod"
    );



    if(
        vodBox
    ){



        vodBox.innerHTML = `


        <div class="vod-empty">


        <p>

        Última live gravada aparecerá aqui.

        </p>


        </div>


        `;



    }





    console.log(
        "VOD preparado"
    );



}









loadTwitchLive();


loadLatestVod();





setInterval(
loadTwitchLive,
120000
);/*
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


            }
        );


    }
);








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


    }
);








/*
=====================================
FINAL CHECK
=====================================
*/


console.log(

`

=================================

UPMINAA FAN HUB

MAIN.JS CORRECTED VERSION

SYSTEM ONLINE

=================================

`

);



});
