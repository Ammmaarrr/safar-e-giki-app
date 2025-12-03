import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

export type PaymentStatusType = 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action';

interface PaymentStatusProps {
  status: PaymentStatusType;
  message?: string;
  onRetry?: () => void;
  onContinue?: () => void;
}

export function PaymentStatus({ status, message, onRetry, onContinue }: PaymentStatusProps) {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      {status === 'processing' && (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-xl text-slate-800 mb-2">Processing Payment</h3>
          <p className="text-slate-600">Please wait while we process your payment...</p>
        </>
      )}

      {status === 'succeeded' && (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl text-emerald-700 mb-2">Payment Successful!</h3>
          <p className="text-slate-600 mb-6">
            {message || 'Your payment has been processed successfully.'}
          </p>
          {onContinue && (
            <button
              onClick={onContinue}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              Continue to Booking Confirmation
            </button>
          )}
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl text-red-700 mb-2">Payment Failed</h3>
          <p className="text-slate-600 mb-6">
            {message || 'We couldn\'t process your payment. Please try again.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all"
            >
              Try Again
            </button>
          )}
        </>
      )}

      {status === 'requires_action' && (
        <>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl text-amber-700 mb-2">Additional Action Required</h3>
          <p className="text-slate-600">
            {message || 'Please complete the additional authentication step to finish your payment.'}
          </p>
        </>
      )}
    </div>
  );
}
