# Safar-e-GIKI - Bus Ticket Booking App

A comprehensive bus ticket booking application built for GIKI students to book seats for inter-city travel during semester breaks.

## Features

- 🔍 Search for available buses and routes
- 💺 Interactive seat selection
- 👤 Passenger information management
- 💳 Secure payment processing with Stripe
- 📱 Responsive design for mobile and desktop
- 🎫 Digital ticket generation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Zustand** for state management
- **React Query** for server state management
- **Stripe Elements** for payment processing
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript**
- **Stripe SDK** for payment processing
- **JWT** for authentication
- **Zod** for validation

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Stripe account (for payment testing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/safar-e-giki-app.git
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

# Edit .env with your values (see Environment Variables section)
```

### Environment Variables

#### Frontend (.env in root)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

#### Backend (backend/.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Getting Stripe Test API Keys

1. Create a [Stripe account](https://dashboard.stripe.com/register) (free)
2. Go to [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/test/apikeys)
3. Copy the **Publishable key** (starts with `pk_test_`)
4. Copy the **Secret key** (starts with `sk_test_`)
5. For webhook secret, either:
   - Use Stripe CLI: `stripe listen --forward-to localhost:3001/api/webhooks/stripe`
   - Or create a webhook endpoint in Stripe Dashboard

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Stripe Sandbox Testing

### Test Card Numbers

Use these test cards in sandbox mode (no real charges):

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | ✓ Successful payment |
| `4000 0000 0000 9995` | ✗ Declined payment (insufficient funds) |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure authentication |

**For all test cards:**
- Use any future expiration date (e.g., 12/34)
- Use any 3-digit CVC (e.g., 123)
- Use any 5-digit ZIP code (e.g., 12345)

### Testing Webhooks Locally

Install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

This will give you a webhook secret to add to your `.env` file.

## Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm start            # Start production server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Buses & Routes
- `GET /api/buses` - List all buses
- `GET /api/buses/:id` - Get bus details
- `GET /api/routes` - Search routes (query: from, to, date)
- `GET /api/routes/:id/seats` - Get available seats

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get user's bookings (authenticated)
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel a booking

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe PaymentIntent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/:bookingId` - Get payment status
- `POST /api/webhooks/stripe` - Stripe webhook handler

## Payment Flow

1. User completes booking form and selects seats
2. Frontend calls `/api/payments/create-payment-intent` with booking details
3. Backend creates a Stripe PaymentIntent and returns `clientSecret`
4. Frontend uses Stripe Elements to collect card details
5. User confirms payment via Stripe's secure form
6. On success, frontend calls `/api/payments/confirm` to update booking status
7. Stripe webhook receives `payment_intent.succeeded` event as backup confirmation

## Project Structure

```
safar-e-giki-app/
├── src/                    # Frontend source code
│   ├── api/               # API client and service modules
│   ├── components/        # React components
│   │   ├── payment/       # Stripe payment components
│   │   └── ui/            # UI components
│   ├── stores/            # Zustand stores
│   └── test/              # Test setup and utilities
├── backend/               # Backend source code
│   └── src/
│       ├── routes/        # API route handlers
│       ├── middleware/    # Express middleware
│       ├── services/      # Business logic (Stripe, etc.)
│       └── utils/         # Utility functions
├── .env.example           # Environment variables template
└── README.md
```

## Security Notes

- **Never commit real API keys** - Always use test/sandbox keys for development
- Card data is **never** handled by our servers - Stripe Elements handles all sensitive data
- JWT tokens expire after 7 days
- All API endpoints validate input using Zod schemas

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes as part of the GIKI student community.
