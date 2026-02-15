const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram config from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;
    
    console.log('Received form submission:', formData);
    
    // Send to Telegram if configured
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        const message = `🌹 *新客戶表單提交*\n\n` +
            `*姓名：* ${formData.name || '-'}\n` +
            `*Leader暱稱：* ${formData.leaderName || '-'}\n` +
            `*團隊用途：* ${formData.purpose || '-'}\n` +
            `*服務等級：* ${formData.serviceLevel || '-'}\n` +
            `*成員數量：* ${formData.memberCount || '-'}\n` +
            `*Leader模板：* ${formData.leaderTemplate || '-'}\n` +
            `*年齡偏好：* ${formData.agePreference || '-'}\n` +
            `*功能需求：* ${formData.features || '-'}\n` +
            `*Email：* ${formData.email || '-'}\n` +
            `*LINE ID：* ${formData.lineId || '-'}\n` +
            `*備註：* ${formData.notes || '-'}`;
        
        sendTelegramMessage(message);
    }
    
    // Send success response
    res.send('<script>alert("感謝提交！我們會盡快與您聯繫"); window.location.href="/";</script>');
});

// Function to send Telegram message
function sendTelegramMessage(text) {
    const encodedText = encodeURIComponent(text);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedText}&parse_mode=Markdown`;
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log('Telegram message sent:', res.statusCode);
        });
    }).on('error', (err) => {
        console.error('Telegram error:', err);
    });
}

// Listen on all network interfaces (0.0.0.0) - Required for Zeabur
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
