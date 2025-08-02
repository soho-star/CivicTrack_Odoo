-- Seed data for issue categories

INSERT INTO categories (name, description, color_code, icon, is_active) VALUES
('Road Damage', 'Potholes, cracks, and other road surface issues', '#ef4444', 'road', true),
('Street Lighting', 'Broken or missing street lights', '#f59e0b', 'lightbulb', true),
('Garbage Collection', 'Missed pickups, overflowing bins, illegal dumping', '#22c55e', 'trash', true),
('Water Issues', 'Leaks, flooding, drainage problems', '#3b82f6', 'water', true),
('Traffic Signals', 'Malfunctioning traffic lights and signs', '#ef4444', 'traffic-light', true),
('Public Safety', 'Security concerns, vandalism, suspicious activities', '#dc2626', 'shield', true),
('Parks & Recreation', 'Playground damage, park maintenance issues', '#16a34a', 'tree', true),
('Noise Complaints', 'Excessive noise from construction, events, etc.', '#f59e0b', 'volume-x', true),
('Sidewalk Issues', 'Cracked or blocked sidewalks', '#6b7280', 'footprints', true),
('Public Transport', 'Bus stop damage, accessibility issues', '#8b5cf6', 'bus', true),
('Environmental', 'Air quality, pollution, environmental hazards', '#059669', 'leaf', true),
('Building Code', 'Unsafe structures, code violations', '#dc2626', 'building', true);

-- Update the enum values to match our categories if needed
-- Note: This would typically be done through a migration