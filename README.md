# Fastify Telegram Bot with LLM Capabilities

A powerful Telegram bot built with Fastify that leverages Large Language Models (LLM) to provide intelligent responses and tool-enabled capabilities. This bot uses Google's Gemini model for natural language processing and includes database integration for persistent storage.

## Features

- 🤖 Telegram Bot Integration
- 🧠 LLM-powered responses using Google Gemini
- 🛠️ Tool-enabled capabilities
- 📊 Database integration with Prisma
- 🔄 Real-time message processing
- ⚡ Fast and efficient Fastify backend

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- A PostgreSQL database (or compatible database)
- Telegram Bot Token
- Google Gemini API Key

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd fastify-telegram-bot
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

## Getting Started

### Setting up a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and use the `/newbot` command
3. Follow the instructions to create your bot
4. Copy the API token provided by BotFather
5. Add the token to your `.env` file as `TELEGRAM_BOT_TOKEN`

### Getting a Gemini API Key

1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file as `GEMINI_API_KEY`

### Database Setup

If you don't have a database ready, you can use one of these options:

1. **Neon (Recommended for development)**

   - Visit [Neon](https://neon.tech)
   - Create a free account
   - Create a new project
   - Copy the connection string to your `DATABASE_URL`

2. **Supabase**
   - Visit [Supabase](https://supabase.com)
   - Create a free account
   - Create a new project
   - Get the PostgreSQL connection string from the project settings

### Running the Application

1. Generate Prisma client:

```bash
pnpm db:generate
```

2. Push the database schema:

```bash
pnpm db:push
```

3. Start the development server:

```bash
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm start` - Start the production server
- `pnpm db:studio` - Open Prisma Studio for database management
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate Prisma client
- `pnpm format` - Format code using Prettier
- `pnpm lint` - Run ESLint

## Project Structure

```
├── src/              # Source code
├── prisma/           # Database schema and migrations
├── .env.example      # Example environment variables
└── package.json      # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
