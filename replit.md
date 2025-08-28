# TradingView Alarm Relay Server

## Overview

This is a Node.js-based webhook relay server that receives TradingView alerts and forwards them to messaging platforms (Telegram and WhatsApp). The system provides a web dashboard for monitoring alarm activity, managing configurations, and viewing statistics. It's designed to bridge TradingView's webhook notifications with popular messaging services for real-time trading alerts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Express.js server with RESTful API endpoints
- **Configuration Management**: JSON-based configuration system with environment variable overrides and file-based persistence
- **Service-Oriented Design**: Modular services for messaging (Telegram, WhatsApp), storage, and logging
- **Webhook Processing**: Dedicated webhook endpoint for TradingView integration with retry mechanisms and error handling

### Data Storage
- **File-Based Storage**: JSON files for alarm history and configuration persistence
- **In-Memory Processing**: Real-time alarm processing with configurable storage limits
- **Data Structure**: Simple alarm objects with timestamps, status tracking, and delivery confirmations

### Frontend Architecture
- **Static Web Interface**: Bootstrap-based dashboard served from public directory
- **Real-Time Updates**: JavaScript-driven dashboard with auto-refresh capabilities
- **Responsive Design**: Mobile-friendly interface for monitoring on various devices

### Messaging Integration
- **Telegram Service**: Bot API integration for sending formatted messages
- **WhatsApp Service**: Twilio API integration for WhatsApp Business messaging
- **Retry Logic**: Exponential backoff retry mechanism for failed message deliveries
- **Service Status Monitoring**: Health checks and configuration validation for messaging services

### Error Handling & Logging
- **Structured Logging**: File-based logging with configurable levels and rotation
- **Retry Mechanisms**: Configurable retry attempts with exponential backoff for webhook processing
- **Health Monitoring**: System health endpoints and service status tracking

## External Dependencies

### Messaging Platforms
- **Telegram Bot API**: Requires bot token and chat ID for message delivery
- **Twilio WhatsApp API**: Requires account SID, auth token, and phone numbers for WhatsApp messaging

### Core Libraries
- **Express.js**: Web server framework for API and static file serving
- **Axios**: HTTP client for external API communications with messaging services
- **Node.js Built-ins**: File system operations, path handling, and core server functionality

### Frontend Dependencies
- **Bootstrap 5.3.0**: UI framework for responsive dashboard design
- **Font Awesome 6.4.0**: Icon library for dashboard interface elements

### Development Tools
- **Package Management**: npm for dependency management and project scripts
- **Configuration**: Environment variable support with JSON file fallbacks