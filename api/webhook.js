const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Environment variables
const BOT_TOKEN = process.env.TG_BOT_TOKEN;

// In-memory storage for user search results
const userSearchResults = new Map();

// Create bot instance
const bot = new TelegramBot(BOT_TOKEN);

// Utility functions
const cleanUrl = (url) => url?.replace(/[\[\]]/g, '') || '';

const createSafeFilename = (name) => {
    return name.replace(/[^a-zA-Z0-9 _\-()]/g, '_').substring(0, 50);
};

const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Modern HTML page for base route (without stats section)
// Updated getHomePage function with only "5 Search Results" removed
const getHomePage = () => {
    return `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>The Ultimate Songs Downloader Bot - Premium Music Downloads</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            --secondary-gradient: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
            --dark-gradient: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            --text-primary: #2d3748;
            --text-secondary: #4a5568;
            --card-shadow: 0 20px 40px rgba(0,0,0,0.1);
            --hover-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        
        body { 
            font-family: 'Poppins', sans-serif; 
            background: var(--primary-gradient);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            overflow-x: hidden;
        }
        
        .floating-shapes {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: -1;
        }
        
        .shape {
            position: absolute;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        .shape:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .shape:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 20%;
            right: 10%;
            animation-delay: 2s;
        }
        
        .shape:nth-child(3) {
            width: 60px;
            height: 60px;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .container { 
            max-width: 600px; 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 3.5rem 2.5rem; 
            border-radius: 30px; 
            box-shadow: var(--card-shadow);
            text-align: center;
            animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            border: 1px solid rgba(255,255,255,0.3);
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0; 
                transform: translateY(60px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        .logo {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        h1 { 
            color: var(--text-primary);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }
        
        .subtitle {
            font-size: 1.2rem; 
            color: var(--text-secondary);
            margin-bottom: 2.5rem;
            line-height: 1.6;
            font-weight: 400;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(255,255,255,0.5);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            font-size: 1.8rem;
            font-weight: 700;
            color: #667eea;
            display: block;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        }
        
        .features {
            margin: 2.5rem 0;
            text-align: left;
        }
        
        .features h3 {
            color: var(--text-primary);
            margin-bottom: 1.5rem;
            text-align: center;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .feature-item {
            padding: 1rem 1.5rem;
            background: rgba(255,255,255,0.6);
            border-radius: 15px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
        }
        
        .feature-item:hover {
            transform: translateX(5px);
            background: rgba(255,255,255,0.8);
        }
        
        .feature-item::before {
            content: "✨";
            margin-right: 10px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            margin: 2rem 0;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-size: 1rem;
            position: relative;
            overflow: hidden;
            min-width: 180px;
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .telegram-btn {
            background: linear-gradient(45deg, #0088cc, #229ED9);
            color: white;
            box-shadow: 0 10px 25px rgba(0, 136, 204, 0.3);
        }
        
        .telegram-btn:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 136, 204, 0.4);
        }
        
        .instagram-btn {
            background: linear-gradient(45deg, #E4405F, #C13584, #833AB4);
            color: white;
            box-shadow: 0 10px 25px rgba(228, 64, 95, 0.3);
        }
        
        .instagram-btn:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 40px rgba(228, 64, 95, 0.4);
        }
        
        .github-btn {
            background: linear-gradient(45deg, #24292e, #586069);
            color: white;
            box-shadow: 0 10px 25px rgba(36, 41, 46, 0.3);
        }
        
        .github-btn:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 20px 40px rgba(36, 41, 46, 0.4);
        }
        
        .icon {
            margin-right: 8px;
            font-size: 1.2rem;
        }
        
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 2px solid rgba(255,255,255,0.3);
            color: var(--text-secondary);
            font-size: 0.95rem;
        }
        
        .made-by {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .made-by a {
            color: #667eea;
            text-decoration: none;
            font-weight: 700;
            transition: all 0.3s ease;
        }
        
        .made-by a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        
        .tech-stack {
            font-size: 0.85rem;
            opacity: 0.8;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 2rem 1.5rem;
                margin: 10px;
            }
            
            h1 { font-size: 2rem; }
            .subtitle { font-size: 1rem; }
            
            .social-links {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 280px;
            }
            
            .stats {
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    <div class="floating-shapes">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    
    <div class='container'>
        <div class="logo pulse">🎵</div>
        <h1>The Ultimate Songs Downloader Bot</h1>
        <p class='subtitle'>
            Experience premium music downloads with crystal-clear quality, embedded artwork, and complete metadata. Your favorite Telegram bot for unlimited music discovery.
        </p>
        
        <div class="stats">
            <div class="stat-item">
                <span class="stat-number">320kbps</span>
                <div class="stat-label">Audio Quality</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">∞</span>
                <div class="stat-label">Downloads</div>
            </div>
            <div class="stat-item">
                <span class="stat-number">24/7</span>
                <div class="stat-label">Available</div>
            </div>
        </div>
        
        <div class='features'>
            <h3>✨ Premium Features</h3>
            <div class="features-grid">
                <div class="feature-item">High-quality 320kbps audio downloads</div>
                <div class="feature-item">Embedded cover art and complete metadata</div>
                <div class="feature-item">Lightning-fast search with multiple results</div>
                <div class="feature-item">One-click downloads with inline buttons</div>
                <div class="feature-item">Multi-language song support</div>
                <div class="feature-item">Artist, album & year information</div>
            </div>
        </div>
        
        <div class="social-links">
            <a href='https://t.me/THE_ULTIMATE_SONGS_DOWNLOAD_BOT' target='_blank' class='btn telegram-btn'>
                <span class="icon">📱</span>
                Open Telegram Bot
            </a>
            
            <a href='https://instagram.com/patelharsh.in' target='_blank' class='btn instagram-btn'>
                <span class="icon">📸</span>
                Follow on Instagram
            </a>
            
            <a href='https://github.com/patelharsh80874' target='_blank' class='btn github-btn'>
                <span class="icon">💻</span>
                View GitHub Profile
            </a>
        </div>
        
        <div class='footer'>
            <p class="made-by">Made with ❤️ by <a href="https://patelharsh.in" target="_blank">patelharsh.in</a></p>
        </div>
    </div>
    
    <script>
        // Add some interactive animations
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effect to feature items
            const featureItems = document.querySelectorAll('.feature-item');
            featureItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(10px) scale(1.02)';
                });
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0) scale(1)';
                });
            });
            
            // Add click ripple effect to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.cssText = \`
                        position: absolute;
                        width: \${size}px;
                        height: \${size}px;
                        left: \${x}px;
                        top: \${y}px;
                        background: rgba(255,255,255,0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    \`;
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
            
            // Add CSS for ripple animation
            const style = document.createElement('style');
            style.textContent = \`
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            \`;
            document.head.appendChild(style);
        });
    </script>
</body>
</html>`;
};


// Updated /start command with social links
const handleStart = async (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `🎵 **Welcome to THE ULTIMATE SONGS DOWNLOADER BOT!**

🎶 Send any song name to search and download high-quality music with cover art and metadata.

🔗 **Connect with me:**
📸 Instagram: https://instagram.com/patelharsh.in
💻 GitHub: https://github.com/patelharsh80874
🌐 Website: https://patelharsh.in

✨ **Features:**
• 320kbps audio quality
• Embedded cover art
• Complete metadata
• Lightning-fast downloads

🚀 Just type any song name to get started!`;
    
    await bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
};

// Handle song search
const handleSearch = async (msg) => {
    const chatId = msg.chat.id;
    const query = msg.text.trim();
    
    try {
        // Show typing action
        await bot.sendChatAction(chatId, 'typing');
        
        const response = await axios.get(
            `https://jiosaavan-api-2-harsh-patel.vercel.app/api/search/songs?query=${encodeURIComponent(query)}`,
            { timeout: 10000 }
        );
        
        if (response.status !== 200) {
            await bot.sendMessage(chatId, "❌ API error. Please try again.");
            return;
        }
        
        const data = response.data;
        const results = data?.data?.results || [];
        
        if (!Array.isArray(results) || results.length === 0) {
            await bot.sendMessage(chatId, "❌ No results found. Try different keywords.");
            return;
        }
        
        const songs = results.slice(0, 5);
        userSearchResults.set(chatId, songs);
        
        await bot.sendMessage(chatId, "🎶 Here are the search results. Click download button below each song:");
        
        // Send song details with download buttons
        for (let idx = 0; idx < songs.length; idx++) {
            const song = songs[idx];
            const name = song.name || "Unknown";
            const artists = song.artists?.primary?.map(a => a.name).join(", ") || "Unknown";
            const album = song.album?.name || "Unknown";
            const year = song.year || "Unknown";
            const duration = formatDuration(parseInt(song.duration || 0));
            const language = song.language || "Unknown";
            
            const images = song.image || [];
            let imageUrl = null;
            
            if (Array.isArray(images) && images.length > 0) {
                const highQualityImg = images.find(img => img.quality === "500x500");
                imageUrl = highQualityImg ? cleanUrl(highQualityImg.url) : cleanUrl(images[images.length - 1]?.url);
            }
            
            const caption = `🎵 ${name}
🎤 Artist: ${artists}
📀 Album: ${album}
🗓️ Year: ${year}
🕒 Duration: ${duration}
🌐 Language: ${language}`;
            
            // Create inline keyboard with download button
            const keyboard = {
                inline_keyboard: [[
                    {
                        text: "⬇️ Download Song",
                        callback_data: `download_${idx}`
                    }
                ]]
            };
            
            try {
                if (imageUrl) {
                    await bot.sendPhoto(chatId, imageUrl, {
                        caption: caption,
                        reply_markup: keyboard
                    });
                } else {
                    await bot.sendMessage(chatId, caption, {
                        reply_markup: keyboard
                    });
                }
            } catch (error) {
                console.error(`Error sending song ${idx + 1}:`, error.message);
                await bot.sendMessage(chatId, caption, {
                    reply_markup: keyboard
                });
            }
        }
        
    } catch (error) {
        console.error('Search error:', error.message);
        await bot.sendMessage(chatId, "❌ Search failed. Please try again later.");
    }
};

// Handle callback queries (button clicks)
const handleCallbackQuery = async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;
    
    try {
        // Acknowledge the callback query
        await bot.answerCallbackQuery(callbackQuery.id);
        
        if (data.startsWith('download_')) {
            const songIndex = parseInt(data.replace('download_', ''));
            const songs = userSearchResults.get(chatId);
            
            if (!songs || songIndex < 0 || songIndex >= songs.length) {
                await bot.sendMessage(chatId, "⚠️ Invalid selection. Please search again.");
                return;
            }
            
            const song = songs[songIndex];
            await downloadSong(chatId, song, messageId);
        }
        
    } catch (error) {
        console.error('Callback query error:', error.message);
        await bot.sendMessage(chatId, "⚠️ An error occurred. Please try again.");
    }
};

// Download song function
const downloadSong = async (chatId, song, messageId) => {
    try {
        const name = song.name || "Unknown";
        const artists = song.artists?.primary?.map(a => a.name).join(", ") || "Unknown";
        const album = song.album?.name || "Unknown";
        const year = song.year || "Unknown";
        const duration = formatDuration(parseInt(song.duration || 0));
        const language = song.language || "Unknown";
        
        const downloadUrls = song.downloadUrl || [];
        const audioUrl = downloadUrls.find(url => url.quality === "320kbps")?.url;
        
        if (!audioUrl) {
            await bot.sendMessage(chatId, "⚠️ 320kbps download not available for this song.");
            return;
        }
        
        const images = song.image || [];
        let imageUrl = null;
        
        if (Array.isArray(images) && images.length > 0) {
            const highQualityImg = images.find(img => img.quality === "500x500");
            imageUrl = highQualityImg ? cleanUrl(highQualityImg.url) : cleanUrl(images[images.length - 1]?.url);
        }
        
        // Update button to show processing
        try {
            await bot.editMessageReplyMarkup({
                inline_keyboard: [[
                    {
                        text: "⏳ Processing...",
                        callback_data: "processing"
                    }
                ]]
            }, {
                chat_id: chatId,
                message_id: messageId
            });
        } catch (editError) {
            // If editing fails, send a new message
            await bot.sendMessage(chatId, "⏳ Processing your song with embedded cover art & metadata...");
        }
        
        // Show uploading action
        await bot.sendChatAction(chatId, 'upload_audio');
        
        const serverEndpoint = `https://the-ultimate-songs-download-server-python.vercel.app/generate-audio?audioUrl=${encodeURIComponent(cleanUrl(audioUrl))}&imageUrl=${encodeURIComponent(imageUrl || '')}&songName=${encodeURIComponent(name)}&artist=${encodeURIComponent(artists)}&album=${encodeURIComponent(album)}&year=${encodeURIComponent(year)}`;
        
        const audioResponse = await axios.get(serverEndpoint, {
            responseType: 'arraybuffer',
            timeout: 60000,
            maxContentLength: 50 * 1024 * 1024 // 50MB limit
        });
        
        if (audioResponse.status !== 200 || audioResponse.data.byteLength < 10000) {
            await bot.sendMessage(chatId, "⚠️ Error generating the song. Try again later.");
            return;
        }
        
        const contentType = audioResponse.headers['content-type'] || '';
        const ext = contentType.includes('mp3') ? 'mp3' : 'm4a';
        const safeFilename = createSafeFilename(name);
        
        const caption = `✅ Downloaded: ${name}
🎤 ${artists}
📀 ${album}
🗓️ ${year}
🕒 ${duration}
🌐 ${language}`;
        
        // Send audio directly from buffer
        await bot.sendAudio(chatId, Buffer.from(audioResponse.data), {
            title: name,
            performer: artists,
            caption: caption
        }, {
            filename: `${safeFilename}.${ext}`,
            contentType: `audio/${ext}`
        });
        
        // Update button to show completed
        try {
            await bot.editMessageReplyMarkup({
                inline_keyboard: [[
                    {
                        text: "✅ Downloaded",
                        callback_data: "completed"
                    }
                ]]
            }, {
                chat_id: chatId,
                message_id: messageId
            });
        } catch (editError) {
            // Button update failed, but download was successful
        }
        
        // Prompt for new search
        await bot.sendMessage(chatId, "🔁 Song downloaded successfully! Send another song name to search:");
        
    } catch (error) {
        console.error('Download error:', error.message);
        await bot.sendMessage(chatId, "⚠️ Download failed. Please try again later.");
        
        // Reset button on error
        try {
            await bot.editMessageReplyMarkup({
                inline_keyboard: [[
                    {
                        text: "❌ Download Failed",
                        callback_data: "failed"
                    }
                ]]
            }, {
                chat_id: chatId,
                message_id: messageId
            });
        } catch (editError) {
            // Button update failed
        }
    }
};

// Main handler function
module.exports = async (req, res) => {
    // Handle GET request for homepage
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(getHomePage());
    }
    
    // Handle POST request for webhook
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const body = req.body;
        
        // Handle regular messages
        if (body.message) {
            const msg = body.message;
            const text = msg.text;
            
            if (text === '/start') {
                await handleStart(msg);
            } else if (text && text !== '/start') {
                await handleSearch(msg);
            }
        }
        
        // Handle callback queries (button clicks)
        if (body.callback_query) {
            await handleCallbackQuery(body.callback_query);
        }
        
        res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// For local development
if (require.main === module) {
    const express = require('express');
    const app = express();
    app.use(express.json());
    
    // Handle GET requests
    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(getHomePage());
    });
    
    // Handle webhook
    app.post('/api/webhook', module.exports);
    
    app.listen(3000, () => console.log('Server running on port 3000'));
}
