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
SMITHERY_API_KEY=your_smithery_api_key
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

### Getting a Smithery API Key

1. Visit the [Smithery AI website](https://smithery.ai)
2. Create an account or log in
3. Navigate to your API keys
4. Generate a new API key
5. Add the key to your `.env` file as `SMITHERY_API_KEY`

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
- `pnpm format` - Format code using Prettier and scripts
```

## Customizing the Bot

### Adding MCP Services

The bot supports MCP (Model Context Protocol) services that extend its capabilities. These services provide additional tools to the AI agent, such as weather forecasting, web search, and more.

To add new MCP services:

1. Edit the `src/constants/mcp.json` file:

```json
{
  "mcpServers": {
    "your-new-service-name": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@namespace/service-name",
        "--key",
        "${SMITHERY_API_KEY}"
      ]
    }
  }
}
```

2. If your service requires an API key, add it to your `.env` file and reference it in the args array using `${ENV_VAR_NAME}` syntax.

3. The service will be automatically available to the agent on next startup.

#### Available MCP Services

Here are some popular MCP services you can add:

- `@turkyden/weather`: Provides weather forecast capabilities
- `@smithery-ai/server-sequential-thinking`: Enables step-by-step reasoning
- `@nickclyde/duckduckgo-mcp-server`: Adds web search capabilities

Visit [Smithery AI](https://smithery.ai) to discover more MCP services.

### Configuring the System Prompt

The bot's personality and capabilities are defined by its system prompt. To customize this:

1. Edit the `src/constants/agent-prompts.json` file:

```json
{
  "telegram": {
    "system_prompt": [
      "You are a helpful telegram assistant.",
      "Limit your message responses to 4000 characters.",
      "Format your replies in plain text.",
      "Add your custom instructions here."
    ],
    "description": "System prompt for the Telegram bot agent"
  }
}
```

2. Each line in the `system_prompt` array will be joined with newlines to form the complete prompt.

3. The changes will take effect the next time the bot starts.

#### System Prompt Best Practices

When customizing the system prompt, consider these best practices:

- **Be specific** about the bot's personality and tone
- **Define limitations** clearly (e.g., message length, content restrictions)
- **Specify formatting preferences** for different types of responses
- **Prioritize tools** if you want certain capabilities to be used more frequently
- **Keep instructions concise** as very long prompts can reduce effectiveness

Example system prompts for different use cases:

```json
// Weather Assistant
{
  "telegram": {
    "system_prompt": [
      "You are a friendly weather assistant specialized in providing accurate weather forecasts.",
      "Always use the weather tool when users ask about weather conditions.",
      "Limit your message responses to 4000 characters.",
      "Format temperature in both Celsius and Fahrenheit.",
      "For weather forecasts, always include: temperature, conditions, and precipitation probability."
    ]
  }
}

// Research Assistant
{
  "telegram": {
    "system_prompt": [
      "You are a research assistant that helps users find information online.",
      "Always use the web search tool for factual queries and current events.",
      "Limit your message responses to 4000 characters.",
      "When providing information, cite your sources.",
      "Format complex information in easy-to-read bullet points."
    ]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

#### System Prompt Best Practices

When customizing the system prompt, consider these best practices:

- **Be specific** about the bot's personality and tone
- **Define limitations** clearly (e.g., message length, content restrictions)
- **Specify formatting preferences** for different types of responses
- **Prioritize tools** if you want certain capabilities to be used more frequently
- **Keep instructions concise** as very long prompts can reduce effectiveness
