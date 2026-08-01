/*
=====================================
UPMINAA FAN HUB — main.js
Backend-driven version: Twitch live status/VOD and YouTube uploads
are now fetched from our own secured API (see /server), with
Server-Sent Events pushing updates the moment something changes.
=====================================
*/

// Same origin as the page by default. Override by setting
// window.UPMINAA_API_BASE before this script loads (e.g. if the API
// is hosted on a different domain than the static site).
const API_BASE = window.UPMINAA_API_BASE || '';

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

  /* ============================== TWITCH + YOUTUBE (backend-driven) ============================== */

  const TWITCH_CHANNEL = 'upminaa'; // used only to build the embed src, not for API calls

  const els = {
    heroLiveStatus: document.querySelector('#heroLiveStatus'),
    twitchEmbedWrap: document.querySelector('#twitchEmbedWrap'),
    twitchStatusBadge: document.querySelector('#twitchStatusBadge'),
    twitchStreamTitle: document.querySelector('#twitchStreamTitle'),
    twitchStreamMeta: document.querySelector('#twitchStreamMeta'),
    vodCard: document.querySelector('#vodCard'),
    latestVod: document.querySelector('#latestVod'),
    vodTitle: document.querySelector('#vodTitle'),
    vodMeta: document.querySelector('#vodMeta'),
    youtubeGrid: document.querySelector('#youtubeGrid'),
  };

  function getParentDomain() {
    const domain = window.location.hostname;
    return domain === '' || domain === 'localhost' ? 'localhost' : domain;
  }

  async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`);
    return res.json();
  }

  function setLiveBadge(element, isLive) {
    if (!element) return;
    element.classList.toggle('online', isLive);
    element.classList.toggle('offline', !isLive);
    const label = element.querySelector('.status-label');
    if (label) label.textContent = isLive ? 'LIVE' : 'OFFLINE';
  }

  function formatViewers(count) {
    if (typeof count !== 'number') return '';
    return new Intl.NumberFormat().format(count);
  }

  // video/stream titles are untrusted free-text from Twitch/YouTube - never
  // interpolate them into innerHTML without escaping first.
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[ch]));
  }

  function renderLive(status) {
    setLiveBadge(els.heroLiveStatus, !!status.isLive);
    setLiveBadge(els.twitchStatusBadge, !!status.isLive);

    if (status.isLive) {
      if (els.twitchEmbedWrap && !els.twitchEmbedWrap.querySelector('iframe')) {
        els.twitchEmbedWrap.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${getParentDomain()}&muted=true`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay; fullscreen';
        els.twitchEmbedWrap.appendChild(iframe);
      }

      if (els.twitchStreamTitle) els.twitchStreamTitle.textContent = status.title || 'Upminaa Live';
      if (els.twitchStreamMeta) {
        const viewers = formatViewers(status.viewerCount);
        els.twitchStreamMeta.textContent = [status.game, viewers && `${viewers} viewers`]
          .filter(Boolean)
          .join(' · ') || 'Watch the latest live stream.';
      }
      // The live embed already covers this; hide the VOD card while live.
      if (els.vodCard) els.vodCard.style.display = 'none';
    } else {
      if (els.twitchEmbedWrap) {
        els.twitchEmbedWrap.innerHTML = '<div class="player-placeholder">Offline right now — check the latest broadcast →</div>';
      }
      if (els.twitchStreamTitle) els.twitchStreamTitle.textContent = 'Upminaa is offline';
      if (els.twitchStreamMeta) els.twitchStreamMeta.textContent = 'Follow on Twitch to get notified next time she goes live.';
      if (els.vodCard) els.vodCard.style.display = '';
    }
  }

  function renderVod(vod) {
    if (!els.latestVod) return;

    if (vod && vod.id) {
      els.latestVod.innerHTML = `
        <iframe
          src="https://player.twitch.tv/?video=${vod.id}&parent=${getParentDomain()}&muted=true"
          title="Latest Upminaa Twitch Stream"
          allowfullscreen
          frameborder="0"
        ></iframe>`;
      if (els.vodTitle) els.vodTitle.textContent = vod.title || 'Latest Stream';
      if (els.vodMeta) {
        const date = vod.createdAt ? new Date(vod.createdAt).toLocaleDateString() : '';
        els.vodMeta.textContent = [date, vod.duration].filter(Boolean).join(' · ') || 'Recent broadcast from Upminaa.';
      }
    } else {
      els.latestVod.innerHTML = '<p class="player-placeholder">No recorded streams available.</p>';
    }
  }

  function renderYoutube(videos) {
    if (!els.youtubeGrid) return;

    if (!videos || !videos.length) {
      els.youtubeGrid.innerHTML = '<article class="youtube-card"><div class="video-wrapper"><p class="player-placeholder">Videos unavailable.</p></div></article>';
      return;
    }

    els.youtubeGrid.innerHTML = '';
    videos.forEach((video) => {
      const card = document.createElement('article');
      card.className = 'youtube-card';

      const date = video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : '';
      const safeTitle = escapeHtml(video.title);

      card.innerHTML = `
        <a class="video-wrapper" href="${video.url}" target="_blank" rel="noopener noreferrer">
          <iframe src="https://www.youtube.com/embed/${video.id}" title="${safeTitle}" loading="lazy" allowfullscreen></iframe>
        </a>
        <div class="video-info">
          <h4>${safeTitle}</h4>
          <p class="video-meta">${[date, video.duration].filter(Boolean).join(' · ')}</p>
        </div>`;

      els.youtubeGrid.appendChild(card);
    });
  }

  async function loadTwitchStatus() {
    try {
      const status = await apiGet('/api/twitch/status');
      renderLive(status);
      if (!status.isLive) await loadLatestVod();
    } catch (error) {
      console.warn('Twitch status failed:', error);
      if (els.twitchStreamMeta) els.twitchStreamMeta.textContent = 'Unable to load stream status.';
    }
  }

  async function loadLatestVod() {
    try {
      const vod = await apiGet('/api/twitch/vod');
      renderVod(vod);
    } catch (error) {
      console.warn('Latest VOD failed:', error);
      if (els.latestVod) els.latestVod.innerHTML = '<p class="player-placeholder">Unable to load latest stream.</p>';
    }
  }

  async function loadYoutubeVideos() {
    try {
      const videos = await apiGet('/api/youtube/videos');
      renderYoutube(videos);
    } catch (error) {
      console.warn('YouTube loading failed:', error);
      if (els.youtubeGrid) {
        els.youtubeGrid.innerHTML = '<article class="youtube-card"><div class="video-wrapper"><p class="player-placeholder">Videos unavailable.</p></div></article>';
      }
    }
  }

  // Initial load
  loadTwitchStatus();
  loadYoutubeVideos();

  // Fallback polling in case SSE is unavailable (proxies, ad-blockers, etc.)
  setInterval(loadTwitchStatus, 60000);
  setInterval(loadYoutubeVideos, 900000);

  /* ============================== REAL-TIME UPDATES (SSE) ============================== */
  function connectToLiveUpdates() {
    if (typeof EventSource === 'undefined') return;

    const source = new EventSource(`${API_BASE}/api/events`);

    source.addEventListener('twitch-status', (event) => renderLive(JSON.parse(event.data)));
    source.addEventListener('twitch-vod', (event) => renderVod(JSON.parse(event.data)));
    source.addEventListener('youtube-videos', (event) => renderYoutube(JSON.parse(event.data)));

    source.onerror = () => {
      // Browser auto-retries EventSource connections; nothing to do here
      // beyond relying on the fallback polling above if it stays down.
    };
  }

  connectToLiveUpdates();

  /* ============================== DEBUG HELPERS ============================== */
  document.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => console.warn('Image not found:', image.src));
  });

  window.addEventListener('error', (event) => {
    console.error(`Upminaa Fan Hub error: ${event.message} (${event.filename}:${event.lineno})`);
  });

  console.log('Upminaa Fan Hub — main.js online (backend-driven media)');
});
