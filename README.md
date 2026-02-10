# Telepilot

A modular Telegram bot built with Node.js and Telegraf.

---

## Overview

**Telepilot** is designed to be a scalable automation and AI‑powered Telegram assistant.  
The architecture separates bot logic, services, and configuration for easy expansion as the project grows.

---

## Current Features

- Basic Telegram bot initialization
- Environment-based configuration
- Modular folder structure

---

## Tech Stack

- Node.js
- Telegraf
- dotenv
- (Planned) Express API layer

---

## Project Structure

```text
telepilot/
├── bot/
│   └── index.js
├── api/
├── services/
├── config/
│   └── env.js
├── .env
├── package.json
```

---

## Getting Started

### 1. Clone repository

```bash
git clone <repo-url>
cd telepilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root containing:

```env
BOT_TOKEN=your_telegram_bot_token
```

### 4. Run the bot

```bash
npm run dev
```

Use `npm run dev` to auto-restart on file changes during development. For a one-off run without watching, use:

```bash
npm start
```

---

## Development Goal

Build a production‑ready Telegram automation and AI assistant platform with extensible modules and service integrations.

---

## Contributing

Contributions, ideas, and improvements are welcome.

---

## License

[**MIT**](LICENSE)
