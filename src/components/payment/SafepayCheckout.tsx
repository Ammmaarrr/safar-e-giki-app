import { useState } from 'react';
import { Loader2, CreditCard, Smartphone, Building } from 'lucide-react';
import { paymentsApi } from '../../api/payments';

interface SafepayCheckoutProps {
  bookingId: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SafepayCheckout({ bookingId, amount, onError }: SafepayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await paymentsApi.createCheckout({
        bookingId,
        amount,
        currency: 'PKR',
      });

      // Redirect to Safepay checkout
      window.location.href = response.checkoutUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.';
      onError?.(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <CreditCard className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-xl text-slate-800">Secure Payment</h3>
      </div>

      <div className="mb-6">
        <p className="text-slate-600 mb-4">
          You will be redirected to Safepay to complete your payment securely.
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Supported Payment Methods:</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="w-4 h-4" />
              <span>Visa / MasterCard / PayPak</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Smartphone className="w-4 h-4 text-red-500" />
              <span>JazzCash</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Smartphone className="w-4 h-4 text-green-500" />
              <span>EasyPaisa</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building className="w-4 h-4" />
              <span>Bank Transfer (Raast)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 mb-4 p-3 bg-emerald-50 rounded-lg">
          <span className="font-medium">Amount to pay:</span>
          <span className="text-lg font-semibold text-emerald-600">Rs. {amount.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connecting to Safepay...
          </>
        ) : (
          <>Pay Rs. {amount.toLocaleString()}</>
        )}
      </button>

      {/* Test Card Info */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-2">
          <strong>Test Cards (Sandbox Mode):</strong>
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> - Successful payment</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">Use any future expiry date, any 3-digit CVV, and OTP: 123456</p>
      </div>
    </div>
  );
}
