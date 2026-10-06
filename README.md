![Header](thumbnail.png)

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/discord.js-5865F2.svg?style=for-the-badge&logo=discorddotjs&logoColor=white" alt="discord.js"/>
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white" alt="MongoDB"/>
</p>

# 🎵 Astrix

**Astrix** is an advanced, ultra-aesthetic Discord music and multi-purpose bot built on Discord.js v14, featuring hybrid sharding, next-gen Container V2 minimal UI, and a high-performance audio engine powered by Lavalink v4 (Kazagumo & Shoukaku). Designed for seamless music streaming, robust queue management, anti-nuke server protection, and automated server utilities.

---

## ✨ Key Features

### 🎶 Music Playback
- **Multi-Platform Audio:** Stream smoothly from YouTube, Spotify, SoundCloud, Apple Music, and direct HTTP/raw streams.
- **Lavalink v4 Powered:** Lossless 384kbps audio quality with ultra-low latency and zero buffer lag.
- **Dynamic Audio Filters:** Bassboost, Nightcore, Vaporwave, 8D, Pop, Soft, Treblebass, and custom Equalizer presets.
- **Autoplay & Recommendations:** Smart queue replenishment when the tracklist ends.
- **24/7 Voice Mode:** Keep the bot connected in your voice channel permanently.

### 🎨 Next-Gen Container V2 UI
- **Minimalist & Clean:** Custom compact embeds, subtext metadata (`-#`), and sleek button layouts.
- **Interactive Controls:** Pause, Skip, Loop, Shuffle, Stop, and Volume adjustments right from Discord button components.
- **Modern Canvas Graphics:** Dynamic now-playing cards and profile previews.

### 📋 Advanced Queue & Playlist System
- **Comprehensive Queue Controls:** Shuffle, move, remove, jump, and clear tracks on the fly.
- **Custom Playlists:** Create, save, load, and share your personal playlists directly within Discord.
- **History Tracking:** Revisit previously played tracks effortlessly.

### 🛡️ Security & Server Automation
- **Antinuke Engine:** Protect against rogue bots and unauthorized actions (mass-ban, mass-kick, channel/role deletion).
- **Automod & Utility:** Auto-responder, auto-react, voice roles, server analytics, and moderation suite.
- **Prefix & Slash Support:** Works with standard prefix commands (default `>`) and slash commands.

### 🚀 High Performance & Scalability
- **Hybrid Sharding:** Uses `discord-hybrid-sharding` to distribute server load across isolated worker processes.
- **Optimized Database:** Fast document caching and persistent guild configurations with MongoDB (Mongoose).
- **Auto-Reconnection:** Automatic session recovery and player resilience on network hiccups.

---

## 🛠️ Technologies Used

- **[Discord.js v14](https://discord.js.org/)** - Modern Discord API library
- **[discord-hybrid-sharding](https://github.com/meister03/discord-hybrid-sharding)** - Scalable process clustering & sharding
- **[Lavalink v4](https://github.com/lavalink-devs/Lavalink)** - Standalone high-throughput audio server
- **[Kazagumo](https://github.com/Takiyo0/Kazagumo)** & **[Shoukaku](https://github.com/Deivu/Shoukaku)** - Robust Lavalink wrapper and player manager
- **[Mongoose](https://mongoosejs.com/)** - Elegant MongoDB object modeling

---

## 📦 Setup Instructions

### Prerequisites

1. **Node.js**: v18.17.0 or higher ([Download Node.js](https://nodejs.org/))
2. **MongoDB Database**: Free MongoDB Atlas cluster URI ([Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
3. **Discord Bot Application**: Create a bot and obtain your Token & Client ID from the [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable **Message Content Intent**, **Server Members Intent**, and **Presence Intent** under the Bot tab.
4. **Lavalink v4 Server**: A running Lavalink v4 instance (free public node is pre-configured by default).

---

### Step-by-Step Installation

#### 1. Clone or Download the Repository

```bash
git clone https://github.com/Extremez-Surya/Astrix.git
cd Astrix
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Copy the `.env.example` file to create your `.env`:

```bash
cp .env.example .env
```

Open `.env` in your favorite editor (VS Code, Notepad, Nano) and fill in your credentials:

```env
# Discord Bot
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
PREFIX=>
OWNER_IDS=your_user_id_here

# MongoDB
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/astrix?retryWrites=true&w=majority

# Lavalink v4 Server
LAVALINK_URL=lavalinkv4.serenetia.com:443
LAVALINK_PASSWORD=https://seretia.link/discord
LAVALINK_SECURE=true

# Spotify API (Optional but recommended)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

#### 4. Start the Bot

Run the bot with hybrid cluster sharding:

```bash
# Production launch
npm start

# Or directly with node
node Shard.js
```

---

## 📝 Configuration Guide

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `DISCORD_TOKEN` | Discord bot token from Developer Portal | **Yes** | — |
| `CLIENT_ID` | Discord application Client ID | **Yes** | — |
| `PREFIX` | Default prefix for guild commands | No | `>` |
| `OWNER_IDS` | Discord User ID(s) of bot owner(s) | **Yes** | — |
| `MONGO_URL` | MongoDB connection connection string | **Yes** | — |
| `LAVALINK_URL` | Host and port of Lavalink v4 node | No | `lavalinkv4.serenetia.com:443` |
| `LAVALINK_PASSWORD` | Password for Lavalink node | No | `https://seretia.link/discord` |
| `LAVALINK_SECURE` | Set `true` for SSL/WSS, `false` for plain WS | No | `true` |
| `SPOTIFY_CLIENT_ID` | Spotify Developer application client ID | No | — |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer application client secret | No | — |
| `EMBED_COLOR` | Primary HEX accent color for bot messages | No | `#2f3136` |
| `SUPPORT_SERVER_URL` | Support Discord server invite link | No | — |

---

## 🎯 Command Reference

### 🎵 Music Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| `play` | `play <song / url / playlist>` | Plays audio from YouTube, Spotify, SoundCloud, etc. |
| `pause` | `pause` | Pauses the currently playing track |
| `resume` | `resume` | Resumes playback of a paused track |
| `skip` | `skip` | Skips the current track to the next song |
| `stop` | `stop` | Stops player, clears queue, and leaves voice channel |
| `queue` | `queue [page]` | Displays the current queue list |
| `nowplaying` | `nowplaying` (`np`) | Displays the now playing track with interactive controls |
| `volume` | `volume <1-100>` | Adjusts playback volume |
| `loop` | `loop <track/queue/off>` | Loops current song or the entire queue |
| `seek` | `seek <time>` | Seeks to a specific timestamp in the track |
| `247` | `247` | Toggles 24/7 persistent voice connection |
| `autoplay` | `autoplay` | Automatically queues recommended songs |

### 🎚️ Audio Filter Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| `filter bassboost` | `filter bassboost <low/medium/high>` | Enhances bass frequencies |
| `filter nightcore` | `filter nightcore` | Speeds up playback with pitch shift |
| `filter vaporwave` | `filter vaporwave` | Slows down track with retro aesthetic reverb |
| `filter 8d` | `filter 8d` | Rotates audio around stereo channels |
| `filter reset` | `filter reset` | Clears all active audio filters |

### 📂 Playlist Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| `playlist create` | `playlist create <name>` | Creates a new user playlist |
| `playlist add` | `playlist add <name> <song>` | Adds a track to a playlist |
| `playlist load` | `playlist load <name>` | Loads and plays all songs in a playlist |
| `playlist delete` | `playlist delete <name>` | Deletes an existing playlist |
| `playlist list` | `playlist list` | Lists all your saved playlists |

### 🛡️ Antinuke & Security Commands

| Command | Usage | Description |
| :--- | :--- | :--- |
| `antinuke enable` | `antinuke enable` | Enables full guild protection suite |
| `antinuke disable` | `antinuke disable` | Disables antinuke monitoring |
| `antinuke whitelist`| `antinuke whitelist <@user>` | Whitelists trusted members from protection filters |
| `antinuke features` | `antinuke features` | Shows protection status for bans, kicks, webhooks, roles |

---

## 📄 Example `.env` File

```env
# ====================================
# DISCORD BOT CONFIGURATION
# ====================================
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
PREFIX=>
OWNER_IDS=984409270344908872

# ====================================
# DATABASE (MongoDB)
# ====================================
MONGO_URL=mongodb+srv://admin:pass123@cluster0.abcde.mongodb.net/astrix?retryWrites=true&w=majority

# ====================================
# LAVALINK V4 AUDIO NODE
# ====================================
LAVALINK_URL=lavalinkv4.serenetia.com:443
LAVALINK_PASSWORD=https://seretia.link/discord
LAVALINK_SECURE=true
NODE_NAME=Astrix-Lavalink
NODE_SOURCE=ytsearch

# ====================================
# SPOTIFY API (Optional)
# ====================================
SPOTIFY_CLIENT_ID=85aab1d51a174aad9eed6d7989f530e6
SPOTIFY_CLIENT_SECRET=b2ad05aa725e434c88776a1be8eab6c2

# ====================================
# EMBED & BRANDING
# ====================================
EMBED_COLOR=#2f3136
SUPPORT_SERVER_URL=https://discord.gg/yVxV7AxDBB
INVITE_URL=https://discord.com/api/oauth2/authorize?client_id=1031120600858624000&permissions=824671333721&scope=bot
```

> **⚠️ Security Reminder:** Never share or commit your `.env` file publicly. Keep your Discord bot token and database credentials private.

---

## 🚨 Troubleshooting & FAQ

<details>
<summary><b>1. Music isn't playing or bot joins VC and immediately disconnects</b></summary>
<br>

- Ensure your Lavalink node is online and matching the version (`Lavalink v4`).
- Check that the Discord bot has `Connect` and `Speak` permissions in the target voice channel.
- If using YouTube links, some public Lavalink nodes may require updated plugin configurations (e.g. `youtube-source`).
</details>

<details>
<summary><b>2. Bot commands don't trigger or respond</b></summary>
<br>

- Verify you enabled **Message Content Intent** in the Discord Developer Portal under your application's **Bot** tab.
- Check that the prefix matches what is set in `.env` (default is `>`).
</details>

<details>
<summary><b>3. MongoDB connection error</b></summary>
<br>

- Verify your MongoDB connection string in `.env`.
- Ensure Network Access on MongoDB Atlas includes your current IP address (or `0.0.0.0/0` for access from anywhere).
</details>

---

## 👥 Credits

- **Original Base & Architecture:** Developed & Created by **CodeX Development**
- **Made / Modified / Redesigned By:** **Extremez-Surya** ([GitHub](https://github.com/Extremez-Surya))
- Special thanks to the open-source community, Discord.js contributors, and Lavalink developers!

---

<p align="center">
  Original codebase by <b>CodeX Development</b> • Maintained & customized with ❤️ by <a href="https://github.com/Extremez-Surya">Extremez-Surya</a>
</p>

<p align="center">
  <a href="https://discord.gg/yVxV7AxDBB">Support Server</a> •
  <a href="https://github.com/Extremez-Surya/Astrix/issues">Report Bug</a> •
  <a href="https://github.com/Extremez-Surya/Astrix/issues">Request Feature</a>
</p>
