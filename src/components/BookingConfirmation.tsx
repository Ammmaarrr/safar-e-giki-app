import { CheckCircle, Download, Share2, Home, MapPin, Calendar, Clock, User, Phone, Ticket } from 'lucide-react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

interface BookingConfirmationProps {
  bookingData: BookingData;
  onNewBooking: () => void;
}

export function BookingConfirmation({ bookingData, onNewBooking }: BookingConfirmationProps) {
  const bookingId = `SG${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const totalPrice = (bookingData.selectedSeats?.length || 0) * (bookingData.selectedBus?.price || 0);

  const handleDownload = () => {
    alert('Ticket download functionality would be implemented here');
  };

  const handleShare = () => {
    alert('Sharing functionality would be implemented here');
  };

  const formatDate = (dateString: string) => {
    const periodMap: Record<string, string> = {
      'spring-2025-mid': 'Spring 2025 - Mid Semester Break',
      'spring-2025-end': 'Spring 2025 - End Semester Break',
      'fall-2025-mid': 'Fall 2025 - Mid Semester Break',
      'fall-2025-end': 'Fall 2025 - End Semester Break'
    };
    return periodMap[dateString] || dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl text-slate-800 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600">Your seat has been successfully reserved</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl">Safar e GIKI</h2>
                <p className="text-emerald-100">Student Travel Service</p>
              </div>
              <Ticket className="w-12 h-12" />
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
              <p className="text-sm text-emerald-100">Booking ID</p>
              <p className="text-xl">{bookingId}</p>
            </div>
          </div>

          {/* Journey Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Route */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-slate-800">Journey Route</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm">From</p>
                      <p className="text-slate-800">{bookingData.from}</p>
                    </div>
                    <div className="text-emerald-600">→</div>
                    <div className="text-right">
                      <p className="text-slate-600 text-sm">To</p>
                      <p className="text-slate-800">{bookingData.to}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-slate-800">Travel Details</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-slate-600 text-sm">Date</p>
                    <p className="text-slate-800">{formatDate(bookingData.date)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Departure Time
                    </p>
                    <p className="text-slate-800">{bookingData.selectedBus?.departureTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bus Details */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-slate-800 mb-3">Bus Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm">Bus Name</p>
                  <p className="text-slate-800">{bookingData.selectedBus?.name}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm">Bus Type</p>
                  <p className="text-slate-800">{bookingData.selectedBus?.busType}</p>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border-t pt-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-emerald-600" />
                <h3 className="text-slate-800">Passenger Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm">Name</p>
                  <p className="text-slate-800">{bookingData.passengerInfo?.name}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Phone
                  </p>
                  <p className="text-slate-800">{bookingData.passengerInfo?.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm">CNIC</p>
                  <p className="text-slate-800">{bookingData.passengerInfo?.cnic}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-600 text-sm">Seat Numbers</p>
                  <p className="text-slate-800">{bookingData.selectedSeats?.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Price per seat</span>
                  <span className="text-slate-800">Rs. {bookingData.selectedBus?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Number of seats</span>
                  <span className="text-slate-800">{bookingData.selectedSeats?.length}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-emerald-200">
                  <span className="text-slate-800">Total Amount</span>
                  <span className="text-2xl text-emerald-600">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 p-6 grid md:grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-white border-2 border-slate-300 text-slate-700 py-3 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              Share Ticket
            </button>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6">
          <h3 className="text-amber-900 mb-3">Important Instructions</h3>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Please arrive at the boarding point at least 15 minutes before departure</li>
            <li>• Carry a valid ID proof (CNIC) for verification</li>
            <li>• Keep this e-ticket saved on your phone or take a printout</li>
            <li>• For any queries, contact us at: 0300-1234567</li>
            <li>• Cancellation must be done at least 6 hours before departure</li>
          </ul>
        </div>

        {/* New Booking Button */}
        <button
          onClick={onNewBooking}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
        >
          Book Another Ticket
        </button>
      </div>
    </div>
  );
}