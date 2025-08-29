const express = require('express');
const config = require('./config');
const logger = require('./services/logger');
const webhookRoutes = require('./routes/webhook');

const app = express();

// Enable trust proxy for Replit
app.set('trust proxy', true);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Routes
app.use('/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Basit şifreli giriş sayfası
app.get('/', (req, res) => {
    const { password } = req.query;
    
    const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD || 'alarm123';
    if (password !==82131156Yh.) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>TradingView Alarm System</title>
                <meta charset="utf-8">
                <style>
                    body { font-family: Arial; text-align: center; margin-top: 100px; }
                    input { padding: 10px; font-size: 16px; margin: 10px; }
                    button { padding: 10px 20px; font-size: 16px; background: #007bff; color: white; border: none; cursor: pointer; }
                </style>
            </head>
            <body>
                <h2>🚨 TradingView Alarm System</h2>
                <p>Webhook URL'sini görmek için şifre girin:</p>
                <form>
                    <input type="password" name="password" placeholder="Şifre girin">
                    <br>
                    <button type="submit">Giriş</button>
                </form>
            </body>
            </html>
        `);
    }
    
    // Şifre doğruysa sistem bilgileri göster
    const currentUrl = req.protocol + '://' + req.get('host');
    // Manuel olarak doğru URL'yi set edin
    const webhookUrl = 'https://wtel.onrender.com/webhook/tradingview';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TradingView Alarm System</title>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial; margin: 40px; }
                .container { max-width: 800px; margin: 0 auto; }
                .url-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .url { font-family: monospace; font-size: 16px; word-break: break-all; color: #007bff; }
                .copy-btn { padding: 8px 16px; background: #28a745; color: white; border: none; cursor: pointer; border-radius: 4px; }
                .status { color: #28a745; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚨 TradingView Alarm System</h1>
                
                <div class="status">✅ Sistem Aktif - Çalışma Süresi: ${Math.round(process.uptime())} saniye</div>
                
                <h3>📡 Webhook URL'niz:</h3>
                <div class="url-box">
                    <div class="url" id="webhookUrl">${webhookUrl}</div>
                    <button class="copy-btn" onclick="copyUrl()">📋 Kopyala</button>
                </div>
                
                <h3>📋 TradingView Ayarları:</h3>
                <p><strong>1.</strong> TradingView'de alarm oluştururken <strong>Webhook</strong> seçin</p>
                <p><strong>2.</strong> Yukarıdaki URL'yi kopyalayıp yapıştırın</p>
                <p><strong>3.</strong> Message kısmına şu JSON'u yazın:</p>
                
                <div class="url-box">
                   <h3>📋 TradingView Mesaj Şablonları:</h3>

<h4>🔥 Basit Alım/Satım:</h4>
<div class="url-box">
<pre>{
  "symbol": "{{ticker}}",
  "price": "{{close}}",
  "action": "{{strategy.order.action}}",
  "message": "{{strategy.order.comment}}"
}</pre>
</div>

<h4>📊 Detaylı Analiz:</h4>
<div class="url-box">
<pre>{
  "symbol": "{{ticker}}",
  "price": "{{close}}",
  "volume": "{{volume}}",
  "timeframe": "{{interval}}",
  "exchange": "{{exchange}}",
  "rsi": "{{plot_0}}",
  "message": "{{strategy.order.comment}}"
}</pre>
</div>

<h4>🎯 Strateji Sinyali:</h4>
<div class="url-box">
<pre>{
  "coin": "{{ticker}}",
  "fiyat": "{{close}}",
  "sinyal": "{{strategy.order.action}}",
  "zaman": "{{time}}",
  "mesaj": "{{strategy.order.comment}}",
  "lot": "{{strategy.order.contracts}}"
}</pre>
</div>
                </div>
                
                <h3>📱 Entegrasyonlar:</h3>
                <p>✅ Telegram: Aktif</p>
                <p>✅ WhatsApp: Aktif (Twilio)</p>
                
                <h3>🔧 WhatsApp Ayarları:</h3>
                <p><strong>Twilio Console</strong> > <strong>WhatsApp Sandbox</strong>'a gidin:</p>
                <ol>
                    <li><strong>Twilio Console</strong> > <strong>Messaging</strong> > <strong>Try it out</strong> > <strong>Send a WhatsApp message</strong></li>
                    <li><strong>From Number:</strong> +14155238886 (Twilio sandbox numarası)</li>
                    <li><strong>To Number:</strong> +90555xxxxxxx (sizin WhatsApp numara)</li>
                    <li><strong>WhatsApp'tan +14155238886'ya</strong> "join [kod]" mesajı gönderin</li>
                    <li><strong>Onay aldıktan sonra</strong> sistem çalışacak</li>
                </ol>
                <p><small>⚠️ Not: Twilio Sandbox 24 saat sonra expire olur, tekrar join mesajı gerekir.</small></p>
                
                <p><a href="/?">🔄 Yenile</a> | <a href="/health">❤️ Sistem Durumu</a></p>
            </div>
            
            <script>
                function copyUrl() {
                    const url = document.getElementById('webhookUrl').textContent;
                    navigator.clipboard.writeText(url).then(function() {
                        alert('URL kopyalandı! ✅');
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Error handling middleware
app.use((error, req, res, next) => {
    logger.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path,
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
    console.log(`Server started on ${HOST}:${PORT}`);
});

module.exports = app;
