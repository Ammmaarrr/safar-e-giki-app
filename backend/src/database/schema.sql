-- Safar-e-GIKI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- USERS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cnic VARCHAR(15),
    student_id VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================
-- BUSES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS buses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    operator VARCHAR(255) DEFAULT 'Safar-e-GIKI',
    bus_type VARCHAR(100) NOT NULL,
    total_seats INTEGER NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- ROUTES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS routes (
    id VARCHAR(100) PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) ON DELETE CASCADE,
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    departure_time VARCHAR(20) NOT NULL,
    arrival_time VARCHAR(20) NOT NULL,
    duration VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available_dates DATE[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routes_from_city ON routes(from_city);
CREATE INDEX IF NOT EXISTS idx_routes_to_city ON routes(to_city);
CREATE INDEX IF NOT EXISTS idx_routes_bus_id ON routes(bus_id);

-- =====================
-- BOOKINGS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    route_id VARCHAR(100) REFERENCES routes(id) ON DELETE SET NULL,
    bus_id INTEGER REFERENCES buses(id) ON DELETE SET NULL,
    bus_name VARCHAR(255),
    from_city VARCHAR(100) NOT NULL,
    to_city VARCHAR(100) NOT NULL,
    seats INTEGER[] NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(255),
    passenger_cnic VARCHAR(15) NOT NULL,
    passenger_emergency_contact VARCHAR(20),
    passenger_gender VARCHAR(10),
    passenger_boarding_point VARCHAR(255),
    passenger_student_id VARCHAR(50),
    travel_date DATE NOT NULL,
    departure_time VARCHAR(20) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    payment_tracker VARCHAR(255),
    payment_reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_route_id ON bookings(route_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);

-- =====================
-- SEMESTER BREAKS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS semester_breaks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_semester_breaks_dates ON semester_breaks(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_semester_breaks_active ON semester_breaks(is_active);

-- =====================
-- SAMPLE DATA
-- =====================

-- Insert sample buses
INSERT INTO buses (name, operator, bus_type, total_seats, amenities, image_url) VALUES
    ('Safar e GIKI Express', 'Safar-e-GIKI', 'AC Recliner', 30, ARRAY['AC', 'Reclining Seats', 'Charging Ports', 'Refreshments'], NULL),
    ('Safar e GIKI Comfort', 'Safar-e-GIKI', 'Premium AC', 25, ARRAY['AC', 'Extra Legroom', 'WiFi', 'Snacks', 'Music'], NULL),
    ('Safar e GIKI Night', 'Safar-e-GIKI', 'Standard AC', 40, ARRAY['AC', 'Blankets', 'Pillow'], NULL)
ON CONFLICT DO NOTHING;

-- Insert sample routes
INSERT INTO routes (id, bus_id, from_city, to_city, departure_time, arrival_time, duration, price, available_dates) VALUES
    ('giki-multan-1', 1, 'GIKI', 'Multan', '08:00 AM', '02:00 PM', '6 hrs', 2500.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[]),
    ('giki-multan-2', 2, 'GIKI', 'Multan', '02:00 PM', '08:00 PM', '6 hrs', 2800.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[]),
    ('giki-multan-3', 3, 'GIKI', 'Multan', '10:00 PM', '04:00 AM', '6 hrs', 2200.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[]),
    ('multan-giki-1', 1, 'Multan', 'GIKI', '08:00 AM', '02:00 PM', '6 hrs', 2500.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[]),
    ('multan-giki-2', 2, 'Multan', 'GIKI', '02:00 PM', '08:00 PM', '6 hrs', 2800.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[]),
    ('multan-giki-3', 3, 'Multan', 'GIKI', '10:00 PM', '04:00 AM', '6 hrs', 2200.00, ARRAY[CURRENT_DATE, CURRENT_DATE + 1, CURRENT_DATE + 2, CURRENT_DATE + 7, CURRENT_DATE + 14]::DATE[])
ON CONFLICT (id) DO NOTHING;

-- Insert sample semester breaks
INSERT INTO semester_breaks (name, start_date, end_date, is_active) VALUES
    ('Winter Break 2024', '2024-12-20', '2025-01-15', true),
    ('Spring Break 2025', '2025-03-15', '2025-03-25', true),
    ('Summer Break 2025', '2025-06-01', '2025-08-31', true)
ON CONFLICT DO NOTHING;

-- =====================
-- UPDATED_AT TRIGGER
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buses_updated_at ON buses;
CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_routes_updated_at ON routes;
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_semester_breaks_updated_at ON semester_breaks;
CREATE TRIGGER update_semester_breaks_updated_at BEFORE UPDATE ON semester_breaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- ROW LEVEL SECURITY (Optional - Enable if using Supabase Auth)
-- =====================
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Example policy for users to read their own data
-- CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);

-- Example policy for users to view their own bookings
-- CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
