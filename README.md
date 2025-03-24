# SvelteKit Authentication Template

A template project demonstrating cookie-based authentication in SvelteKit using SQLite for session management.

## Features

- 🔐 Secure cookie-based authentication
- 📝 User registration and login
- 🔒 Protected routes
- 🗄️ SQLite database for user and session management
- 🔑 Password hashing with Argon2
- 🎨 Styled login/signup forms
- 📱 Responsive design

## Project Structure

```
sveltekitAuthTemplate/
├── src/
│   ├── routes/
│   │   ├── (marketing)/      # Public routes
│   │   │   ├── login/        # Login/signup pages
│   │   │   └── +page.svelte  # Landing page
│   │   └── (protected)/      # Auth-required routes
│   │       └── home/         # User dashboard
│   ├── lib/
│   │   ├── db/              # Database services
│   │   └── types.ts         # TypeScript definitions
│   ├── components/          # Reusable components
│   └── hooks.server.ts      # Auth middleware
└── static/                  # Static assets
```

## Authentication Flow

1. **Login Process**:
   - User submits credentials
   - Server validates against database
   - On success, creates session cookie
   - Redirects to protected home page

2. **Session Management**:
   - Cookies store session IDs
   - Server validates sessions on each request
   - Auto-refreshes valid sessions
   - Redirects expired sessions to login

3. **Security Features**:
   - Argon2 password hashing
   - Secure random session IDs
   - Case-insensitive email handling
   - Protected route middleware

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173`

## Default Login Credentials

For testing purposes:
- Email: 1234@gmail.com
- Password: 1234

## Database Schema

The project uses SQLite with the following tables:

### Users Table
- id (PRIMARY KEY)
- firstName
- lastName
- email (UNIQUE)
- hashedPassword

### Cookie Table
- id (PRIMARY KEY)
- userID (FOREIGN KEY)
- expireTime

## Key Components

### Authentication Middleware (hooks.server.ts)
- Intercepts requests to protected routes
- Validates session cookies
- Manages cookie refresh/expiration

### Login Component (Login.svelte)
- Dual-purpose login/signup form
- Form validation
- Error handling
- Responsive design

### Database Service (database.ts)
- User management
- Session handling
- SQLite connection pooling

## Development

### Protected Routes
Protected routes are placed in the `(protected)` directory and require authentication. The server-side hook automatically checks for valid sessions.

### Adding New Protected Routes
1. Create route in `(protected)` directory
2. Access user data via `event.locals.user`

### Customizing Session Duration
Modify cookie expiration in `database.ts`:
```typescript
// Default: 1 hour
expireTime: Date.now() + 60 * 60 * 1000
```

## License

MIT
