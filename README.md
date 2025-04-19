# Ottaga Mental Health Support Application

A compassionate platform providing AI-powered mental health support through secure chat interactions and therapeutic resources.

## Features

- Secure chat interface with AI mental health support
- User authentication and session management
- Privacy-focused design with legal compliance (GDPR, etc.)
- Responsive web interface built with Svelte

## Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm
- SQLite (for local database)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables (create a `.env` file):
```env
DATABASE_URL="file:./mydb.sqlite"
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

### Project Structure
Key directories:
- `src/lib/components/` - UI components
- `src/lib/llm/` - AI chat functionality
- `src/routes/` - Application pages and routing
- `src/lib/db/` - Database operations

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
