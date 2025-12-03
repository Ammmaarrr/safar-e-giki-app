import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export function PaymentCancelled() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-semibold text-amber-700 mb-2">Payment Cancelled</h2>
        <p className="text-slate-600 mb-6">
          Your payment was cancelled. Your booking is still reserved but not confirmed.
          You can try paying again or choose a different payment method.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            Try Payment Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-800 py-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {bookingId && (
          <p className="text-xs text-slate-500 mt-4">
            Booking ID: {bookingId}
          </p>
        )}
      </div>
    </div>
  );
}
