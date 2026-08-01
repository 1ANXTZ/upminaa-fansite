/*
=====================================
UPMINAA FAN HUB — main.js
Static, frontend-only site (GitHub Pages friendly). No backend, no build
step, no API keys.

- Twitch: the official player embed shows the live stream or Twitch's own
  "offline" screen automatically - that's the source of truth, no status
  check required for it to be correct. A small best-effort live badge is
  layered on top purely for cosmetic polish (title/pulse dot) and quietly
  does nothing if it can't be reached.
- YouTube: latest uploads are read from the channel's public RSS feed
  through a CORS proxy (browsers can't fetch it cross-origin directly).
  If that ever fails, the section falls back to a plain link to the
  channel instead of staying blank or broken.
=====================================
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ============================== MOBILE MENU ============================== */
  const menuButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  /* ============================== SMOOTH SCROLL ============================== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ============================== REVEAL ANIMATION ============================== */
  const revealElements = document.querySelectorAll(
    '.about-image, .profile-card, .bio-card, .cosplay-card, .gallery-card, .live-player-card, .youtube-card, .social-card'
  );
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
    { threshold: 0.15 }
  );
  revealElements.forEach((element) => revealObserver.observe(element));

  /* ============================== BACK TO TOP ============================== */
  const backTop = document.querySelector('#backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ============================== LIGHTBOX SYSTEM ============================== */
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
    setTimeout(() => (lightboxImage.src = ''), 300);
  }

  document.querySelectorAll('.cosplay-card img, .gallery-card img').forEach((image) => {
    image.style.cursor = 'pointer';
    image.addEventListener('click', (event) => {
      event.stopPropagation();
      openLightbox(image);
    });
  });

  document.querySelectorAll('.cosplay-card, .gallery-card').forEach((card) => {
    const image = card.querySelector('img');
    if (!image) return;
    card.addEventListener('click', (event) => {
      if (event.target.tagName !== 'A') openLightbox(image);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox?.classList.contains('active')) closeLightbox();
  });

  // Untrusted free-text (video/stream titles) must never be dropped into
  // innerHTML unescaped.
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  /* ============================== TWITCH ============================== */
  const TWITCH_CHANNEL = 'upminaa';
  const TWITCH_VIDEOS_URL = `https://www.twitch.tv/${TWITCH_CHANNEL}/videos`;

  const twitchEls = {
    heroLiveStatus: document.querySelector('#heroLiveStatus'),
    twitchEmbedWrap: document.querySelector('#twitchEmbedWrap'),
    twitchStatusBadge: document.querySelector('#twitchStatusBadge'),
    twitchStreamTitle: document.querySelector('#twitchStreamTitle'),
    twitchStreamMeta: document.querySelector('#twitchStreamMeta'),
    latestVod: document.querySelector('#latestVod'),
    vodTitle: document.querySelector('#vodTitle'),
    vodMeta: document.querySelector('#vodMeta'),
  };

  // Twitch embeds require the exact hostname they're served from. Reading
  // it dynamically means this works unmodified on GitHub Pages, a custom
  // domain, or localhost - no manual config needed per deployment.
  function getParentDomain() {
    const domain = window.location.hostname;
    return domain === '' ? 'localhost' : domain;
  }

  // The official player IS the live/offline indicator - it shows the
  // stream when live and Twitch's own offline screen otherwise. Mounting
  // it is the entire "detection" mechanism for the main player.
  function mountTwitchPlayer() {
    if (!twitchEls.twitchEmbedWrap || twitchEls.twitchEmbedWrap.querySelector('iframe')) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'autoplay; fullscreen';
    twitchEls.twitchEmbedWrap.appendChild(iframe);
  }

  function setLiveBadge(element, isLive) {
    if (!element) return;
    element.classList.toggle('online', isLive);
    element.classList.toggle('offline', !isLive);
    const label = element.querySelector('.status-label');
    if (label) label.textContent = isLive ? 'LIVE' : 'OFFLINE';
  }

  // Best-effort, cosmetic only: a small live badge (title text + pulse
  // dot) on top of the player above. This uses a free, keyless public
  // lookup rather than the official API, since that would require a
  // backend to hold credentials. If it's ever unreachable, the badge
  // simply stays in its default "offline" styling - the player itself is
  // unaffected either way, so nothing actually breaks.
  async function refreshLiveBadge() {
    try {
      const res = await fetch(`https://decapi.me/twitch/uptime/${TWITCH_CHANNEL}`);
      const text = (await res.text()).toLowerCase();
      const isLive = res.ok && !text.includes('offline') && !text.includes('error');

      setLiveBadge(twitchEls.heroLiveStatus, isLive);
      setLiveBadge(twitchEls.twitchStatusBadge, isLive);

      if (twitchEls.twitchStreamTitle) {
        twitchEls.twitchStreamTitle.textContent = isLive ? 'Upminaa Live' : 'Upminaa is offline';
      }
      if (twitchEls.twitchStreamMeta) {
        twitchEls.twitchStreamMeta.textContent = isLive
          ? 'Watch the stream live right now.'
          : 'Follow on Twitch to get notified next time she goes live.';
      }
    } catch (error) {
      // Non-critical - the embedded player above already shows the
      // correct live/offline state regardless of this check.
      console.warn('Live badge check unavailable (non-critical):', error);
    }
  }

  // Recent broadcasts card: tries to embed the latest VOD; if the lookup
  // is ever unavailable (rate-limited, endpoint changed, network issue),
  // falls back to a plain link to the channel's videos page - that link
  // always works and needs nothing from any API.
  async function mountLatestVod() {
    if (!twitchEls.latestVod) return;

    try {
      const res = await fetch(`https://decapi.me/twitch/videos/${TWITCH_CHANNEL}`);
      if (!res.ok) throw new Error(`request failed (${res.status})`);

      const videos = await res.json();
      const latest = Array.isArray(videos) ? videos[0] : null;

      if (!latest || !latest.id) throw new Error('no recent broadcasts found');

      twitchEls.latestVod.innerHTML = `
        <iframe
          src="https://player.twitch.tv/?video=${latest.id}&parent=${getParentDomain()}&muted=true"
          title="Latest Upminaa Twitch broadcast"
          allowfullscreen
          frameborder="0"
        ></iframe>`;

      if (twitchEls.vodTitle) twitchEls.vodTitle.textContent = escapeHtml(latest.title || 'Latest Stream');
      if (twitchEls.vodMeta) twitchEls.vodMeta.textContent = 'Recent broadcast from Upminaa.';
    } catch (error) {
      console.warn('Latest VOD unavailable, showing link instead:', error);
      showVodFallbackLink();
    }
  }

  function showVodFallbackLink() {
    if (!twitchEls.latestVod) return;
    twitchEls.latestVod.innerHTML = `
      <a class="player-placeholder" href="${TWITCH_VIDEOS_URL}" target="_blank" rel="noopener noreferrer">
        Watch her recent broadcasts on Twitch →
      </a>`;
    if (twitchEls.vodTitle) twitchEls.vodTitle.textContent = 'Recent Broadcasts';
    if (twitchEls.vodMeta) twitchEls.vodMeta.textContent = 'See past streams on Twitch.';
  }

  mountTwitchPlayer();
  refreshLiveBadge();
  mountLatestVod();
  setInterval(refreshLiveBadge, 120000);

  /* ============================== YOUTUBE ============================== */
  const YOUTUBE_CHANNEL_ID = 'UCw3CBMvVjZJNfQR3tEvTodQ';
  const YOUTUBE_CHANNEL_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`;
  const youtubeGrid = document.querySelector('#youtubeGrid');

  async function loadYoutubeVideos() {
    if (!youtubeGrid) return;

    try {
      const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
      // Browsers can't fetch the RSS feed cross-origin directly (no CORS
      // headers on YouTube's side), so it's read through a public proxy.
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;

      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`request failed (${res.status})`);

      const xmlText = await res.text();
      const xml = new DOMParser().parseFromString(xmlText, 'text/xml');

      if (xml.querySelector('parsererror')) throw new Error('feed did not parse as XML');

      const videos = [...xml.querySelectorAll('entry')]
        .slice(0, 4)
        .map((entry) => ({
          id: entry.querySelector('yt\\:videoId, videoId')?.textContent,
          title: entry.querySelector('title')?.textContent || 'Upminaa Video',
        }))
        .filter((video) => video.id);

      if (!videos.length) throw new Error('no videos found in feed');

      renderYoutubeVideos(videos);
    } catch (error) {
      console.warn('YouTube feed unavailable, showing link instead:', error);
      showYoutubeFallbackLink();
    }
  }

  function renderYoutubeVideos(videos) {
    youtubeGrid.innerHTML = '';
    videos.forEach((video) => {
      const safeTitle = escapeHtml(video.title);
      const card = document.createElement('article');
      card.className = 'youtube-card';
      card.innerHTML = `
        <div class="video-wrapper">
          <iframe src="https://www.youtube.com/embed/${video.id}" title="${safeTitle}" loading="lazy" allowfullscreen></iframe>
        </div>
        <div class="video-info">
          <h4>${safeTitle}</h4>
        </div>`;
      youtubeGrid.appendChild(card);
    });
  }

  function showYoutubeFallbackLink() {
    youtubeGrid.innerHTML = `
      <article class="youtube-card">
        <div class="video-wrapper">
          <a class="player-placeholder" href="${YOUTUBE_CHANNEL_URL}" target="_blank" rel="noopener noreferrer">
            Watch her latest videos on YouTube →
          </a>
        </div>
      </article>`;
  }

  loadYoutubeVideos();

  /* ============================== DEBUG HELPERS ============================== */
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => console.warn('Image not found:', image.src));
  });

  console.log('Upminaa Fan Hub — static site online (no backend)');
});
