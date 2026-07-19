# UpMinaa Fan Hub

An unofficial, fan-made hub celebrating **UpMinaa** — streamer, cosplayer and content creator. Built as a tribute site by the fan community, not affiliated with or endorsed by UpMinaa.

🔗 **Live site:** https://1anxtz.github.io/upminaa-fansite/

## Features

- 🎨 Custom dark/neon design (no framework, pure HTML/CSS/JS)
- 📱 Fully responsive layout
- 🔴 Live Twitch status badge — automatically detects when she's live and swaps to an embedded player
- 📺 Latest Twitch VOD embedded automatically
- ▶️ Latest YouTube videos pulled automatically from the channel's RSS feed
- 👗 Iconic cosplay showcase gallery
- 📖 Biography section with fun facts
- ✨ Scroll-reveal animations, parallax background, and cursor-tilt effects
- ♿ Accessibility touches: semantic HTML, `aria-*` attributes, visible focus states

## Built with

- HTML5
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (Fetch API, Intersection Observer, DOM manipulation)
- [Twitch's public GQL endpoint](https://gql.twitch.tv/gql) for live status (read-only, no secrets involved)
- YouTube RSS feed for latest uploads

## Project structure

```
upminaa-fansite/
├── index.html
├── 404.html
├── README.md
├── style.css
├── script.js
├── upminaa-profile.png
├── upminaa-bio-photo.jpg
├── cosplay-gura.jpg
├── cosplay-miku.jpg
├── cosplay-frieren.jpg
├── cosplay-maki.jpg
└── cosplay-makima.jpg
```

## Running locally

No build step needed — it's a static site. Just clone the repo and open `index.html` in a browser, or serve it with any static file server:

```bash
git clone https://github.com/1ANXTZ/upminaa-fansite.git
cd upminaa-fansite
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Disclaimer

This is an unofficial, fan-made website created purely out of appreciation for the content and community. All rights to images and likeness belong to their respective owners.

## Author

Made with 💜 by [1ANXTZ](https://github.com/1ANXTZ)
