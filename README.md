# Safar-e-GIKI - Bus Ticket Booking App

A comprehensive bus ticket booking application built for GIKI students to book seats for inter-city travel during semester breaks.

## Features

- 🔍 Search for available buses and routes
- 💺 Interactive seat selection
- 👤 Passenger information management
- 💳 Secure payment processing with Safepay (Pakistan's payment gateway)
- 📱 Responsive design for mobile and desktop
- 🎫 Digital ticket generation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Zustand** for state management
- **React Query** for server state management
- **Safepay** for payment processing
- **Tailwind CSS** for styling
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript**
- **Safepay SDK** for payment processing
- **JWT** for authentication
- **Zod** for validation

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Safepay account (for payment testing)

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
VITE_APP_URL=http://localhost:5173
```

#### Backend (backend/.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key
SAFEPAY_API_KEY=sec_xxxxx
SAFEPAY_API_SECRET=xxxxx
SAFEPAY_WEBHOOK_SECRET=xxxxx
SAFEPAY_SANDBOX=true
SAFEPAY_SUCCESS_URL=http://localhost:5173/payment/callback
SAFEPAY_CANCEL_URL=http://localhost:5173/payment/cancelled
```

## Payment Integration (Safepay)

This app uses [Safepay](https://getsafepay.com) for payment processing in Pakistan.

### Supported Payment Methods
- 💳 Visa, MasterCard, PayPak debit/credit cards
- 📱 JazzCash mobile wallet
- 📱 EasyPaisa mobile wallet
- 🏦 Bank transfers via Raast

### Setting Up Safepay

1. Create a Safepay account at [getsafepay.com](https://getsafepay.com)
2. Get your sandbox API keys from the dashboard
3. Add keys to your `.env` file:
   ```
   SAFEPAY_API_KEY=your-api-key
   SAFEPAY_API_SECRET=your-api-secret
   SAFEPAY_SANDBOX=true
   ```

### Testing Payments (Sandbox Mode)

Use these test credentials in sandbox mode:
- **Test Card:** 4242 4242 4242 4242
- **Expiry:** Any future date
- **CVV:** Any 3 digits
- **OTP:** 123456

### Going Live

1. Complete Safepay merchant onboarding
2. Get production API keys
3. Update `.env`:
   ```
   SAFEPAY_SANDBOX=false
   SAFEPAY_API_KEY=your-production-key
   SAFEPAY_API_SECRET=your-production-secret
   ```
4. Update callback URLs to your production domain

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

3. Open [http://localhost:5173](http://localhost:5173) in your browser

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
- `POST /api/payments/create-checkout` - Create Safepay checkout session
- `POST /api/payments/verify` - Verify payment after checkout
- `GET /api/payments/:bookingId` - Get payment status
- `POST /api/webhooks/safepay` - Safepay webhook handler

## Payment Flow

```
1. User clicks "Pay Now"
2. Frontend calls POST /api/payments/create-checkout
3. Backend creates Safepay checkout session
4. Backend returns checkout URL
5. Frontend redirects user to Safepay checkout page
6. User pays via Card/JazzCash/EasyPaisa
7. Safepay redirects back to your app
8. Frontend calls POST /api/payments/verify
9. Backend verifies payment and updates booking
```

## Project Structure

```
safar-e-giki-app/
├── src/                    # Frontend source code
│   ├── api/               # API client and service modules
│   ├── components/        # React components
│   │   ├── payment/       # Safepay payment components
│   │   └── ui/            # UI components
│   ├── stores/            # Zustand stores
│   └── test/              # Test setup and utilities
├── backend/               # Backend source code
│   └── src/
│       ├── routes/        # API route handlers
│       ├── middleware/    # Express middleware
│       ├── services/      # Business logic (Safepay, etc.)
│       └── utils/         # Utility functions
├── .env.example           # Environment variables template
└── README.md
```

## Security Notes

- **Never commit real API keys** - Always use test/sandbox keys for development
- Card data is **never** handled by our servers - Safepay handles all sensitive data
- JWT tokens expire after 7 days
- All API endpoints validate input using Zod schemas
- Webhook signatures are verified to ensure authenticity

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes as part of the GIKI student community.
