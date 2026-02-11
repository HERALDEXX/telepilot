# Telepilot

A Telegram bot built with Node.js, Telegraf, and Supabase, plus a tiny Express health endpoint.

---

## Overview

Telepilot is a modular automation bot for Telegram. The codebase keeps bot logic, services, and configuration separated so new commands and integrations are easy to add.

---

## Current Features

- Telegram bot commands with Telegraf
- User persistence to Supabase on `/start`
- Admin-only broadcast messaging
- Random quote command backed by an external API
- Express HTTP endpoint for basic uptime checks

---

## Commands

User commands:

- `/start` - register user and welcome
- `/help` - list commands
- `/status` - bot availability
- `/about` - bot info
- `/quote` - fetch a random quote

Admin commands:

- `/broadcast <message>` - send a broadcast
- `/stats` - user count

---

## Tech Stack

- Node.js
- Telegraf
- Supabase JS
- Express
- dotenv

---

## Project Structure

```text
telepilot/
├── bot/
│   └── index.js
├── api/                # currently empty
├── services/
│   └── quoteService.js
├── config/
│   ├── env.js
│   └── supabase.js
├── .env
├── nodemon.json
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
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_ID=your_telegram_user_id
PORT=3000
```

### 4. Prepare Supabase

The bot writes to a `users` table on `/start` with columns:

- `id` (number)
- `username` (text, nullable)
- `first_name` (text, nullable)

---

## Run

Development (auto-reload):

```bash
npm run dev
```

One-off run:

```bash
npm start
```

The Express health endpoint responds on `GET /` with `Telepilot running`.

---

## Contributing

Contributions, ideas, and improvements are welcome.

---

## License

[**MIT**](LICENSE)
