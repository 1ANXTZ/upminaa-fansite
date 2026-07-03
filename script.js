/* ===========================================================
   UPMINAA FAN HUB — SCRIPT
=========================================================== */

/* ---------- Loading screen ----------
   Runs immediately (not nested inside DOMContentLoaded) since this
   script sits at the end of <body>, the loader element already
   exists in the DOM by the time this line runs. Also has its own
   timeout so it hides itself no matter what else happens. */
const loaderEl = document.getElementById('loader');
if (loaderEl) {
  window.addEventListener('load', () => {
    setTimeout(() => loaderEl.classList.add('hidden'), 400);
  });
  setTimeout(() => loaderEl.classList.add('hidden'), 2000);
}

/* ---------- Latest YouTube videos ----------
   Pulls the channel's public RSS feed (always reflects the newest
   uploads, no API key needed) and rebuilds the video cards in the
   gallery grid with the most recent videos. Runs right away, in
   parallel with everything else below, so it doesn't block the
   rest of the page. */
const YT_CHANNEL_ID = 'UCw3CBMvVjZJNfQR3tEvTodQ'; // @upminaa
const YT_VIDEO_COUNT = 4; // um a menos, o 5º lugar agora é o VOD da Twitch
const YT_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;

// A couple of public CORS proxies, tried in order, so one going
// down doesn't take the whole feature with it.
const YT_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

async function fetchLatestVideoIds() {
  let lastError = null;
  for (const buildProxyUrl of YT_PROXIES) {
    try {
      const res = await fetch(buildProxyUrl(YT_RSS_URL));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xmlText = await res.text();
      const xml = new DOMParser().parseFromString(xmlText, 'text/xml');
      if (xml.querySelector('parsererror')) throw new Error('Invalid XML');

      const entries = Array.from(xml.getElementsByTagName('entry')).slice(0, YT_VIDEO_COUNT);
      const videos = entries.map(entry => ({
        id: entry.getElementsByTagName('yt:videoId')[0]?.textContent || '',
        title: entry.getElementsByTagName('title')[0]?.textContent || 'UpMinaa video',
      })).filter(v => v.id);

      if (videos.length) return videos;
      throw new Error('No videos found in feed');
    } catch (err) {
      lastError = err;
      // try next proxy
    }
  }
  throw lastError || new Error('Unable to fetch latest videos');
}

function renderVideoCards(videos) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Remove only the previously-injected/placeholder video cards,
  // keep the live Twitch card exactly where it is.
  grid.querySelectorAll('.yt-video-card').forEach(el => el.remove());

  videos.forEach(video => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-card embed-card yt-video-card';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.id}`;
    iframe.title = video.title;
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

    figure.appendChild(iframe);
    grid.appendChild(figure);
  });
}

function showVideoLoadError() {
  const placeholder = document.querySelector('.yt-placeholder');
  if (placeholder) {
    placeholder.innerHTML = '<div class="yt-error">Não foi possível carregar os vídeos mais recentes agora. Tente recarregar a página.</div>';
  }
}

async function loadLatestVideos() {
  try {
    const videos = await fetchLatestVideoIds();
    renderVideoCards(videos);
  } catch (err) {
    console.error('UpMinaa Fan Hub: failed to load latest YouTube videos', err);
    showVideoLoadError();
  }
}

loadLatestVideos();

/* ---------- Twitch live status + latest VOD ----------
   The official Twitch API needs a server-side secret to authenticate,
   which a static GitHub Pages site doesn't have. This uses the same
   public GQL endpoint Twitch's own website calls, with the well-known
   public "web client" Client-Id — the standard trick fan sites use to
   read live status without a backend. It's unofficial, so if Twitch
   changes something on their end this may need updating, but it's
   read-only and asks for nothing private. */
const TWITCH_CHANNEL = 'upminaa';
const TWITCH_CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko'; // Twitch's public web client id
const TWITCH_GQL_URL = 'https://gql.twitch.tv/gql';
const TWITCH_BADGE_HOLD_MS = 4000;      // tempo que o selo AO VIVO fica visível antes de sumir
const TWITCH_RECHECK_MS = 2 * 60 * 1000; // rechecha o status a cada 2 minutos

async function twitchGqlQuery(query) {
  const res = await fetch(TWITCH_GQL_URL, {
    method: 'POST',
    headers: { 'Client-Id': TWITCH_CLIENT_ID, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Twitch GQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error('Twitch GQL error');
  return json.data;
}

async function fetchTwitchIsLive() {
  const data = await twitchGqlQuery(
    `query { user(login: "${TWITCH_CHANNEL}") { stream { id } } }`
  );
  return Boolean(data && data.user && data.user.stream);
}

async function fetchLatestTwitchVod() {
  const data = await twitchGqlQuery(
    `query { user(login: "${TWITCH_CHANNEL}") { videos(first: 1, sort: TIME, type: ARCHIVE) { edges { node { id title } } } } }`
  );
  const edge = data && data.user && data.user.videos && data.user.videos.edges[0];
  return edge ? { id: edge.node.id, title: edge.node.title } : null;
}

function twitchEmbedParent() {
  // player.twitch.tv exige o(s) domínio(s) exato(s) que estão servindo a página
  return window.location.hostname || 'localhost';
}

function setTwitchBadge(state) {
  const badge = document.getElementById('twitchStatusBadge');
  if (!badge) return;
  badge.classList.remove('is-hidden');
  badge.classList.toggle('is-off', state === 'off');
  badge.classList.toggle('is-on', state === 'on');
  const label = badge.querySelector('.status-text');
  if (label) label.textContent = state === 'on' ? 'AO VIVO' : 'OFFLINE';
}

function mountTwitchLiveEmbed() {
  const wrap = document.getElementById('twitchEmbedWrap');
  const photo = document.getElementById('twitchStatusPhoto');
  const badge = document.getElementById('twitchStatusBadge');
  if (!wrap || wrap.dataset.mounted) return;

  const iframe = document.createElement('iframe');
  iframe.src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${twitchEmbedParent()}&parent=1anxtz.github.io&parent=localhost&muted=true`;
  iframe.title = 'UpMinaa ao vivo na Twitch';
  iframe.allowFullscreen = true;
  wrap.appendChild(iframe);
  wrap.classList.add('is-visible');
  wrap.dataset.mounted = 'true';

  if (photo) photo.style.opacity = '0';
  if (badge) badge.classList.add('is-hidden');
}

async function refreshTwitchStatus() {
  try {
    const isLive = await fetchTwitchIsLive();
    if (isLive) {
      setTwitchBadge('on');
      setTimeout(mountTwitchLiveEmbed, TWITCH_BADGE_HOLD_MS);
    } else {
      setTwitchBadge('off');
    }
  } catch (err) {
    console.error('UpMinaa Fan Hub: failed to check Twitch live status', err);
    // Mantém o estado padrão (foto + OFFLINE) em caso de falha.
  }
}

async function loadLatestTwitchVod() {
  const card = document.getElementById('twitchVodCard');
  if (!card) return;
  try {
    const vod = await fetchLatestTwitchVod();
    if (!vod) {
      card.innerHTML = '<div class="yt-loading">Nenhum VOD encontrado no momento.</div>';
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.twitch.tv/?video=${vod.id}&parent=${twitchEmbedParent()}&parent=1anxtz.github.io&parent=localhost&muted=true`;
    iframe.title = vod.title;
    iframe.allowFullscreen = true;
    card.innerHTML = '';
    card.appendChild(iframe);
  } catch (err) {
    console.error('UpMinaa Fan Hub: failed to load latest Twitch VOD', err);
    card.innerHTML = '<div class="yt-error">Não foi possível carregar o VOD mais recente agora.</div>';
  }
}

refreshTwitchStatus();
loadLatestTwitchVod();
setInterval(refreshTwitchStatus, TWITCH_RECHECK_MS);

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav after clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll-reveal animations ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-card, .social-card, .gallery-card, .section-heading, .bio-content, .cosplay-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Subtle parallax on hero background orbs ---------- */
  const orbA = document.querySelector('.orb-a');
  const orbB = document.querySelector('.orb-b');
  const heroFrame = document.querySelector('.hero-frame');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (orbA) orbA.style.transform = `translate(${y * 0.06}px, ${y * 0.12}px)`;
        if (orbB) orbB.style.transform = `translate(${-y * 0.05}px, ${-y * 0.08}px)`;
        if (heroFrame) heroFrame.style.transform = `translateY(${y * -0.08}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- Cursor-follow tilt on hero frame (desktop only) ---------- */
  const hero = document.querySelector('.hero');
  if (heroFrame && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      heroFrame.style.transition = 'transform 0.15s ease-out';
      heroFrame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      heroFrame.style.transition = 'transform 0.5s ease';
      heroFrame.style.transform = 'rotateY(0) rotateX(0)';
    });
  }
});
