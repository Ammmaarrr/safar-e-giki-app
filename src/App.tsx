import { useState, useEffect } from 'react';
import { SearchForm } from './components/SearchForm';
import { BusListing, Bus } from './components/BusListing';
import { SeatSelection } from './components/SeatSelection';
import { PassengerDetails } from './components/PassengerDetails';
import { PaymentProcessing } from './components/PaymentProcessing';
import { BookingConfirmation } from './components/BookingConfirmation';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { LogoGenerator } from './components/LogoGenerator';

export type BookingData = {
  from: string;
  to: string;
  date: string;
  selectedBus?: Bus;
  selectedSeats?: number[];
  passengerInfo?: {
    name: string;
    phone: string;
    email: string;
    cnic: string;
    emergencyContact: string;
    studentId?: string;
  };
};

export default function App() {
  const [step, setStep] = useState<'search' | 'listing' | 'seats' | 'details' | 'payment' | 'confirmation' | 'logo'>('search');
  const [bookingData, setBookingData] = useState<BookingData>({
    from: 'GIKI',
    to: 'Multan',
    date: '',
  });

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const handleSearch = (from: string, to: string, date: string) => {
    setBookingData({ ...bookingData, from, to, date });
    setStep('listing');
  };

  const handleBusSelect = (bus: Bus) => {
    setBookingData({ ...bookingData, selectedBus: bus });
    setStep('seats');
  };

  const handleSeatSelect = (seats: number[]) => {
    setBookingData({ ...bookingData, selectedSeats: seats });
    setStep('details');
  };

  const handlePassengerDetails = (info: any) => {
    setBookingData({ ...bookingData, passengerInfo: info });
    setStep('payment');
  };

  const handlePayment = () => {
    setStep('confirmation');
  };

  const handleBackToSearch = () => {
    setBookingData({ from: 'GIKI', to: 'Multan', date: '' });
    setStep('search');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {step === 'logo' && (
        <LogoGenerator />
      )}
      {step === 'search' && (
        <SearchForm onSearch={handleSearch} initialData={bookingData} />
      )}
      {step === 'listing' && (
        <BusListing 
          bookingData={bookingData} 
          onSelectBus={handleBusSelect}
          onBack={() => setStep('search')}
        />
      )}
      {step === 'seats' && (
        <SeatSelection 
          bookingData={bookingData}
          onSeatsSelected={handleSeatSelect}
          onBack={() => setStep('listing')}
        />
      )}
      {step === 'details' && (
        <PassengerDetails 
          bookingData={bookingData}
          onSubmit={handlePassengerDetails}
          onBack={() => setStep('seats')}
        />
      )}
      {step === 'payment' && (
        <PaymentProcessing 
          bookingData={bookingData}
          onPaymentComplete={handlePayment}
          onBack={() => setStep('details')}
        />
      )}
      {step === 'confirmation' && (
        <BookingConfirmation 
          bookingData={bookingData}
          onNewBooking={handleBackToSearch}
        />
      )}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
}