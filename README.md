# Sunbot, but in js

## Prerequisites

- [Node.js](https://nodejs.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) on your PATH (e.g. `winget install yt-dlp.yt-dlp` on Windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), running before you start the bot — it hosts a small local service the bot needs to fetch YouTube audio (see below)
- A Discord application + bot created in the [Discord Developer Portal](https://discord.com/developers/applications)

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env` and fill it in (see below).
3. `npm run deploy` — registers the slash commands to your guild.
4. `npm run dev` — starts the local YouTube auth service (via Docker) and then the bot.

## .env

Copy `.env.example` to `.env` in the project root and fill in:

```env
BOT_TOKEN=<your bot token>
BOT_CLIENT_ID=<your application/client id>
BOT_GUILD_ID=<a guild id to deploy commands to for local dev>
YOUTUBE_COOKIES_FILE=
YOUTUBE_COOKIES_FROM_BROWSER=
```

`YOUTUBE_COOKIES_FILE` (path to a Netscape-format `cookies.txt`, relative to `src/`) and `YOUTUBE_COOKIES_FROM_BROWSER` (a browser name yt-dlp can read live, e.g. `firefox`) are both optional. Leave them blank unless a specific video still gets blocked after everything below is running.

`npm run deploy-global` deploys commands globally (all guilds, takes up to an hour to propagate) instead of just to `BOT_GUILD_ID`.

## Why Docker is needed

YouTube requires a "proof-of-origin" token for most official/label audio, which `yt-dlp` can't generate by itself. `docker-compose.yml` runs [bgutil-ytdlp-pot-provider](https://github.com/Brainicism/bgutil-ytdlp-pot-provider), a small local server that generates that token on demand; the matching yt-dlp plugin lives in `tools/yt-dlp-plugins/` and is wired in automatically. `npm run dev` starts this container for you (via a `predev` script), but Docker Desktop itself has to already be running — npm can start the container, not the Docker engine.
