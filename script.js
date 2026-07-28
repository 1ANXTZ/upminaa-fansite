/* ===========================================================
   UPMINAA FAN HUB — SCRIPT
   Premium Live System + Security Update
=========================================================== */


/* ===========================================================
   GLOBAL CONFIG
=========================================================== */

const APP_CONFIG = {

  youtube: {

    channelId:
    'UCw3CBMvVjZJNfQR3tEvTodQ',

    maxVideos:4,

    cacheTime:
    1000 * 60 * 30

  },


  twitch: {

    channel:
    'upminaa',

    clientId:
    'kimne78kx3ncx6brgo4mv6wki5h1ko',

    gqlUrl:
    'https://gql.twitch.tv/gql',

    refreshTime:
    1000 * 60 * 2

  },


  security: {

    maxImageSize:
    5 * 1024 * 1024,

    allowedFrames:[

      'player.twitch.tv',
      'www.youtube.com'

    ]

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

    }

    catch(error){

      console.error(
        'UpMinaa Hub Error:',
        error
      );

    }

  },




  cacheSet(key,value,time){


    localStorage.setItem(

      key,

      JSON.stringify({

        value:value,

        expires:
        Date.now()+time

      })

    );


  },





  cacheGet(key){


    const item =
    localStorage.getItem(key);



    if(!item)
      return null;



    try{


      const data =
      JSON.parse(item);



      if(
        Date.now() >
        data.expires
      ){

        localStorage.removeItem(key);

        return null;

      }



      return data.value;



    }


    catch{


      localStorage.removeItem(key);

      return null;


    }


  }





};







/* ===========================================================
   SECURITY SYSTEM
=========================================================== */


function initSecurity(){



  // Bloqueia scripts estranhos inseridos no DOM

  const observer =
  new MutationObserver(
    mutations=>{


      mutations.forEach(
        mutation=>{


          mutation.addedNodes
          .forEach(node=>{


            if(
              node.tagName === 'SCRIPT'
            ){

              console.warn(
                'Script bloqueado:',
                node.src
              );


            }


          });


        }
      );


    }
  );



  observer.observe(

    document.body,

    {

      childList:true,

      subtree:true

    }

  );





  // Proteção básica contra iframe externo

  document
  .querySelectorAll('iframe')
  .forEach(frame=>{


    const src =
    frame.src;



    if(src){


      const allowed =
      APP_CONFIG
      .security
      .allowedFrames
      .some(
        domain =>
        src.includes(domain)
      );



      if(!allowed){

        frame.remove();


        console.warn(
          'Iframe removido por segurança:',
          src
        );

      }


    }



  });



}



initSecurity();








/* ===========================================================
   LOADER
=========================================================== */


function initLoader(){


  const loader =
  Utils.qs('#loader');



  if(!loader)
    return;



  const hide = ()=>{


    loader.classList.add(
      'hidden'
    );


  };



  window.addEventListener(

    'load',

    ()=>{


      setTimeout(

        hide,

        400

      );


    }

  );



  setTimeout(

    hide,

    3000

  );


}



initLoader(); 
/* ===========================================================
   TWITCH LIVE SYSTEM
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
      'Twitch API error'
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
     title
     viewersCount

   }

 }

}
`

  );



  return (

    data
    ?.user
    ?.stream

  ) || null;


}








/* ===========================================================
   TWITCH PLAYER
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







function createLivePlayer(){


  const iframe =
  document.createElement(
    'iframe'
  );



  iframe.src =

  `https://player.twitch.tv/?channel=${APP_CONFIG.twitch.channel}&parent=${getEmbedParent()}&autoplay=true`;



  iframe.title =
  'UpMinaa Twitch Live';



  iframe.allowFullscreen =
  true;



  iframe.allow =

  'autoplay; fullscreen';



  iframe.loading =
  'lazy';



  iframe.frameBorder =
  '0';



  return iframe;


}








/* ===========================================================
   LIVE VISUAL STATE
=========================================================== */


function updateLiveVisual(isLive){



  const photo =
  Utils.qs(
    '#twitchStatusPhoto'
  );



  const badge =
  Utils.qs(
    '#twitchStatusBadge'
  );



  const wrap =
  Utils.qs(
    '#twitchEmbedWrap'
  );



  const card =
  Utils.qs(
    '#twitchLiveCard'
  );




  if(

    !photo ||
    !badge

  )
    return;






  if(isLive){



    // foto recebe efeito vermelho

    photo.classList.add(
      'is-live'
    );



    badge.classList.remove(
      'is-off'
    );


    badge.classList.add(
      'is-on'
    );



    badge.querySelector(
      '.status-text'
    )
    .textContent =

    'AO VIVO';




    if(

      wrap &&
      !wrap.dataset.loaded

    ){


      const player =
      createLivePlayer();



      wrap.appendChild(
        player
      );



      wrap.dataset.loaded =
      'true';



      card.classList.add(
        'live-active'
      );


    }





  }

  else{



    photo.classList.remove(
      'is-live'
    );



    badge.classList.remove(
      'is-on'
    );



    badge.classList.add(
      'is-off'
    );



    badge.querySelector(
      '.status-text'
    )
    .textContent =

    'OFFLINE';



    if(wrap){

      wrap.innerHTML =
      '';

      wrap.dataset.loaded =
      '';

    }



    if(card){

      card.classList.remove(
        'live-active'
      );

    }



  }



}








/* ===========================================================
   CHECK LOOP
=========================================================== */


async function refreshTwitch(){


  try{


    const stream =
    await checkTwitchLive();



    updateLiveVisual(
      Boolean(stream)
    );



    console.log(

      stream

      ?

      `🔴 LIVE: ${stream.title}`

      :

      '⚪ Offline'

    );



  }


  catch(error){


    console.error(

      'Twitch status error:',

      error

    );


  }


}








function initTwitchLive(){



  refreshTwitch();



  setInterval(

    refreshTwitch,

    APP_CONFIG
    .twitch
    .refreshTime

  );



}



initTwitchLive();


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



  let lastError;



  for(
    const proxy of YT_PROXIES
  ){


    try{


      const response =

      await fetch(
        proxy(YT_RSS)
      );



      if(!response.ok)

        throw new Error(
          'Youtube response error'
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

      .map(entry=>({


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

        ?.textContent

        ||

        'UpMinaa Video'


      }))


      .filter(
        video=>video.id
      );






      if(!videos.length)

        throw new Error(
          'No videos found'
        );





      Utils.cacheSet(

        'upminaa_youtube',

        videos,

        APP_CONFIG.youtube.cacheTime

      );



      return videos;



    }


    catch(error){


      lastError =
      error;


    }


  }



  throw lastError;


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



  iframe.allow =

  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';



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
    card=>card.remove()
  );





  videos.forEach(video=>{


    grid.appendChild(

      createYoutubeCard(
        video
      )

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


  }


  catch(error){


    console.error(

      'Youtube error:',

      error

    );


  }


}



initYoutube();









/* ===========================================================
   TWITCH VOD SYSTEM
=========================================================== */


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





  const vod =

  data

  ?.user

  ?.videos

  ?.edges?.[0]

  ?.node;





  if(!vod)

    return null;





  const result = {


    id:

    vod.id,



    title:

    vod.title


  };





  Utils.cacheSet(

    'upminaa_vod',

    result,

    1000 * 60 * 60

  );




  return result;


}









function loadVodPlayer(){



  const card =

  Utils.qs(
    '#twitchVodCard'
  );



  if(!card)
    return;





  fetchLatestVod()

  .then(vod=>{



    if(!vod){


      card.innerHTML =

      `

      <div class="yt-loading">

      Nenhum VOD encontrado.

      </div>

      `;


      return;


    }






    const iframe =

    document.createElement(
      'iframe'
    );




    iframe.src =


    `https://player.twitch.tv/?video=${vod.id}&parent=${getEmbedParent()}`;



    iframe.allowFullscreen =
    true;



    iframe.loading =
    'lazy';




    card.innerHTML =
    '';



    card.appendChild(
      iframe
    );



  })



  .catch(error=>{


    console.error(
      'VOD error:',
      error
    );


  });


}




loadVodPlayer();









/* ===========================================================
   EXTERNAL LINK SECURITY
=========================================================== */


function secureExternalLinks(){


  document

  .querySelectorAll(
    'a[target="_blank"]'
  )

  .forEach(link=>{


    link.setAttribute(

      'rel',

      'noopener noreferrer'

    );


  });


}




secureExternalLinks();









/* ===========================================================
   IMAGE OPTIMIZATION
=========================================================== */


function optimizeImages(){


  document

  .querySelectorAll(
    'img'
  )

  .forEach(img=>{


    img.loading =
    img.loading || 'lazy';



    img.decoding =
    'async';



  });



}



optimizeImages();


/* ===========================================================
   LIVE PHOTO ANIMATION
=========================================================== */


function initLivePhotoEffect(){


  const style =
  document.createElement(
    'style'
  );


  style.textContent = `


  .twitch-status-photo.is-live{

    animation:
    livePulse 1.5s infinite;

    border:
    4px solid #ff003c;

    box-shadow:

    0 0 20px #ff003c,
    0 0 45px rgba(255,0,60,.8);

  }



  @keyframes livePulse{


    0%{

      box-shadow:
      0 0 10px #ff003c;

    }



    50%{

      box-shadow:

      0 0 35px #ff003c,
      0 0 70px rgba(255,0,60,.8);

    }



    100%{

      box-shadow:
      0 0 10px #ff003c;

    }


  }





  .live-active
  .twitch-status-photo{

    opacity:.35;

  }



  .twitch-status-badge.is-on
  .status-dot{


    background:#ff003c;


    animation:
    dotPulse 1s infinite;


  }



  .twitch-status-badge.is-off
  .status-dot{

    background:#777;

  }





  @keyframes dotPulse{


    50%{

      transform:
      scale(1.5);

    }


  }



  `;



  document.head.appendChild(
    style
  );


}





initLivePhotoEffect();









/* ===========================================================
   HEADER EFFECT
=========================================================== */


function initHeader(){


  const header =

  Utils.qs(
    '#siteHeader'
  );



  if(!header)
    return;




  const update = ()=>{


    header.classList.toggle(

      'scrolled',

      window.scrollY > 40

    );


  };



  update();



  window.addEventListener(

    'scroll',

    update,

    {

      passive:true

    }

  );



}



initHeader();









/* ===========================================================
   MOBILE MENU
=========================================================== */


function initMobileMenu(){


  const button =

  Utils.qs(
    '#navToggle'
  );



  const nav =

  Utils.qs(
    '#navLinks'
  );



  if(
    !button ||
    !nav
  )
    return;





  button.addEventListener(

    'click',

    ()=>{


      const open =

      nav.classList.toggle(
        'open'
      );



      button.setAttribute(

        'aria-expanded',

        open

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


        button.setAttribute(

          'aria-expanded',

          'false'

        );


      }

    );


  });



}



initMobileMenu();









/* ===========================================================
   SCROLL REVEAL
=========================================================== */


function initReveal(){


  const elements =


  Utils.qsa(

`

.about-card,
.bio-content,
.cosplay-card,
.social-card,
.gallery-card,
.section-heading

`

  );





  elements.forEach(el=>{


    el.classList.add(
      'reveal'
    );


  });






  if(

    !('IntersectionObserver'
    in window)

  ){


    elements.forEach(el=>

      el.classList.add(
        'in-view'
      )

    );


    return;


  }






  const observer =


  new IntersectionObserver(

    entries=>{


      entries.forEach(entry=>{


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


      });



    },

    {

      threshold:.15

    }

  );





  elements.forEach(el=>

    observer.observe(el)

  );



}



initReveal();









/* ===========================================================
   BACK TO TOP
=========================================================== */


function initBackTop(){



  const button =

  document.createElement(
    'button'
  );



  button.className =
  'back-to-top';



  button.innerHTML =
  '↑';



  button.setAttribute(

    'aria-label',

    'Voltar ao topo'

  );



  document.body.appendChild(
    button
  );





  window.addEventListener(

    'scroll',

    ()=>{


      button.classList.toggle(

        'show',

        window.scrollY > 600

      );


    }

  );





  button.onclick = ()=>{


    window.scrollTo({

      top:0,

      behavior:'smooth'

    });


  };


}



initBackTop();









/* ===========================================================
   NETWORK STATUS
=========================================================== */


function initNetwork(){


  const update = ()=>{


    document.body.classList.toggle(

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



initNetwork();









/* ===========================================================
   VISITOR LOCAL COUNTER
=========================================================== */


function visitorCounter(){


  const key =
  'upminaa_visits';



  let count =

  Number(

    localStorage.getItem(key)

  )

  || 0;



  count++;



  localStorage.setItem(

    key,

    count

  );



  const element =

  Utils.qs(
    '#visitorCount'
  );



  if(element)

    element.textContent =
    count;



}



visitorCounter();









/* ===========================================================
   GLOBAL ERROR PROTECTION
=========================================================== */


window.addEventListener(

  'error',

  event=>{


    console.error(

      'UpMinaa Hub Error:',

      event.error ||
      event.message

    );


  }

);









/* ===========================================================
   FINAL START
=========================================================== */


console.log(`

╔════════════════════════════╗

║  UPMINAA FAN HUB ONLINE   ║

║  LIVE SYSTEM READY ✔      ║

╚════════════════════════════╝

`);
