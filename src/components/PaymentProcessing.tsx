import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Building, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

interface PaymentProcessingProps {
  bookingData: BookingData;
  onPaymentComplete: () => void;
  onBack: () => void;
}

type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank' | 'cash';

export function PaymentProcessing({ bookingData, onPaymentComplete, onBack }: PaymentProcessingProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('jazzcash');
  const [paymentDetails, setPaymentDetails] = useState({
    accountNumber: '',
    accountName: '',
    transactionId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = (bookingData.selectedSeats?.length || 0) * (bookingData.selectedBus?.price || 0);

  const paymentMethods = [
    {
      id: 'jazzcash' as PaymentMethod,
      name: 'JazzCash',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay via JazzCash mobile wallet',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'easypaisa' as PaymentMethod,
      name: 'EasyPaisa',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pay via EasyPaisa mobile wallet',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'bank' as PaymentMethod,
      name: 'Bank Transfer',
      icon: <Building className="w-6 h-6" />,
      description: 'Direct bank transfer',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Pay on Boarding',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Pay cash when boarding the bus',
      color: 'from-slate-500 to-slate-600'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') {
      if (!paymentDetails.accountNumber.trim()) {
        newErrors.accountNumber = 'Mobile number is required';
      } else if (!/^03\d{9}$/.test(paymentDetails.accountNumber)) {
        newErrors.accountNumber = 'Invalid mobile number (03XXXXXXXXX)';
      }
      if (!paymentDetails.transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required';
      }
    } else if (selectedMethod === 'bank') {
      if (!paymentDetails.accountName.trim()) {
        newErrors.accountName = 'Account holder name is required';
      }
      if (!paymentDetails.transactionId.trim()) {
        newErrors.transactionId = 'Transaction ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMethod === 'cash' || validatePayment()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsProcessing(false);
      onPaymentComplete();
    }
  };

  const formatDate = (dateString: string) => {
    const periodMap: Record<string, string> = {
      'spring-2025-mid': 'Spring 2025 - Mid Break',
      'spring-2025-end': 'Spring 2025 - End Break',
      'fall-2025-mid': 'Fall 2025 - Mid Break',
      'fall-2025-end': 'Fall 2025 - End Break'
    };
    return periodMap[dateString] || dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-8">
      {/* Header */}
      <header className="shadow-lg overflow-hidden relative mb-6">
        <img src={headerImage} alt="Safar e GIKI" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 px-4 py-4 max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Passenger Details
          </button>
          <div className="text-white">
            <h2 className="text-2xl drop-shadow-lg">Payment</h2>
            <p className="text-white/90 drop-shadow-lg">Complete your booking payment</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl text-slate-800 mb-4">Select Payment Method</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      selectedMethod === method.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color} text-white`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800">{method.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl text-slate-800 mb-4">Payment Details</h3>

              {/* JazzCash / EasyPaisa */}
              {(selectedMethod === 'jazzcash' || selectedMethod === 'easypaisa') && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>Instructions:</strong>
                    </p>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Send Rs. {totalPrice.toLocaleString()} to: <strong>0300-1234567</strong></li>
                      <li>Note: "GIKI Booking - {bookingData.passengerInfo?.name}"</li>
                      <li>Enter your {selectedMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} number and Transaction ID below</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">
                      Your {selectedMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="accountNumber"
                      value={paymentDetails.accountNumber}
                      onChange={handleChange}
                      placeholder="03XXXXXXXXX"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.accountNumber ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                      }`}
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">
                      Transaction ID *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={paymentDetails.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction ID from SMS"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.transactionId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                      }`}
                    />
                    {errors.transactionId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              {selectedMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>Bank Details:</strong>
                    </p>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p><strong>Bank:</strong> Meezan Bank</p>
                      <p><strong>Account Title:</strong> Safar e GIKI</p>
                      <p><strong>Account Number:</strong> 12345678901234</p>
                      <p><strong>IBAN:</strong> PK12MEZN0012345678901234</p>
                      <p className="mt-2">Transfer Rs. {totalPrice.toLocaleString()} and enter details below</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={paymentDetails.accountName}
                      onChange={handleChange}
                      placeholder="Your name as per bank account"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.accountName ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                      }`}
                    />
                    {errors.accountName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">
                      Transaction ID / Reference Number *
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={paymentDetails.transactionId}
                      onChange={handleChange}
                      placeholder="Enter transaction reference number"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.transactionId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                      }`}
                    />
                    {errors.transactionId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Pay on Boarding */}
              {selectedMethod === 'cash' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900 mb-2">
                    <strong>Pay on Boarding:</strong>
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>Your seat will be reserved</li>
                    <li>Pay Rs. {totalPrice.toLocaleString()} in cash when boarding</li>
                    <li>Please bring exact change if possible</li>
                    <li>Show your e-ticket to the conductor</li>
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    {selectedMethod === 'cash' ? 'Confirm Booking' : 'Complete Payment'}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-xl text-slate-800 mb-4">Payment Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="pb-3 border-b">
                <p className="text-slate-600">Route</p>
                <p className="text-slate-800">{bookingData.from} → {bookingData.to}</p>
              </div>
              
              <div className="pb-3 border-b">
                <p className="text-slate-600">Travel Period</p>
                <p className="text-slate-800">{formatDate(bookingData.date)}</p>
              </div>
              
              <div className="pb-3 border-b">
                <p className="text-slate-600">Bus</p>
                <p className="text-slate-800">{bookingData.selectedBus?.name}</p>
              </div>
              
              <div className="pb-3 border-b">
                <p className="text-slate-600">Passenger</p>
                <p className="text-slate-800">{bookingData.passengerInfo?.name}</p>
              </div>
              
              <div className="pb-3 border-b">
                <p className="text-slate-600">Seats</p>
                <p className="text-slate-800">{bookingData.selectedSeats?.join(', ')}</p>
              </div>

              <div className="pb-3 border-b">
                <p className="text-slate-600">Price per seat</p>
                <p className="text-slate-800">Rs. {bookingData.selectedBus?.price.toLocaleString()}</p>
              </div>

              <div className="pb-3 border-b">
                <p className="text-slate-600">Number of seats</p>
                <p className="text-slate-800">{bookingData.selectedSeats?.length}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-slate-600">Total Amount</p>
                <p className="text-2xl text-emerald-600">Rs. {totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}