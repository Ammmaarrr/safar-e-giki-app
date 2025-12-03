export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  studentId?: string;
  password: string;
  createdAt: Date;
}

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

export interface Seat {
  id: number;
  number: number;
  isAvailable: boolean;
  type: 'window' | 'aisle' | 'middle';
  price: number;
}

export interface PassengerInfo {
  name: string;
  phone: string;
  email: string;
  cnic: string;
  emergencyContact: string;
  studentId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  busId: number;
  busName: string;
  seatNumbers: number[];
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  passengerInfo: PassengerInfo;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  transactionId?: string;
  createdAt: string;
}
