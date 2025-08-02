-- Sample issues for development and testing

-- Sample issues from different users
INSERT INTO issues (id, user_id, title, description, category, status, location, address, images, upvotes, downvotes) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001', -- John Doe
    'Large pothole on Main Street',
    'There is a large pothole near the intersection of Main Street and 1st Avenue. It has been causing damage to vehicles and is a safety hazard. The pothole is approximately 3 feet wide and 6 inches deep.',
    'severe',
    'reported',
    ST_GeomFromText('POINT(-74.0061 40.7129)', 4326),
    'Main St & 1st Ave, New York, NY 10001',
    ARRAY['https://example.com/images/pothole1.jpg', 'https://example.com/images/pothole2.jpg'],
    5,
    0
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002', -- Jane Smith
    'Broken street light on Oak Avenue',
    'The street light at 456 Oak Avenue has been out for over a week. This area gets very dark at night and poses a safety risk for pedestrians.',
    'mild',
    'reported',
    ST_GeomFromText('POINT(-74.0071 40.7139)', 4326),
    '456 Oak Ave, New York, NY 10002',
    ARRAY['https://example.com/images/streetlight1.jpg'],
    3,
    0
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003', -- Mike Johnson
    'Overflowing garbage bins',
    'The garbage bins on Pine Street have been overflowing for the past three days. Garbage is scattered on the sidewalk and attracting pests.',
    'mild',
    'in_progress',
    ST_GeomFromText('POINT(-74.0051 40.7119)', 4326),
    '789 Pine St, New York, NY 10003',
    ARRAY['https://example.com/images/garbage1.jpg', 'https://example.com/images/garbage2.jpg'],
    2,
    0
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001', -- John Doe
    'Graffiti on public building',
    'Someone has spray-painted graffiti on the side of the community center. While not urgent, it should be cleaned to maintain the appearance of our neighborhood.',
    'low',
    'reported',
    ST_GeomFromText('POINT(-74.0065 40.7125)', 4326),
    'Community Center, New York, NY 10001',
    ARRAY['https://example.com/images/graffiti1.jpg'],
    1,
    0
),
(
    '660e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440002', -- Jane Smith
    'Water leak on 2nd Street',
    'There appears to be a water main leak on 2nd Street. Water is bubbling up through the pavement and creating a small flood. This needs immediate attention.',
    'severe',
    'resolved',
    ST_GeomFromText('POINT(-74.0058 40.7132)', 4326),
    '2nd Street, New York, NY 10002',
    ARRAY['https://example.com/images/waterleak1.jpg', 'https://example.com/images/waterleak2.jpg'],
    8,
    0
);

-- Add some sample comments
INSERT INTO comments (issue_id, user_id, content, is_official) VALUES
(
    '660e8400-e29b-41d4-a716-446655440001', -- Pothole issue
    '550e8400-e29b-41d4-a716-446655440002', -- Jane Smith
    'I can confirm this pothole is really bad. I had to swerve to avoid it this morning.',
    false
),
(
    '660e8400-e29b-41d4-a716-446655440001', -- Pothole issue
    '550e8400-e29b-41d4-a716-446655440020', -- Roads Department
    'Thank you for reporting this issue. We have added it to our repair schedule and expect to fix it within the next week.',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440003', -- Garbage issue
    '550e8400-e29b-41d4-a716-446655440021', -- Sanitation Department
    'We are aware of this issue and have dispatched a crew to clean up the area. The regular pickup schedule will resume tomorrow.',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440005', -- Water leak (resolved)
    '550e8400-e29b-41d4-a716-446655440020', -- Roads Department
    'This issue has been resolved. The water main has been repaired and the street has been restored.',
    true
);

-- Add some sample votes
INSERT INTO issue_votes (issue_id, user_id, vote_type) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'upvote'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'upvote'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'upvote'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'upvote'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'upvote'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'upvote'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'upvote'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'upvote');