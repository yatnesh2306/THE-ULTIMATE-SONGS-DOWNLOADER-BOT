# 🎵 The Ultimate Songs Downloader Bot



**A premium Telegram bot for downloading high-quality music with embedded cover art and metadata**

&#x20; &#x20;

[**🤖 Try Bot**](https://t.me/THE_ULTIMATE_SONGS_DOWNLOAD_BOT) • [**🌐 Website**](https://the-ultimate-songs-downloader-bot-harsh-patel.vercel.app) • [**📸 Instagram**](https://instagram.com/patelharsh.in) • [**💻 GitHub**](https://github.com/patelharsh80874)

---

## ✨ Features

- 🎵 **High-Quality Downloads**

  - 320kbps audio
  - MP3 & M4A support
  - Crystal-clear sound

- 🎨 **Rich Metadata**

  - Embedded cover art
  - Artist, album, year
  - Proper ID3 tagging

- ⚡ **Lightning Fast**

  - Instant results
  - Inline download buttons

- 🌐 **Multi-Language Support**

  - Global song library
  - Regional & international tracks

- 🔍 **Smart Search**

  - Multiple matching results
  - Artist/album suggestions

- 📱 **User-Friendly UI**

  - Inline keyboards
  - Visual feedback
  - Clean design

---

## 🚀 Quick Start

### For Users

1. [Start Bot](https://t.me/THE_ULTIMATE_SONGS_DOWNLOAD_BOT)
2. Send a song name or artist
3. Choose your song
4. Click download
5. Enjoy 320kbps audio with artwork!

### Example

User: `Imagine Dragons Thunder`

Bot:

```
🎵 Thunder
🎤 Artist: Imagine Dragons
💼 Album: Evolve
🗓️ Year: 2017
🕒 Duration: 3:07
🌐 Language: English
[⬇️ Download Song]
```

---

## 🛠️ Tech Stack

- **Node.js** 18+
- **Telegram Bot API** via `node-telegram-bot-api`
- **Axios** for API requests
- **Vercel** for deployment (Serverless Functions)
- **Webhook**-based architecture

---

## 🏗️ Project Structure

```
telegram-bot/
├── api/
│   └── webhook.js         # Main bot logic
├── .env.example           # Environment template
├── package.json           # Node.js dependencies
├── vercel.json            # Vercel deployment config
├── README.md              # Documentation
```

---

## ⚙️ Installation & Setup

### Requirements

- Node.js 18+
- Telegram Bot Token ([@BotFather](https://t.me/BotFather))
- Vercel account

### Local Development

```bash
git clone https://github.com/patelharsh80874/THE-ULTIMATE-SONGS-DOWNLOADER-BOT.git
cd telegram-music-bot
npm install
cp .env.example .env
```

Add your bot token to `.env`

```env
TG_BOT_TOKEN=your_bot_token_here
```

Run the app:

```bash
npm start
```

Access on `http://localhost:3000`

### Deploy to Vercel

```bash
vercel --prod
vercel env add TG_BOT_TOKEN
```

Set webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-project.vercel.app/api/webhook"
```

---

## 📱 API Integration

**Music Search**:

```
GET https://jiosaavn-api-2-harsh-patel.vercel.app/api/search/songs?query={song_name}
```

**Audio Processing**:

```
GET https://the-ultimate-songs-download-server-python.vercel.app/generate-audio
```

---


## 👤 Author

**Harsh Patel**\
[Website](https://patelharsh.in) • [Instagram](https://instagram.com/patelharsh.in) • [GitHub](https://github.com/patelharsh80874)


---

## 📲 Support

- [GitHub Issues](https://github.com/patelharsh80874/THE-ULTIMATE-SONGS-DOWNLOADER-BOT/issues)
- [Telegram](https://t.me/patelharsh_in)
- [Email](mailto\:patelharsh80874@yahoo.com)

---

**⭐ Star this repo if it helped you!**

Made with ❤️ by [Harsh Patel](https://patelharsh.in)


# 🎓 EDUCATIONAL USE ONLY

## Important Notice

This project is developed and shared exclusively for **EDUCATIONAL PURPOSES**.

### What this means:
- ✅ Learning bot development concepts
- ✅ Understanding API integration
- ✅ Studying code architecture
- ✅ Practicing JavaScript/Node.js
- ✅ Learning deployment strategies

### What this does NOT allow:
- ❌ Commercial use without proper licensing
- ❌ Copyright infringement
- ❌ Mass distribution of copyrighted content
- ❌ Violating local laws and regulations
