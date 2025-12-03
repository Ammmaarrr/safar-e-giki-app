import { MapPin, Calendar, ArrowRightLeft, Bus } from 'lucide-react';
import { useState } from 'react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

interface SearchFormProps {
  onSearch: (from: string, to: string, date: string) => void;
  initialData: BookingData;
}

export function SearchForm({ onSearch, initialData }: SearchFormProps) {
  const [from, setFrom] = useState(initialData.from);
  const [to, setTo] = useState(initialData.to);
  const [date, setDate] = useState(initialData.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (from && to && date) {
      onSearch(from, to, date);
    }
  };

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const travelPeriods = [
    { value: 'spring-2025-mid', label: 'Spring 2025 - Mid Semester Break', dates: '(March 15-25, 2025)' },
    { value: 'spring-2025-end', label: 'Spring 2025 - End Semester Break', dates: '(June 1-15, 2025)' },
    { value: 'fall-2025-mid', label: 'Fall 2025 - Mid Semester Break', dates: '(October 15-25, 2025)' },
    { value: 'fall-2025-end', label: 'Fall 2025 - End Semester Break', dates: '(December 15-31, 2025)' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="shadow-lg overflow-hidden">
        <img src={headerImage} alt="Safar e GIKI" className="w-full h-auto object-cover" />
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl text-slate-800 mb-3">Book Your Seat</h2>
            <p className="text-slate-600">Exclusive bus service for GIKI students traveling during semester breaks</p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Selection */}
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                {/* From */}
                <div>
                  <label className="block text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    From
                  </label>
                  <select 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="GIKI">GIKI (Ghulam Ishaq Khan Institute)</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>

                {/* Swap Button */}
                <button
                  type="button"
                  onClick={swapLocations}
                  className="mb-1 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5" />
                </button>

                {/* To */}
                <div>
                  <label className="block text-slate-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    To
                  </label>
                  <select 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                    required
                  >
                    <option value="Multan">Multan</option>
                    <option value="GIKI">GIKI (Ghulam Ishaq Khan Institute)</option>
                  </select>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Select Semester Break Period
                </label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Choose your travel period</option>
                  {travelPeriods.map((period) => (
                    <option key={period.value} value={period.value}>
                      {period.label} {period.dates}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                Check Availability
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-1">🎓</div>
              <p className="text-sm text-slate-600">For GIKI Students</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-1">💺</div>
              <p className="text-sm text-slate-600">Choose Your Seat</p>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4">
              <div className="text-2xl mb-1">🚌</div>
              <p className="text-sm text-slate-600">Direct Service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}