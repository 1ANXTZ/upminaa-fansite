/* ===========================================================
   UPMINAA FAN HUB — SCRIPT
   Optimized version
=========================================================== */


/* ===========================================================
   GLOBAL CONFIG
=========================================================== */

const APP_CONFIG = {
  youtube: {
    channelId: 'UCw3CBMvVjZJNfQR3tEvTodQ',
    maxVideos: 4,
    cacheTime: 1000 * 60 * 30
  },

  twitch: {
    channel: 'upminaa',
    clientId: 'kimne78kx3ncx6brgo4mv6wki5h1ko',
    gqlUrl: 'https://gql.twitch.tv/gql',
    refreshTime: 1000 * 60 * 2
  }
};


/* ===========================================================
   HELPERS
=========================================================== */

const Utils = {

  qs(selector){
    return document.querySelector(selector);
  },

  qsa(selector){
    return document.querySelectorAll(selector);
  },


  safeCall(callback){
    try{
      callback();
    }catch(error){
      console.error(
        'UpMinaa Fan Hub error:',
        error
      );
    }
  },


  cacheSet(key,value,time){

    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        expires: Date.now() + time
      })
    );

  },


  cacheGet(key){

    const item =
      localStorage.getItem(key);

    if(!item) return null;


    try{

      const data =
        JSON.parse(item);


      if(Date.now() > data.expires){

        localStorage.removeItem(key);
        return null;

      }


      return data.value;


    }catch{

      localStorage.removeItem(key);
      return null;

    }

  }

};


/* ===========================================================
   LOADER
=========================================================== */

function initLoader(){

  const loader =
    Utils.qs('#loader');


  if(!loader)
    return;


  const hideLoader = () => {

    loader.classList.add(
      'hidden'
    );

  };


  window.addEventListener(
    'load',
    () => {

      setTimeout(
        hideLoader,
        400
      );

    }
  );


  // fallback caso algo trave
  setTimeout(
    hideLoader,
    2500
  );

}


initLoader();



/* ===========================================================
   YOUTUBE SYSTEM
=========================================================== */


const YT_RSS =
`https://www.youtube.com/feeds/videos.xml?channel_id=${APP_CONFIG.youtube.channelId}`;


const YT_PROXIES = [

  url =>
  `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,

  url =>
  `https://corsproxy.io/?url=${encodeURIComponent(url)}`

];



async function fetchYoutubeVideos(){


  const cached =
    Utils.cacheGet(
      'upminaa_youtube'
    );


  if(cached)
    return cached;



  let error;



  for(const proxy of YT_PROXIES){

    try{


      const response =
        await fetch(
          proxy(YT_RSS)
        );


      if(!response.ok)
        throw new Error(
          `HTTP ${response.status}`
        );



      const xmlText =
        await response.text();



      const xml =
        new DOMParser()
        .parseFromString(
          xmlText,
          'text/xml'
        );



      const entries =
        [
          ...xml.querySelectorAll(
            'entry'
          )
        ]
        .slice(
          0,
          APP_CONFIG.youtube.maxVideos
        );



      const videos =
        entries
        .map(entry => ({

          id:
          entry
          .getElementsByTagName(
            'yt:videoId'
          )[0]
          ?.textContent,


          title:
          entry
          .querySelector(
            'title'
          )
          ?.textContent ||
          'UpMinaa Video'

        }))

        .filter(
          video =>
          video.id
        );



      if(!videos.length)
        throw new Error(
          'Nenhum vídeo encontrado'
        );



      Utils.cacheSet(
        'upminaa_youtube',
        videos,
        APP_CONFIG.youtube.cacheTime
      );


      return videos;


    }catch(err){

      error = err;

    }

  }



  throw error ||
  new Error(
    'Falha ao buscar Youtube'
  );

}




function createYoutubeCard(video){


  const card =
  document.createElement(
    'figure'
  );


  card.className =
  'gallery-card embed-card yt-video-card';



  const iframe =
  document.createElement(
    'iframe'
  );


  iframe.src =
  `https://www.youtube.com/embed/${video.id}`;


  iframe.title =
  video.title;


  iframe.loading =
  'lazy';


  iframe.allowFullscreen =
  true;


  iframe.setAttribute(
    'allow',
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  );


  card.appendChild(
    iframe
  );


  return card;

}



function renderYoutubeVideos(videos){

  const grid =
  Utils.qs(
    '#galleryGrid'
  );


  if(!grid)
    return;



  grid
  .querySelectorAll(
    '.yt-video-card'
  )
  .forEach(
    card =>
    card.remove()
  );



  videos.forEach(video=>{

    grid.appendChild(
      createYoutubeCard(video)
    );

  });


}



async function initYoutube(){

  try{

    const videos =
      await fetchYoutubeVideos();


    renderYoutubeVideos(
      videos
    );


  }catch(error){

    console.error(
      'Youtube error:',
      error
    );

  }

}


initYoutube();/* ===========================================================
   TWITCH SYSTEM
=========================================================== */


async function twitchQuery(query){

  const response =
    await fetch(
      APP_CONFIG.twitch.gqlUrl,
      {
        method:'POST',

        headers:{
          'Client-ID':
          APP_CONFIG.twitch.clientId,

          'Content-Type':
          'application/json'
        },

        body:
        JSON.stringify({
          query
        })
      }
    );


  if(!response.ok){

    throw new Error(
      `Twitch HTTP ${response.status}`
    );

  }


  const json =
    await response.json();


  if(json.errors){

    throw new Error(
      'Twitch GQL error'
    );

  }


  return json.data;

}




async function checkTwitchLive(){


  const data =
  await twitchQuery(
`
query {

 user(login:"${APP_CONFIG.twitch.channel}") {

   stream {

     id

   }

 }

}
`
  );



  return Boolean(
    data
    ?.user
    ?.stream
  );

}




async function fetchLatestVod(){


  const cached =
    Utils.cacheGet(
      'upminaa_vod'
    );


  if(cached)
    return cached;



  const data =
  await twitchQuery(
`
query {

 user(login:"${APP_CONFIG.twitch.channel}") {

  videos(
    first:1,
    sort:TIME,
    type:ARCHIVE
  ){

    edges{

      node{

        id
        title

      }

    }

  }

 }

}
`
  );



  const video =
  data
  ?.user
  ?.videos
  ?.edges?.[0]
  ?.node;



  if(!video)
    return null;



  const result = {

    id:
    video.id,

    title:
    video.title

  };



  Utils.cacheSet(
    'upminaa_vod',
    result,
    1000 * 60 * 60
  );



  return result;

}





/* ===========================================================
   TWITCH EMBED HELPERS
=========================================================== */


function getEmbedParent(){


  const host =
    window.location.hostname;


  if(
    host &&
    host !== 'localhost'
  ){

    return host;

  }


  return 'localhost';

}





function createTwitchIframe(type,id){


  const iframe =
  document.createElement(
    'iframe'
  );



  let src;



  if(type === 'live'){


    src =
    `https://player.twitch.tv/?channel=${APP_CONFIG.twitch.channel}&parent=${getEmbedParent()}&muted=true`;


  }
  else{


    src =
    `https://player.twitch.tv/?video=${id}&parent=${getEmbedParent()}&muted=true`;

  }




  iframe.src =
    src;


  iframe.allowFullscreen =
    true;


  iframe.loading =
    'lazy';


  iframe.title =
    type === 'live'
    ?
    'UpMinaa ao vivo'
    :
    'Último VOD da UpMinaa';



  return iframe;

}





function updateTwitchBadge(state){


  const badge =
  Utils.qs(
    '#twitchStatusBadge'
  );


  if(!badge)
    return;



  const text =
  badge.querySelector(
    '.status-text'
  );



  badge.classList
  .toggle(
    'is-on',
    state === 'live'
  );



  badge.classList
  .toggle(
    'is-off',
    state !== 'live'
  );



  if(text){

    text.textContent =
    state === 'live'
    ?
    'AO VIVO'
    :
    'OFFLINE';

  }

}




function mountLiveStream(){


  const wrap =
  Utils.qs(
    '#twitchEmbedWrap'
  );


  const photo =
  Utils.qs(
    '#twitchStatusPhoto'
  );


  if(
    !wrap ||
    wrap.dataset.loaded
  )
    return;



  const iframe =
  createTwitchIframe(
    'live'
  );



  wrap.appendChild(
    iframe
  );


  wrap.classList.add(
    'is-visible'
  );


  wrap.dataset.loaded =
  'true';



  if(photo){

    photo.style.opacity =
    '0';

  }


}





async function refreshTwitch(){


  try{


    const live =
    await checkTwitchLive();



    if(live){


      updateTwitchBadge(
        'live'
      );


      setTimeout(
        mountLiveStream,
        4000
      );


    }
    else{


      updateTwitchBadge(
        'offline'
      );


    }



  }
  catch(error){


    console.error(
      'Twitch status error:',
      error
    );


  }


}





async function loadVod(){


  const card =
  Utils.qs(
    '#twitchVodCard'
  );


  if(!card)
    return;



  try{


    const vod =
    await fetchLatestVod();



    if(!vod){

      card.innerHTML =
      `
      <div class="yt-loading">
      Nenhum VOD encontrado.
      </div>
      `;

      return;

    }



    card.innerHTML =
    '';



    card.appendChild(
      createTwitchIframe(
        'vod',
        vod.id
      )
    );



  }
  catch(error){


    console.error(
      'VOD error:',
      error
    );


    card.innerHTML =
    `
    <div class="yt-error">
    Não foi possível carregar o VOD.
    </div>
    `;


  }


}





function initTwitch(){


  refreshTwitch();


  loadVod();



  setInterval(
    refreshTwitch,
    APP_CONFIG.twitch.refreshTime
  );


}



initTwitch();/* ===========================================================
   DOM INITIALIZATION
=========================================================== */


document.addEventListener(
  'DOMContentLoaded',
  () => {


/* ===========================================================
   FOOTER YEAR
=========================================================== */


    const year =
    Utils.qs(
      '#year'
    );


    if(year){

      year.textContent =
      new Date()
      .getFullYear();

    }




/* ===========================================================
   HEADER SCROLL EFFECT
=========================================================== */


    const header =
    Utils.qs(
      '#siteHeader'
    );


    if(header){


      const updateHeader =
      () => {

        header.classList.toggle(
          'scrolled',
          window.scrollY > 40
        );

      };



      updateHeader();



      window.addEventListener(
        'scroll',
        updateHeader,
        {
          passive:true
        }
      );


    }




/* ===========================================================
   MOBILE NAVIGATION
=========================================================== */


    const navButton =
    Utils.qs(
      '#navToggle'
    );


    const nav =
    Utils.qs(
      '#navLinks'
    );



    if(
      navButton &&
      nav
    ){


      navButton.addEventListener(
        'click',
        ()=>{


          const open =
          nav.classList.toggle(
            'open'
          );



          navButton.classList.toggle(
            'open',
            open
          );



          navButton.setAttribute(
            'aria-expanded',
            String(open)
          );


        }
      );




      Utils.qsa(
        '.nav-link'
      )
      .forEach(link=>{


        link.addEventListener(
          'click',
          ()=>{


            nav.classList.remove(
              'open'
            );


            navButton.classList.remove(
              'open'
            );


            navButton.setAttribute(
              'aria-expanded',
              'false'
            );


          }
        );


      });


    }





/* ===========================================================
   SCROLL REVEAL
=========================================================== */


    const revealElements =
    Utils.qsa(
`
.about-card,
.social-card,
.gallery-card,
.section-heading,
.bio-content,
.cosplay-card
`
    );



    revealElements.forEach(
      element=>{

        element.classList.add(
          'reveal'
        );

      }
    );



    if(
      'IntersectionObserver'
      in window
    ){


      const observer =
      new IntersectionObserver(
        entries=>{


          entries.forEach(
            entry=>{


              if(
                entry.isIntersecting
              ){


                entry.target.classList.add(
                  'in-view'
                );


                observer.unobserve(
                  entry.target
                );


              }


            }
          );


        },
        {
          threshold:0.15
        }
      );




      revealElements.forEach(
        element=>
        observer.observe(element)
      );



    }
    else{


      revealElements.forEach(
        element=>
        element.classList.add(
          'in-view'
        )
      );


    }





/* ===========================================================
   BACKGROUND PARALLAX
=========================================================== */


    const orbA =
    Utils.qs(
      '.orb-a'
    );


    const orbB =
    Utils.qs(
      '.orb-b'
    );


    let scrollTick =
    false;



    window.addEventListener(
      'scroll',
      ()=>{


        if(scrollTick)
          return;



        requestAnimationFrame(
          ()=>{


            const y =
            window.scrollY;



            if(orbA){

              orbA.style.transform =
              `
              translate(
              ${y * 0.04}px,
              ${y * 0.08}px
              )
              `;

            }



            if(orbB){

              orbB.style.transform =
              `
              translate(
              ${-y * 0.03}px,
              ${-y * 0.06}px
              )
              `;

            }



            scrollTick =
            false;


          }
        );



        scrollTick =
        true;



      },
      {
        passive:true
      }
    );






/* ===========================================================
   HERO CARD 3D TILT
=========================================================== */


    const heroFrame =
    Utils.qs(
      '.hero-frame'
    );


    const hero =
    Utils.qs(
      '.hero'
    );



    if(
      heroFrame &&
      hero &&
      window.matchMedia(
        '(hover:hover)'
      ).matches
    ){



      let active =
      false;



      hero.addEventListener(
        'mousemove',
        event=>{


          const rect =
          heroFrame
          .getBoundingClientRect();



          const x =
          (
            event.clientX -
            rect.left -
            rect.width / 2
          )
          /
          rect.width;



          const y =
          (
            event.clientY -
            rect.top -
            rect.height / 2
          )
          /
          rect.height;



          heroFrame.style.transition =
          'transform .15s ease';



          heroFrame.style.transform =
          `
          rotateY(${x * 8}deg)
          rotateX(${-y * 8}deg)
          `;



          active =
          true;



        }
      );





      hero.addEventListener(
        'mouseleave',
        ()=>{


          if(!active)
            return;



          heroFrame.style.transition =
          'transform .5s ease';



          heroFrame.style.transform =
          `
          rotateY(0deg)
          rotateX(0deg)
          `;



          active =
          false;



        }
      );


    }



  }
);/* ===========================================================
   EXTRA UI FEATURES
=========================================================== */


/* ===========================================================
   BACK TO TOP BUTTON
=========================================================== */


function initBackToTop(){


  const button =
  document.createElement(
    'button'
  );


  button.className =
  'back-to-top';


  button.setAttribute(
    'aria-label',
    'Voltar ao topo'
  );


  button.innerHTML =
  '↑';



  document.body.appendChild(
    button
  );



  const toggleButton =
  ()=>{


    button.classList.toggle(
      'show',
      window.scrollY > 500
    );


  };



  window.addEventListener(
    'scroll',
    toggleButton,
    {
      passive:true
    }
  );



  button.addEventListener(
    'click',
    ()=>{


      window.scrollTo({

        top:0,

        behavior:'smooth'

      });


    }
  );


}



initBackToTop();





/* ===========================================================
   IMAGE OPTIMIZATION
=========================================================== */


function optimizeImages(){


  const images =
  document.querySelectorAll(
    'img'
  );



  images.forEach(
    img=>{


      if(
        !img.loading
      ){

        img.loading =
        'lazy';

      }



      img.decoding =
      'async';


    }
  );


}



optimizeImages();





/* ===========================================================
   EXTERNAL LINKS SECURITY
=========================================================== */


function secureExternalLinks(){


  document
  .querySelectorAll(
    'a[target="_blank"]'
  )
  .forEach(
    link=>{


      link.setAttribute(
        'rel',
        'noopener noreferrer'
      );


    }
  );


}



secureExternalLinks();





/* ===========================================================
   REDUCED MOTION SUPPORT
=========================================================== */


function respectMotionPreference(){


  if(
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    .matches
  ){


    document.body.classList.add(
      'reduced-motion'
    );


  }


}



respectMotionPreference();





/* ===========================================================
   SIMPLE VISITOR COUNTER
   Local only (not analytics)
=========================================================== */


function visitorCounter(){


  const key =
  'upminaa_visits';



  let visits =
  Number(
    localStorage.getItem(
      key
    )
  )
  || 0;



  visits++;



  localStorage.setItem(
    key,
    visits
  );



  const counter =
  Utils.qs(
    '#visitorCount'
  );



  if(counter){

    counter.textContent =
    visits;

  }


}



visitorCounter();





/* ===========================================================
   CONNECTION STATUS
=========================================================== */


function networkMonitor(){


  const update =
  ()=>{


    document.body
    .classList
    .toggle(
      'offline',
      !navigator.onLine
    );


  };



  window.addEventListener(
    'online',
    update
  );


  window.addEventListener(
    'offline',
    update
  );


  update();


}



networkMonitor();





/* ===========================================================
   GLOBAL ERROR HANDLER
=========================================================== */


window.addEventListener(
  'error',
  event=>{


    console.error(
      'UpMinaa Hub error:',
      event.error || event.message
    );


  }
);





/* ===========================================================
   FINAL BOOT MESSAGE
=========================================================== */


console.log(
`
╔══════════════════════════╗
║  UPMINAA FAN HUB ONLINE  ║
║  Systems initialized ✔   ║
╚══════════════════════════╝
`
);
