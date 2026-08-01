/*
=====================================
UPMINAA FAN HUB — main.js

Static frontend script for GitHub Pages.

Features:
- Mobile navigation
- Smooth scrolling
- Scroll reveal animations
- Image lightbox
- Twitch player embed
- Twitch live badge
- Latest Twitch broadcasts fallback
- Latest YouTube videos loading
=====================================
*/


document.addEventListener('DOMContentLoaded', () => {


/* ============================== MOBILE MENU ============================== */


const menuButton = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');


if (menuButton && navLinks) {

    menuButton.addEventListener('click', () => {

        navLinks.classList.toggle('open');

    });

}



/* ============================== SMOOTH SCROLL ============================== */


document.querySelectorAll('a[href^="#"]').forEach((link) => {


    link.addEventListener('click', (event) => {


        const target = document.querySelector(
            link.getAttribute('href')
        );


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth'
            });

        }


    });


});





/* ============================== REVEAL ANIMATION ============================== */


const revealElements = document.querySelectorAll(
    '.about-image, .profile-card, .bio-card, .cosplay-card, .gallery-card, .live-player-card, .youtube-card, .social-card'
);


if ('IntersectionObserver' in window) {


    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add('visible');

                }

            });


        },
        {
            threshold: 0.15
        }

    );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });


}




/* ============================== BACK TO TOP ============================== */


const backTop = document.querySelector('#backTop');


if (backTop) {


    window.addEventListener('scroll', () => {


        backTop.classList.toggle(
            'show',
            window.scrollY > 500
        );


    });



    backTop.addEventListener('click', () => {


        window.scrollTo({

            top: 0,

            behavior: 'smooth'

        });


    });


}





/* ============================== LIGHTBOX ============================== */


const lightbox = document.querySelector('.lightbox');

const lightboxImage = document.querySelector('.lightbox img');

const lightboxClose = document.querySelector('.lightbox-close');



function openLightbox(image) {


    if (!lightbox || !lightboxImage) return;


    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;


    lightbox.classList.add('active');


}




function closeLightbox() {


    if (!lightbox || !lightboxImage) return;


    lightbox.classList.remove('active');


    setTimeout(() => {

        lightboxImage.src = '';

    }, 300);


}




document.querySelectorAll(
    '.cosplay-card img, .gallery-card img'
).forEach((image) => {


    image.style.cursor = 'pointer';


    image.addEventListener('click', (event) => {


        event.stopPropagation();


        openLightbox(image);


    });


});




document.querySelectorAll(
    '.cosplay-card, .gallery-card'
).forEach((card) => {


    const image = card.querySelector('img');


    if (!image) return;



    card.addEventListener('click', (event) => {


        if (event.target.tagName !== 'A') {


            openLightbox(image);


        }


    });


});




if (lightboxClose) {


    lightboxClose.addEventListener(
        'click',
        closeLightbox
    );


}




if (lightbox) {


    lightbox.addEventListener('click', (event) => {


        if (event.target === lightbox) {


            closeLightbox();


        }


    });


}




document.addEventListener('keydown', (event) => {


    if (
        event.key === 'Escape' &&
        lightbox?.classList.contains('active')
    ) {


        closeLightbox();


    }


});/* ============================== SECURITY HELPER ============================== */


function escapeHtml(value) {

    return String(value ?? '').replace(
        /[&<>"']/g,
        (character) => ({

            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'

        }[character])

    );

}





/* ============================== TWITCH ============================== */


const TWITCH_CHANNEL = 'upminaa';

const TWITCH_VIDEOS_URL =
    `https://www.twitch.tv/${TWITCH_CHANNEL}/videos`;



const twitchEls = {


    heroLiveStatus:
        document.querySelector('#heroLiveStatus'),


    twitchEmbedWrap:
        document.querySelector('#twitchEmbedWrap'),


    twitchStatusBadge:
        document.querySelector('#twitchStatusBadge'),


    twitchStreamTitle:
        document.querySelector('#twitchStreamTitle'),


    twitchStreamMeta:
        document.querySelector('#twitchStreamMeta'),


    latestVod:
        document.querySelector('#latestVod'),


    vodTitle:
        document.querySelector('#vodTitle'),


    vodMeta:
        document.querySelector('#vodMeta')


};





function getParentDomain() {


    const domain = window.location.hostname;


    return domain || 'localhost';


}







/*
Twitch official embed handles the real live/offline state.
No API key or backend required.
*/


function mountTwitchPlayer() {


    if (
        !twitchEls.twitchEmbedWrap ||
        twitchEls.twitchEmbedWrap.querySelector('iframe')
    ) {

        return;

    }



    const iframe = document.createElement('iframe');


    iframe.src =
        `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;



    iframe.width = '100%';

    iframe.height = '100%';

    iframe.frameBorder = '0';

    iframe.allowFullscreen = true;

    iframe.allow = 'autoplay; fullscreen';



    twitchEls.twitchEmbedWrap.appendChild(iframe);


}







function setLiveBadge(element, isLive) {


    if (!element) return;



    element.classList.toggle(
        'online',
        isLive
    );


    element.classList.toggle(
        'offline',
        !isLive
    );



    const label =
        element.querySelector('.status-label');



    if (label) {


        label.textContent =
            isLive ? 'LIVE' : 'OFFLINE';


    }


}







/*
Visual live indicator only.
The Twitch player remains the official source.
*/


async function refreshLiveBadge() {


    try {


        const response =
            await fetch(
                `https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`
            );



        const text =
            (await response.text()).toLowerCase();



        const isLive =
            response.ok &&
            !text.includes('offline') &&
            !text.includes('error');



        setLiveBadge(
            twitchEls.heroLiveStatus,
            isLive
        );


        setLiveBadge(
            twitchEls.twitchStatusBadge,
            isLive
        );




        if (twitchEls.twitchStreamTitle) {


            twitchEls.twitchStreamTitle.textContent =
                isLive
                ? 'Upminaa Live'
                : 'Upminaa is offline';


        }




        if (twitchEls.twitchStreamMeta) {


            twitchEls.twitchStreamMeta.textContent =
                isLive
                ? 'Watch the stream live right now.'
                : 'Follow on Twitch to get notified next time she goes live.';


        }



    } catch (error) {


        console.warn(
            'Twitch status check unavailable:',
            error
        );


    }


}







async function mountLatestVod() {


    if (!twitchEls.latestVod) return;



    try {


        const response =
            await fetch(
                `https://decapi.me/twitch/videos/${TWITCH_CHANNEL}`
            );



        if (!response.ok) {


            throw new Error(
                'Unable to load Twitch videos'
            );


        }




        const videos =
            await response.json();



        const latest =
            Array.isArray(videos)
            ? videos[0]
            : null;




        if (!latest || !latest.id) {


            throw new Error(
                'No videos found'
            );


        }






        twitchEls.latestVod.innerHTML = `

        <iframe

            src="https://player.twitch.tv/?video=${latest.id}&parent=${getParentDomain()}&muted=true"

            title="Latest Upminaa Twitch broadcast"

            allowfullscreen

            frameborder="0">

        </iframe>

        `;




        if (twitchEls.vodTitle) {


            twitchEls.vodTitle.textContent =
                latest.title || 'Latest Stream';


        }




        if (twitchEls.vodMeta) {


            twitchEls.vodMeta.textContent =
                'Recent broadcast from Upminaa.';


        }




    } catch (error) {


        console.warn(
            'Twitch VOD unavailable:',
            error
        );


        showVodFallbackLink();


    }


}







function showVodFallbackLink() {


    if (!twitchEls.latestVod) return;



    twitchEls.latestVod.innerHTML = `

    <a

        class="player-placeholder"

        href="${TWITCH_VIDEOS_URL}"

        target="_blank"

        rel="noopener noreferrer">

        Watch recent broadcasts on Twitch →

    </a>

    `;



    if (twitchEls.vodTitle) {


        twitchEls.vodTitle.textContent =
            'Recent Broadcasts';


    }



    if (twitchEls.vodMeta) {


        twitchEls.vodMeta.textContent =
            'See past streams on Twitch.';


    }


}





mountTwitchPlayer();


refreshLiveBadge();


mountLatestVod();



// Check every 5 minutes

setInterval(
    refreshLiveBadge,
    300000
); 
/* ==============================
   TWITCH PLAYER
============================== */

const TWITCH_CHANNEL = "upminaa";


const twitchEmbed = document.querySelector(
    "#twitchEmbedWrap"
);


const twitchStatus = document.querySelector(
    "#twitchStatusBadge"
);


const heroStatus = document.querySelector(
    "#heroLiveStatus"
);



function getParentDomain() {

    return window.location.hostname || "localhost";

}



function loadTwitchPlayer() {


    if (!twitchEmbed) return;


    const iframe = document.createElement("iframe");


    iframe.src =
    `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;


    iframe.width = "100%";

    iframe.height = "100%";

    iframe.frameBorder = "0";

    iframe.allowFullscreen = true;

    iframe.allow =
    "autoplay; fullscreen";



    twitchEmbed.innerHTML = "";

    twitchEmbed.appendChild(iframe);


}



function setOfflineStatus() {


    if (twitchStatus) {


        twitchStatus.classList.remove(
            "online"
        );


        twitchStatus.classList.add(
            "offline"
        );


    }



    if (heroStatus) {


        heroStatus.classList.remove(
            "online"
        );


        heroStatus.classList.add(
            "offline"
        );


    }


}



loadTwitchPlayer();

setOfflineStatus();





/* ==============================
   YOUTUBE FEED
============================== */


const YOUTUBE_CHANNEL_ID =
"UCw3CBMvVjZJNfQR3tEvTodQ";


const youtubeGrid =
document.querySelector("#youtubeGrid");



const youtubeChannel =
`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;




async function loadYoutubeVideos() {


    if (!youtubeGrid) return;



    try {


        const feed = 
        `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;



        const proxy =
        `https://api.allorigins.win/raw?url=${encodeURIComponent(feed)}`;



        const response =
        await fetch(proxy);



        if (!response.ok) {

            throw new Error(
                "Failed loading YouTube feed"
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
        [...xml.querySelectorAll("entry")];



        const videos =
        entries.slice(0,4).map(video => {


            return {


                id:
                video
                .querySelector(
                    "yt\\:videoId, videoId"
                )
                ?.textContent,


                title:
                video
                .querySelector("title")
                ?.textContent ||
                "Upminaa Video"


            };


        })
        .filter(video => video.id);




        if (!videos.length) {

            throw new Error(
                "No videos found"
            );

        }



        renderYoutubeVideos(videos);



    } catch(error) {


        console.warn(
            "YouTube unavailable:",
            error
        );


        youtubeFallback();


    }


}




function renderYoutubeVideos(videos) {


    youtubeGrid.innerHTML = "";



    videos.forEach(video => {



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



        youtubeGrid.appendChild(card);



    });



}





function youtubeFallback() {


    youtubeGrid.innerHTML = `


    <article class="youtube-card">


        <div class="video-wrapper">


            <a 
            class="player-placeholder"

            href="${youtubeChannel}"

            target="_blank"

            rel="noopener noreferrer">

            Watch latest videos on YouTube →

            </a>


        </div>


    </article>


    `;


}




loadYoutubeVideos();





/* ==============================
   IMAGE ERROR DEBUG
============================== */


document.querySelectorAll("img")
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




console.log(
"Upminaa Fan Hub loaded successfully"
);


});
