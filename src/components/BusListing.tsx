import { ArrowLeft, Clock, MapPin, Users, Wifi, Coffee, CheckCircle } from 'lucide-react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

export interface Bus {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  type: string;
  amenities: string[];
}

interface BusListingProps {
  bookingData: BookingData;
  onSelectBus: (bus: Bus) => void;
  onBack: () => void;
}

export function BusListing({ bookingData, onSelectBus, onBack }: BusListingProps) {
  // Mock bus data
  const buses: Bus[] = [
    {
      id: 1,
      name: 'Safar e GIKI Express',
      departureTime: '08:00 AM',
      arrivalTime: '02:00 PM',
      duration: '6 hrs',
      price: 2500,
      seatsAvailable: 28,
      totalSeats: 30,
      type: 'AC Recliner',
      amenities: ['AC', 'Reclining Seats', 'Charging Ports', 'Refreshments']
    },
    {
      id: 2,
      name: 'Safar e GIKI Comfort',
      departureTime: '02:00 PM',
      arrivalTime: '08:00 PM',
      duration: '6 hrs',
      price: 2800,
      seatsAvailable: 20,
      totalSeats: 25,
      type: 'Premium AC',
      amenities: ['AC', 'Extra Legroom', 'WiFi', 'Snacks', 'Music']
    }
  ];

  const formatDate = (dateString: string) => {
    const periodMap: Record<string, string> = {
      'spring-2025-mid': 'Spring 2025 - Mid Semester Break (March 15-25, 2025)',
      'spring-2025-end': 'Spring 2025 - End Semester Break (June 1-15, 2025)',
      'fall-2025-mid': 'Fall 2025 - Mid Semester Break (October 15-25, 2025)',
      'fall-2025-end': 'Fall 2025 - End Semester Break (December 15-31, 2025)'
    };
    return periodMap[dateString] || dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="shadow-lg overflow-hidden relative">
        <img src={headerImage} alt="Safar e GIKI" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 px-4 py-4 max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </button>
          <div className="flex items-center justify-between flex-wrap gap-4 text-white">
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              <MapPin className="w-5 h-5" />
              <span className="text-xl">{bookingData.from}</span>
              <span className="mx-2">→</span>
              <span className="text-xl">{bookingData.to}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4" />
              {formatDate(bookingData.date)}
            </div>
          </div>
        </div>
      </header>

      {/* Bus List */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl text-slate-800">Available Buses</h2>
          <p className="text-slate-600">{buses.length} buses found</p>
        </div>

        <div className="space-y-4">
          {buses.map((bus) => (
            <div 
              key={bus.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Bus Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl text-slate-800 mb-1">{bus.name}</h3>
                        <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                          {bus.type}
                        </span>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center gap-6 mb-4">
                      <div>
                        <p className="text-slate-600 text-sm">Departure</p>
                        <p className="text-slate-800">{bus.departureTime}</p>
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-slate-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 px-2 text-xs text-slate-600">
                          {bus.duration}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm">Arrival</p>
                        <p className="text-slate-800">{bus.arrivalTime}</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-3">
                      {bus.amenities.map((amenity, index) => (
                        <span key={index} className="flex items-center gap-1 text-sm text-slate-600">
                          {amenity === 'WiFi' && <Wifi className="w-4 h-4" />}
                          {amenity === 'AC' && <CheckCircle className="w-4 h-4" />}
                          {(amenity.includes('Seats') || amenity.includes('Sleeper')) && <Users className="w-4 h-4" />}
                          {(amenity === 'Refreshments' || amenity === 'Meals') && <Coffee className="w-4 h-4" />}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price and Book */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:min-w-[200px] border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-left lg:text-right">
                      <p className="text-slate-600 text-sm">Starting from</p>
                      <p className="text-3xl text-emerald-600">Rs. {bus.price.toLocaleString()}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        <Users className="w-4 h-4 inline" /> {bus.seatsAvailable} seats left
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectBus(bus)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}