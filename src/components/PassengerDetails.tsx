import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, CreditCard, AlertCircle } from 'lucide-react';
import { BookingData } from '../App';
import headerImage from 'figma:asset/aa045fc1145c0993b08594c2363aa395a1a15c2c.png';

interface PassengerDetailsProps {
  bookingData: BookingData;
  onSubmit: (info: any) => void;
  onBack: () => void;
}

export function PassengerDetails({ bookingData, onSubmit, onBack }: PassengerDetailsProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cnic: '',
    emergencyContact: '',
    gender: 'Male',
    boardingPoint: '',
    studentId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const boardingPoints = [
    'GIKI Main Gate',
    'GIKI Hostel Area',
    'Faculty Colony',
    'Topi Adda'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^03\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number (03XXXXXXXXX)';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.cnic.trim()) newErrors.cnic = 'CNIC is required';
    else if (!/^\d{13}$/.test(formData.cnic.replace(/-/g, ''))) {
      newErrors.cnic = 'Invalid CNIC (13 digits)';
    }
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.boardingPoint) newErrors.boardingPoint = 'Please select a boarding point';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const totalPrice = (bookingData.selectedSeats?.length || 0) * (bookingData.selectedBus?.price || 0);

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
            Back to Seat Selection
          </button>
          <div className="text-white">
            <h2 className="text-2xl drop-shadow-lg">Passenger Details</h2>
            <p className="text-white/90 drop-shadow-lg">Complete your booking information</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* CNIC */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  CNIC Number *
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  placeholder="XXXXXXXXXXXXX"
                  maxLength={13}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.cnic ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {errors.cnic && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.cnic}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-slate-700 mb-2">Gender *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span className="text-slate-700">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleChange}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span className="text-slate-700">Female</span>
                  </label>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Emergency Contact Number *
                </label>
                <input
                  type="tel"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="03XXXXXXXXX"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.emergencyContact ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {errors.emergencyContact && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.emergencyContact}
                  </p>
                )}
              </div>

              {/* Student ID */}
              <div>
                <label className="block text-slate-700 mb-2">
                  🎓 GIKI Student ID (Optional)
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g., 2021-BSCS-01"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                />
                <p className="text-sm text-slate-500 mt-1">
                  For student verification purposes
                </p>
              </div>

              {/* Boarding Point */}
              <div>
                <label className="block text-slate-700 mb-2">Boarding Point *</label>
                <select
                  name="boardingPoint"
                  value={formData.boardingPoint}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.boardingPoint ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                >
                  <option value="">Select boarding point</option>
                  {boardingPoints.map((point, index) => (
                    <option key={index} value={point}>{point}</option>
                  ))}
                </select>
                {errors.boardingPoint && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.boardingPoint}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Confirmation
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
            <h3 className="text-xl text-slate-800 mb-4">Booking Summary</h3>
            
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
                <p className="text-slate-600">Departure</p>
                <p className="text-slate-800">{bookingData.selectedBus?.departureTime}</p>
              </div>
              
              <div className="pb-3 border-b">
                <p className="text-slate-600">Seats</p>
                <p className="text-slate-800">{bookingData.selectedSeats?.join(', ')}</p>
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