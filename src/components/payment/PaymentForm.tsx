import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard, AlertCircle, Lock } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
}

export function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3D Secure authentication required - Stripe handles this automatically
        setErrorMessage('Additional authentication required');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment processing failed';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-xl text-slate-800">Card Payment</h3>
        </div>

        <div className="mb-6">
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Secured by Stripe</span>
          </div>
          <span>Amount: Rs. {amount.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Pay Rs. {amount.toLocaleString()}</>
          )}
        </button>
      </div>

      {/* Test Card Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900 mb-2">
          <strong>Test Cards (Sandbox Mode):</strong>
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ <code className="bg-blue-100 px-1 rounded">4242 4242 4242 4242</code> - Successful payment</li>
          <li>✗ <code className="bg-blue-100 px-1 rounded">4000 0000 0000 9995</code> - Declined payment</li>
          <li>🔐 <code className="bg-blue-100 px-1 rounded">4000 0025 0000 3155</code> - 3D Secure required</li>
        </ul>
        <p className="text-xs text-blue-600 mt-2">Use any future expiry date and any 3-digit CVC</p>
      </div>
    </form>
  );
}
