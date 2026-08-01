/*
=====================================
UPMINAA FAN HUB — main.js

Static frontend script.

Features:
- Mobile navigation
- Smooth scrolling
- Reveal animations
- Image lightbox
- Twitch embed
- YouTube videos
=====================================
*/


document.addEventListener("DOMContentLoaded", () => {



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
        () => {

            navLinks.classList.toggle("open");

        }
    );

}







/* ==============================
   SMOOTH SCROLL
============================== */


document
.querySelectorAll('a[href^="#"]')
.forEach(link => {


    link.addEventListener(
        "click",
        event => {


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


        }
    );


});









/* ==============================
   REVEAL ANIMATION
============================== */


const revealElements =
document.querySelectorAll(
`
.about-image,
.profile-card,
.bio-card,
.cosplay-card,
.gallery-card,
.live-player-card,
.youtube-card,
.social-card
`
);





if("IntersectionObserver" in window){


    const revealObserver =
    new IntersectionObserver(
        entries => {


            entries.forEach(entry => {


                if(entry.isIntersecting){


                    entry.target.classList.add(
                        "visible"
                    );


                }


            });


        },
        {
            threshold:0.15
        }
    );



    revealElements.forEach(element => {


        revealObserver.observe(element);


    });


}











/* ==============================
   BACK TO TOP
============================== */


const backTop =
document.querySelector("#backTop");



if(backTop){


    window.addEventListener(
        "scroll",
        () => {


            backTop.classList.toggle(
                "show",
                window.scrollY > 500
            );


        }
    );




    backTop.addEventListener(
        "click",
        () => {


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });


        }
    );


}











/* ==============================
   LIGHTBOX
============================== */


const lightbox =
document.querySelector(".lightbox");


const lightboxImage =
document.querySelector(
".lightbox img"
);


const lightboxClose =
document.querySelector(
".lightbox-close"
);





function openLightbox(image){


    if(!lightbox || !lightboxImage)
        return;



    lightboxImage.src =
    image.src;



    lightboxImage.alt =
    image.alt;



    lightbox.classList.add(
        "active"
    );


}







function closeLightbox(){


    if(!lightbox || !lightboxImage)
        return;



    lightbox.classList.remove(
        "active"
    );



    setTimeout(() => {


        lightboxImage.src="";


    },300);


}








document
.querySelectorAll(
".cosplay-card img, .gallery-card img"
)
.forEach(image => {


    image.style.cursor="pointer";



    image.addEventListener(
        "click",
        event => {


            event.stopPropagation();


            openLightbox(image);


        }
    );


});








document
.querySelectorAll(
".cosplay-card, .gallery-card"
)
.forEach(card => {


    const image =
    card.querySelector("img");



    if(!image)
        return;



    card.addEventListener(
        "click",
        event => {


            if(event.target.tagName !== "A"){


                openLightbox(image);


            }


        }
    );


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
        event => {


            if(event.target === lightbox){


                closeLightbox();


            }


        }
    );


}






document.addEventListener(
"keydown",
event => {


    if(
        event.key==="Escape" &&
        lightbox?.classList.contains("active")
    ){


        closeLightbox();


    }


});/* ==============================
   SECURITY HELPER
============================== */


function escapeHtml(value){


    return String(value ?? "")
    .replace(
        /[&<>"']/g,
        character => ({


            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            '"':"&quot;",
            "'":"&#39;"


        }[character])
    );


}







/* ==============================
   TWITCH
============================== */


const TWITCH_CHANNEL =
"upminaa";



const TWITCH_VIDEOS_URL =
`https://www.twitch.tv/${TWITCH_CHANNEL}/videos`;





const twitchEls = {


    heroLiveStatus:
    document.querySelector("#heroLiveStatus"),


    twitchEmbedWrap:
    document.querySelector("#twitchEmbedWrap"),


    twitchStatusBadge:
    document.querySelector("#twitchStatusBadge"),


    twitchStreamTitle:
    document.querySelector("#twitchStreamTitle"),


    twitchStreamMeta:
    document.querySelector("#twitchStreamMeta"),


    latestVod:
    document.querySelector("#latestVod"),


    vodTitle:
    document.querySelector("#vodTitle"),


    vodMeta:
    document.querySelector("#vodMeta")


};








function getParentDomain(){


    return window.location.hostname || "localhost";


}









function mountTwitchPlayer(){


    if(
        !twitchEls.twitchEmbedWrap ||
        twitchEls.twitchEmbedWrap.querySelector("iframe")
    ){

        return;

    }




    const iframe =
    document.createElement("iframe");



    iframe.src =
    `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;



    iframe.width="100%";

    iframe.height="100%";

    iframe.frameBorder="0";

    iframe.allowFullscreen=true;

    iframe.allow =
    "autoplay; fullscreen";




    twitchEls.twitchEmbedWrap.innerHTML="";


    twitchEls.twitchEmbedWrap.appendChild(
        iframe
    );


}









function setLiveBadge(
    element,
    isLive
){


    if(!element)
        return;



    element.classList.toggle(
        "online",
        isLive
    );



    element.classList.toggle(
        "offline",
        !isLive
    );



    const label =
    element.querySelector(
        ".status-label"
    );



    if(label){


        label.textContent =
        isLive
        ?
        "LIVE"
        :
        "OFFLINE";


    }


}











async function refreshLiveBadge(){


    try{


        const response =
        await fetch(
            `https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`
        );



        const text =
        (await response.text())
        .toLowerCase();




        const isLive =
        response.ok &&
        !text.includes("offline") &&
        !text.includes("error");





        setLiveBadge(
            twitchEls.heroLiveStatus,
            isLive
        );



        setLiveBadge(
            twitchEls.twitchStatusBadge,
            isLive
        );






        if(twitchEls.twitchStreamTitle){


            twitchEls.twitchStreamTitle.textContent =
            isLive
            ?
            "Upminaa Live"
            :
            "Upminaa is offline";


        }






        if(twitchEls.twitchStreamMeta){


            twitchEls.twitchStreamMeta.textContent =
            isLive
            ?
            "Watch the stream live right now."
            :
            "Follow Upminaa on Twitch for future streams.";


        }



    }
    catch(error){


        console.warn(
            "Twitch status unavailable:",
            error
        );


    }


}











function mountLatestVod(){


    if(!twitchEls.latestVod)
        return;




    twitchEls.latestVod.innerHTML = `

    <a

    class="player-placeholder"

    href="${TWITCH_VIDEOS_URL}"

    target="_blank"

    rel="noopener noreferrer">

    Watch recent broadcasts on Twitch →

    </a>

    `;




    if(twitchEls.vodTitle){


        twitchEls.vodTitle.textContent =
        "Recent Broadcasts";


    }





    if(twitchEls.vodMeta){


        twitchEls.vodMeta.textContent =
        "See previous streams on Twitch.";


    }


}








mountTwitchPlayer();


refreshLiveBadge();


mountLatestVod();




setInterval(
    refreshLiveBadge,
    300000
);/* ==============================
   YOUTUBE LATEST VIDEOS
============================== */


const YOUTUBE_CHANNEL_ID =
"UCw3CBMvVjZJNfQR3tEvTodQ";



const YOUTUBE_CHANNEL_URL =
`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;





const youtubeGrid =
document.querySelector("#youtubeGrid");









function renderYoutubeVideos(videos){


    if(!youtubeGrid)
        return;



    youtubeGrid.innerHTML="";




    videos.forEach(video => {



        const card =
        document.createElement("article");



        card.className =
        "youtube-card";





        card.innerHTML = `

        <div class="video-wrapper">


            <iframe

            src="https://www.youtube.com/embed/${video.id}"

            title="${escapeHtml(video.title)}"

            loading="lazy"

            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

            allowfullscreen>

            </iframe>


        </div>



        <div class="video-info">


            <h4>

            ${escapeHtml(video.title)}

            </h4>


        </div>


        `;




        youtubeGrid.appendChild(card);



    });



}









async function loadYoutubeVideos(){


    if(!youtubeGrid)
        return;





    try{



        const rssUrl =
        `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;





        const proxyUrl =
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`;





        const response =
        await fetch(proxyUrl);





        if(!response.ok){

            throw new Error(
                "YouTube feed unavailable"
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
            ...xml.querySelectorAll("entry")
        ];








        const videos =
        entries
        .slice(0,4)
        .map(entry => {



            return {


                id:

                entry
                .querySelector(
                    "yt\\:videoId, videoId"
                )
                ?.textContent,



                title:

                entry
                .querySelector("title")
                ?.textContent
                ||
                "Upminaa Video"


            };



        })
        .filter(video => video.id);








        if(!videos.length){


            throw new Error(
                "No videos found"
            );


        }







        localStorage.setItem(

            "upminaa_youtube_cache",

            JSON.stringify(videos)

        );








        renderYoutubeVideos(videos);




    }
    catch(error){



        console.warn(
            "YouTube feed failed:",
            error
        );






        const cached =
        localStorage.getItem(
            "upminaa_youtube_cache"
        );





        if(cached){


            renderYoutubeVideos(
                JSON.parse(cached)
            );


        }
        else{


            showYoutubeFallback();


        }




    }



}









function showYoutubeFallback(){


    if(!youtubeGrid)
        return;





    youtubeGrid.innerHTML = `


    <article class="youtube-card">


        <div class="video-wrapper">


            <a

            class="player-placeholder"

            href="${YOUTUBE_CHANNEL_URL}"

            target="_blank"

            rel="noopener noreferrer">


            Watch latest videos on YouTube →


            </a>


        </div>


    </article>


    `;



}







loadYoutubeVideos();/* ==============================
   IMAGE DEBUG
============================== */


document
.querySelectorAll("img")
.forEach(image => {


    image.addEventListener(
        "error",
        () => {


            console.warn(
                "Image not found:",
                image.src
            );


        }
    );


});







/* ==============================
   STARTUP MESSAGE
============================== */


console.log(
    "Upminaa Fan Hub loaded successfully"
);



});
