
# Safar-e-GIKI - Bus Ticket Booking App

A comprehensive bus ticket booking application designed specifically for GIKI (Ghulam Ishaq Khan Institute) students traveling during semester breaks.

## Features

- 🎓 Exclusive service for GIKI students
- 🔍 Search available buses by route and date
- 💺 Interactive seat selection
- 📝 Passenger details management
- 💳 Multiple payment options (JazzCash, Easypaisa, Bank Transfer)
- 📱 PWA support for mobile installation
- 🔐 Secure authentication with JWT

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Zod** - Schema validation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Zod** - Request validation
- **bcryptjs** - Password hashing

### Testing
- **Vitest** - Test runner
- **Testing Library** - Component testing
- **MSW** - API mocking

## Project Structure

```
safar-e-giki-app/
├── src/                    # Frontend source
│   ├── api/               # API client and service modules
│   ├── components/        # React components
│   ├── stores/            # Zustand state stores
│   ├── test/              # Test setup and utilities
│   └── styles/            # CSS styles
├── backend/               # Backend source
│   └── src/
│       ├── routes/        # API route handlers
│       ├── controllers/   # Business logic
│       ├── models/        # Data types
│       ├── middleware/    # Express middleware
│       └── utils/         # Utility functions
├── package.json           # Frontend dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/safar-e-giki-app.git
cd safar-e-giki-app
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit the .env file with your configuration
```

### Running the Application

#### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:3001`

#### Production Build

Frontend:
```bash
npm run build
```

Backend:
```bash
cd backend
npm run build
npm start
```

## Available Scripts

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Start production server |

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user (requires auth) |

### Buses & Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/buses` | GET | List all available buses |
| `/api/buses/:id` | GET | Get bus details |
| `/api/routes` | GET | Search routes by from, to, date |
| `/api/routes/:id/seats` | GET | Get available seats for a route |

### Bookings

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bookings` | POST | Create a new booking (requires auth) |
| `/api/bookings` | GET | Get user's bookings (requires auth) |
| `/api/bookings/:id` | GET | Get booking details (requires auth) |
| `/api/bookings/:id/cancel` | PUT | Cancel a booking (requires auth) |

### Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments/initiate` | POST | Initiate payment (requires auth) |
| `/api/payments/confirm` | POST | Confirm payment (requires auth) |

## Environment Variables

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3001/api` |

### Backend (backend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | - |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Testing

Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and intended for use by GIKI students.