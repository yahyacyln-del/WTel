const fs = require('fs');
const path = require('path');

// Default configuration
const defaultConfig = {
    server: {
        port: process.env.PORT || 10000,
        host: '0.0.0.0'
    },
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
        enabled: true
    },
    whatsapp: {
        accountSid: process.env.TWILIO_ACCOUNT_SID || '',
        authToken: process.env.TWILIO_AUTH_TOKEN || '',
        fromNumber: process.env.TWILIO_FROM_NUMBER || '',
        toNumber: process.env.TWILIO_TO_NUMBER || '',
        enabled: true
    },
    retry: {
        maxAttempts: 3,
        delayMs: 1000,
        exponentialBackoff: true
    },
    storage: {
        maxAlarms: 1000,
        dataPath: './data'
    },
    logging: {
        level: 'info',
        maxFileSize: '10MB',
        maxFiles: 5
    }
};

class Config {
    constructor() {
        this.config = { ...defaultConfig };
        this.loadFromFile();
        this.validateConfig();
    }

    loadFromFile() {
        try {
            const configPath = path.join(__dirname, 'data', 'config.json');
            if (fs.existsSync(configPath)) {
                const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                this.config = this.mergeDeep(this.config, fileConfig);
            }
        } catch (error) {
            console.warn('Warning: Could not load config file, using defaults:', error.message);
        }
    }

    validateConfig() {
        const errors = [];

        // Validate Telegram config
        if (this.config.telegram.enabled) {
            if (!this.config.telegram.botToken) {
                errors.push('Telegram bot token is required when Telegram is enabled');
            }
            if (!this.config.telegram.chatId) {
                errors.push('Telegram chat ID is required when Telegram is enabled');
            }
        }

        // Validate WhatsApp/Twilio config
        if (this.config.whatsapp.enabled) {
            if (!this.config.whatsapp.accountSid) {
                errors.push('Twilio Account SID is required when WhatsApp is enabled');
            }
            if (!this.config.whatsapp.authToken) {
                errors.push('Twilio Auth Token is required when WhatsApp is enabled');
            }
            if (!this.config.whatsapp.fromNumber) {
                errors.push('Twilio From Number is required when WhatsApp is enabled');
            }
            if (!this.config.whatsapp.toNumber) {
                errors.push('Twilio To Number is required when WhatsApp is enabled');
            }
        }

        if (errors.length > 0) {
            console.warn('Configuration warnings:');
            errors.forEach(error => console.warn(`- ${error}`));
        }
    }

    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    get(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.config);
    }

    set(key, value) {
        const keys = key.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, k) => {
            if (!obj[k]) obj[k] = {};
            return obj[k];
        }, this.config);
        target[lastKey] = value;
    }

    save() {
        try {
            const configPath = path.join(__dirname, 'data', 'config.json');
            const dataDir = path.dirname(configPath);
            
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            
            fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            return true;
        } catch (error) {
            console.error('Failed to save config:', error.message);
            return false;
        }
    }
}

const configInstance = new Config();

// Export both the config object and the class
module.exports = configInstance.config;
module.exports.Config = Config;
module.exports.instance = configInstance;
