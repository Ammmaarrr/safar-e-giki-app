import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { paymentsApi } from '../../api/payments';

export function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const tracker = searchParams.get('tracker');
      const sig = searchParams.get('sig');
      const bookingId = searchParams.get('bookingId');

      if (!tracker || !sig) {
        setStatus('failed');
        setMessage('Missing payment verification parameters');
        return;
      }

      try {
        const result = await paymentsApi.verify({
          tracker: tracker!,
          sig: sig!,
          bookingId: bookingId || undefined,
        });

        if (result.success) {
          setStatus('success');
          setMessage('Your payment was successful! Redirecting to your booking...');
          setTimeout(() => navigate('/booking/confirmation'), 3000);
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed. Please contact support.');
        }
      } catch {
        setStatus('failed');
        setMessage('Unable to verify payment. Please try again or contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Verifying Payment</h2>
            <p className="text-slate-600">Please wait while we verify your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-700 mb-2">Payment Successful!</h2>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
