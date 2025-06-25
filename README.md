# Ottaga Mental Health Support Application

A compassionate platform providing AI-powered mental health support through secure chat interactions and therapeutic resources. Built with SvelteKit and featuring comprehensive safety measures, user authentication, and a modern responsive interface.

## Features

### Core Functionality
- **AI-Powered Mental Health Support**: Secure chat interface with specialized mental health AI assistance
- **Safety-First Design**: Built-in safeguards to detect and prevent malicious prompts or harmful interactions
- **User Authentication**: Secure session management with cookie-based authentication
- **Protected Dashboard**: Authenticated user area with personalized chat sessions
- **Marketing Pages**: Public-facing pages including legal documentation and educational content

### Technical Features
- **Streaming Chat Responses**: Real-time AI responses using Server-Sent Events (SSE)
- **PostgreSQL Database**: Robust data persistence with Kysely query builder
- **Comprehensive Testing**: Unit tests with Vitest and end-to-end tests with Playwright
- **Analytics Integration**: PostHog integration for user behavior tracking and error monitoring
- **Responsive Design**: Mobile-first approach with modern UI components

## Architecture

### Project Structure
```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── chat/           # Chat interface components
│   │   ├── marketing/      # Marketing page components
│   │   └── DashboardNav.svelte
│   ├── db/                 # Database operations
│   │   ├── chat/           # Chat-related database operations
│   │   ├── user/           # User management database operations
│   │   └── cookie.ts       # Session management
│   ├── llm/                # AI/LLM integration
│   │   ├── ottagaHealth/   # Main health AI service
│   │   ├── ottagaSafeGuard/ # Safety and moderation system
│   │   └── providers/      # LLM provider abstractions (OpenAICompatible)
│   ├── utility/            # Helper utilities
│   └── icons/              # SVG icon components
├── routes/
│   ├── (marketing)/        # Public pages (home, login, legal)
│   └── (protected)/        # Authenticated pages (dashboard, API)
└── tests/
    ├── e2e/               # End-to-end tests
    └── integration/       # Integration tests
```

## Development Setup

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Ottaga
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Database
POSTGRES_URL="postgresql://username:password@localhost:5432/ottaga"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"


4. **Run the development server**
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run all tests (unit + e2e)
- `npm run test:unit` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run check` - Type checking with svelte-check

## Testing

Run tests with:
```bash
# All tests
npm run test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e
```
## Technology Stack

### Frontend
- **SvelteKit**: Full-stack framework with SSR/SPA capabilities
- **Svelte 5**: Modern reactive UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

### Backend
- **SvelteKit API Routes**: Server-side API endpoints
- **PostgreSQL**: Relational database
- **Kysely**: Type-safe SQL query builder
- **Argon2**: Password hashing

### Testing & Analytics
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **PostHog**: User analytics and error tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Follow the existing code style and patterns

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Support

For support, please open an issue on the GitHub repository or contact the development team.
