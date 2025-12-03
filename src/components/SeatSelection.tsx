import { useState } from 'react';
import { ArrowLeft, Users, Check } from 'lucide-react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

interface SeatSelectionProps {
  bookingData: BookingData;
  onSeatsSelected: (seats: number[]) => void;
  onBack: () => void;
}

type SeatStatus = 'available' | 'selected' | 'booked' | 'female' | 'male';

interface Seat {
  number: number;
  status: SeatStatus;
}

export function SeatSelection({ bookingData, onSeatsSelected, onBack }: SeatSelectionProps) {
  // Generate seat layout (40 seats: 4 columns x 10 rows)
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const bookedSeats = [3, 7, 12, 15, 21, 28, 33]; // Mock booked seats
    const femaleSeats = [5, 18, 24]; // Mock female reserved
    const maleSeats = [8, 16, 29]; // Mock male reserved
    
    for (let i = 1; i <= 40; i++) {
      let status: SeatStatus = 'available';
      if (bookedSeats.includes(i)) status = 'booked';
      else if (femaleSeats.includes(i)) status = 'female';
      else if (maleSeats.includes(i)) status = 'male';
      
      seats.push({ number: i, status });
    }
    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatClick = (seatNumber: number) => {
    const seat = seats.find(s => s.number === seatNumber);
    if (!seat || seat.status === 'booked') return;

    if (selectedSeats.includes(seatNumber)) {
      // Deselect
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
      setSeats(seats.map(s => 
        s.number === seatNumber ? { ...s, status: 'available' } : s
      ));
    } else {
      // Select (max 4 seats)
      if (selectedSeats.length >= 4) {
        alert('You can select maximum 4 seats');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
      setSeats(seats.map(s => 
        s.number === seatNumber ? { ...s, status: 'selected' } : s
      ));
    }
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case 'available': return 'bg-white border-2 border-slate-300 hover:border-emerald-500 cursor-pointer';
      case 'selected': return 'bg-emerald-600 border-2 border-emerald-600 text-white cursor-pointer';
      case 'booked': return 'bg-slate-300 border-2 border-slate-300 text-slate-500 cursor-not-allowed';
      case 'female': return 'bg-pink-200 border-2 border-pink-400 cursor-pointer';
      case 'male': return 'bg-blue-200 border-2 border-blue-400 cursor-pointer';
    }
  };

  const totalPrice = selectedSeats.length * (bookingData.selectedBus?.price || 0);

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
            Back to Buses
          </button>
          <div className="text-white">
            <h2 className="text-2xl drop-shadow-lg">{bookingData.selectedBus?.name}</h2>
            <p className="text-white/90 drop-shadow-lg">{bookingData.selectedBus?.departureTime} • {bookingData.selectedBus?.type}</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Seat Layout */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl text-slate-800 mb-4">Select Your Seats</h3>
            
            {/* Driver Section */}
            <div className="mb-6 flex justify-end">
              <div className="bg-slate-800 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
                <Users className="w-5 h-5" />
                Driver
              </div>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
              {seats.map((seat, index) => (
                <div key={seat.number}>
                  {/* Add aisle space after 2nd column */}
                  {index % 4 === 2 && <div className="w-4" />}
                  <button
                    onClick={() => handleSeatClick(seat.number)}
                    disabled={seat.status === 'booked'}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${getSeatColor(seat.status)}`}
                  >
                    {seat.status === 'selected' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm">{seat.number}</span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-6 border-t">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border-2 border-slate-300 rounded"></div>
                <span className="text-sm text-slate-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded"></div>
                <span className="text-sm text-slate-600">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-300 rounded"></div>
                <span className="text-sm text-slate-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-200 border-2 border-pink-400 rounded"></div>
                <span className="text-sm text-slate-600">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-200 border-2 border-blue-400 rounded"></div>
                <span className="text-sm text-slate-600">Male</span>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-xl text-slate-800 mb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between pb-3 border-b">
                <span className="text-slate-600">Selected Seats</span>
                <span className="text-slate-800">
                  {selectedSeats.length > 0 ? selectedSeats.sort((a, b) => a - b).join(', ') : 'None'}
                </span>
              </div>
              
              <div className="flex justify-between pb-3 border-b">
                <span className="text-slate-600">Price per seat</span>
                <span className="text-slate-800">Rs. {(bookingData.selectedBus?.price || 0).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b">
                <span className="text-slate-600">Number of seats</span>
                <span className="text-slate-800">{selectedSeats.length}</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="text-slate-800">Total Amount</span>
                <span className="text-2xl text-emerald-600">Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (selectedSeats.length === 0) {
                  alert('Please select at least one seat');
                  return;
                }
                onSeatsSelected(selectedSeats.sort((a, b) => a - b));
              }}
              disabled={selectedSeats.length === 0}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Details
            </button>

            <p className="text-xs text-slate-500 text-center mt-3">
              You can select up to 4 seats
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}