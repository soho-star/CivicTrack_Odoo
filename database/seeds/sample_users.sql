-- Sample users for development and testing
-- Note: These are for development only and should not be used in production

-- Sample citizen users
INSERT INTO users (id, email, name, phone, role, is_verified, location, address) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    'john.doe@example.com',
    'John Doe',
    '+1-555-0101',
    'citizen',
    true,
    ST_GeomFromText('POINT(-74.0060 40.7128)', 4326), -- New York City
    '123 Main St, New York, NY 10001'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'jane.smith@example.com',
    'Jane Smith',
    '+1-555-0102',
    'citizen',
    true,
    ST_GeomFromText('POINT(-74.0070 40.7138)', 4326),
    '456 Oak Ave, New York, NY 10002'
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'mike.johnson@example.com',
    'Mike Johnson',
    '+1-555-0103',
    'citizen',
    true,
    ST_GeomFromText('POINT(-74.0050 40.7118)', 4326),
    '789 Pine St, New York, NY 10003'
);

-- Sample admin user
INSERT INTO users (id, email, name, phone, role, is_verified, location, address) VALUES
(
    '550e8400-e29b-41d4-a716-446655440010',
    'admin@civictrack.com',
    'CivicTrack Admin',
    '+1-555-0110',
    'admin',
    true,
    ST_GeomFromText('POINT(-74.0060 40.7128)', 4326),
    'City Hall, New York, NY 10001'
);

-- Sample authority users
INSERT INTO users (id, email, name, phone, role, is_verified, location, address) VALUES
(
    '550e8400-e29b-41d4-a716-446655440020',
    'roads.dept@city.gov',
    'Roads Department',
    '+1-555-0120',
    'authority',
    true,
    ST_GeomFromText('POINT(-74.0065 40.7125)', 4326),
    'Department of Transportation, New York, NY'
),
(
    '550e8400-e29b-41d4-a716-446655440021',
    'sanitation@city.gov',
    'Sanitation Department',
    '+1-555-0121',
    'authority',
    true,
    ST_GeomFromText('POINT(-74.0055 40.7135)', 4326),
    'Department of Sanitation, New York, NY'
);

-- Note: In a real application, these users would be created through the authentication system
-- and their IDs would be managed by Supabase Auth