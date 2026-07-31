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


                loader.classList.add(
                    "hidden"
                );


            },500);


        }
    );



    setTimeout(()=>{


        loader.classList.add(
            "hidden"
        );


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


            const opened =
            nav.classList.toggle(
                "open"
            );



            menuButton.classList.toggle(
                "open",
                opened
            );



            menuButton.setAttribute(
                "aria-expanded",
                opened
            );



        }
    );


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


        }
    );


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


            const href =
            link.getAttribute(
                "href"
            );



            const target =
            document.querySelector(
                href
            );



            if(target){



                event.preventDefault();



                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });



            }


        }
    );


});









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


const revealItems =
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






const revealObserver =
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


    revealObserver.observe(
        item
    );


});







/*
=====================================
LIGHTBOX
SEM SAIR DO SITE
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
    ".lightbox-image"
)
.forEach(
image=>{



    image.style.cursor =
    "pointer";





    image.addEventListener(
        "click",
        event=>{


            event.preventDefault();


            event.stopPropagation();





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
    );



});






function closeLightbox(){



    if(
        !lightbox
    ){

        return;

    }




    lightbox.classList.remove(
        "active"
    );



    document.body.style.overflow =
    "";



}






document
.querySelector(
    ".lightbox-close"
)
?.addEventListener(
    "click",
    event=>{


        event.preventDefault();


        closeLightbox();


    }
);






lightbox?.addEventListener(
    "click",
    event=>{


        if(
            event.target === lightbox
        ){


            closeLightbox();


        }


    }
);






document.addEventListener(
    "keydown",
    event=>{


        if(
            event.key === "Escape"
        ){


            closeLightbox();


        }


    }
);/*
=====================================
YOUTUBE SYSTEM
AUTO RECENT VIDEOS
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


    function(url){

        return (
            "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(url)
        );

    },



    function(url){

        return (
            "https://corsproxy.io/?url=" +
            encodeURIComponent(url)
        );

    }



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






            const text =
            await response.text();





            const xml =
            new DOMParser()
            .parseFromString(
                text,
                "application/xml"
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


                    id:id,


                    title:title


                };



            })
            .filter(
                video=>video.id
            );








            if(
                videos.length
            ){

                return videos;

            }




        }
        catch(error){



            console.warn(
                "YouTube proxy falhou:",
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

            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"

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
    await fetchYoutubeVideos();





    if(
        videos.length
    ){



        renderYoutubeVideos(
            videos
        );



        console.log(
            "YouTube atualizado:",
            videos.length,
            "vídeos"
        );



    }
    else{



        console.warn(
            "Não foi possível carregar YouTube"
        );



        if(youtubeGrid){



            youtubeGrid.innerHTML = `


            <article class="youtube-card">


                <div class="video-wrapper">


                    <p>

                    Vídeos indisponíveis no momento.

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
AUTO UPDATE YOUTUBE
=====================================
*/


setInterval(
    loadYoutube,
    900000
);/*
=====================================
TWITCH SYSTEM
LIVE + VOD
=====================================
*/


const TWITCH_CHANNEL =
"upminaa";



const twitchContainer =
document.getElementById(
    "twitchEmbedWrap"
);



const twitchBadge =
document.getElementById(
    "twitchStatusBadge"
);







function getTwitchParent(){



    let host =
    window.location.hostname;



    if(
        !host ||
        host === "localhost"
    ){

        return "localhost";

    }



    return host;


}









function createTwitchPlayer(
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
        `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getTwitchParent()}&autoplay=true`;



        iframe.title =
        "Upminaa Twitch Live";



    }







    if(
        type === "vod"
    ){



        iframe.src =
        `https://player.twitch.tv/?video=${id}&parent=${getTwitchParent()}`;





        iframe.title =
        "Última Live da Upminaa";



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









function updateTwitchBadge(
online
){



    if(
        !twitchBadge
    ){

        return;

    }





    const text =
    twitchBadge.querySelector(
        ".status-text"
    );






    if(
        online
    ){



        twitchBadge.classList.add(
            "online"
        );


        twitchBadge.classList.remove(
            "offline"
        );




        if(text){

            text.textContent =
            "AO VIVO";

        }



    }
    else{



        twitchBadge.classList.add(
            "offline"
        );


        twitchBadge.classList.remove(
            "online"
        );




        if(text){

            text.textContent =
            "OFFLINE";

        }




    }



}









async function checkTwitchStatus(){



    try{


        const response =
        await fetch(
            `https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`
        );



        const result =
        await response.text();





        return !result
        .toLowerCase()
        .includes(
            "offline"
        );




    }
    catch(error){



        console.warn(
            "Erro Twitch status:",
            error
        );



        return false;



    }



}









async function loadTwitchLive(){



    if(
        !twitchContainer
    ){

        return;

    }







    const online =
    await checkTwitchStatus();







    if(
        online
    ){





        twitchContainer.innerHTML =
        "";





        twitchContainer.appendChild(
            createTwitchPlayer(
                "live"
            )
        );





        updateTwitchBadge(
            true
        );



        console.log(
            "Twitch LIVE"
        );





    }
    else{





        updateTwitchBadge(
            false
        );



        console.log(
            "Twitch OFFLINE"
        );



    }





}









/*
=====================================
LATEST VOD
=====================================
*/


async function loadLatestVod(){



    const vodArea =
    document.getElementById(
        "latestVod"
    );




    if(
        !vodArea
    ){

        return;

    }






    /*
    
    Sem API oficial da Twitch,
    usamos a página de vídeos
    para manter compatibilidade.

    */




    vodArea.innerHTML = `


    <iframe

    src="https://www.twitch.tv/embed/${TWITCH_CHANNEL}/videos?parent=${getTwitchParent()}"

    title="Últimas lives da Upminaa"

    frameborder="0"

    scrolling="no"

    allowfullscreen>

    </iframe>


    `;




}









loadTwitchLive();


loadLatestVod();








/*
=====================================
LIVE CHECK AUTOMATIC
=====================================
*/


setInterval(
    loadTwitchLive,
    120000
);/*
=====================================
INFORMATION SOURCES SYSTEM
=====================================
*/


const sourceButtons =
document.querySelectorAll(
    ".information-source a"
);



sourceButtons.forEach(
button=>{


    button.addEventListener(
        "click",
        event=>{


            event.stopPropagation();


        }
    );


});







/*
=====================================
IMAGE DEBUG SYSTEM
=====================================
*/


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
                "Imagem não encontrada:",
                image.src
            );



            image.style.opacity =
            "0.3";



        }
    );



});







/*
=====================================
EXTERNAL LINKS SECURITY
=====================================
*/


document
.querySelectorAll(
    'a[target="_blank"]'
)
.forEach(
link=>{


    if(
        !link.hasAttribute(
            "rel"
        )
    ){


        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );


    }



});







/*
=====================================
OFFICIAL LINKS RESTORE
=====================================
*/


const officialLinks =
document.querySelector(
    ".official-links"
);



if(
    officialLinks
){


    officialLinks.classList.add(
        "visible"
    );


}








/*
=====================================
CARD CLICK FIX
=====================================
*/


document
.querySelectorAll(
    ".gallery-card, .cosplay-card"
)
.forEach(
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
                !event.target.closest("a")
            ){


                image.click();



            }



        }
    );



});








/*
=====================================
PREVENT LIGHTBOX SCROLL RESET
=====================================
*/


window.addEventListener(
"beforeunload",
()=>{


    sessionStorage.setItem(
        "scrollPosition",
        window.scrollY
    );


});





window.addEventListener(
"load",
()=>{


    const saved =
    sessionStorage.getItem(
        "scrollPosition"
    );



    if(saved){


        window.scrollTo(
            0,
            Number(saved)
        );



        sessionStorage.removeItem(
            "scrollPosition"
        );


    }



});/*
=====================================
FINAL UI FIXES
=====================================
*/


/*
=====================================
LIGHTBOX SCROLL FIX
=====================================
*/


const activeLightbox =
document.getElementById(
    "imageLightbox"
);



function lockScroll(){

    document.body.style.overflow =
    "hidden";

}



function unlockScroll(){

    document.body.style.overflow =
    "";

}







if(activeLightbox){


    activeLightbox.addEventListener(
        "transitionend",
        ()=>{


            if(
                activeLightbox.classList.contains(
                    "active"
                )
            ){

                lockScroll();

            }
            else{

                unlockScroll();

            }


        }
    );



}









/*
=====================================
CARD REVEAL FINAL
=====================================
*/


const cards =
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




cards.forEach(
card=>{


    card.classList.add(
        "reveal"
    );



});








/*
=====================================
ACTIVE NAV SECTION
=====================================
*/


const sections =
document.querySelectorAll(
"section[id]"
);



const navLinks =
document.querySelectorAll(
".nav-links a"
);




window.addEventListener(
"scroll",
()=>{


    let current =
    "";



    sections.forEach(
    section=>{


        const top =
        section.offsetTop - 150;



        if(
            window.scrollY >= top
        ){

            current =
            section.id;

        }


    });





    navLinks.forEach(
    link=>{


        link.classList.remove(
            "active"
        );



        if(
            link.getAttribute(
                "href"
            ) === "#" + current
        ){


            link.classList.add(
                "active"
            );


        }



    });



});








/*
=====================================
SITE READY
=====================================
*/


console.log(
`
=================================

UPMINAA FAN HUB

FINAL BUILD LOADED

✓ Lightbox fixed
✓ Twitch system loaded
✓ YouTube system loaded
✓ Cards enabled
✓ Sources enabled
✓ Animations enabled

=================================
`
);
