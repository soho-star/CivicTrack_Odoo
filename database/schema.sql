-- CivicTrack Database Schema
-- Complete database setup for PostgreSQL with PostGIS

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- User roles enum
CREATE TYPE user_role AS ENUM ('citizen', 'admin', 'authority');

-- Issue categories enum
CREATE TYPE issue_category AS ENUM ('severe', 'mild', 'low');

-- Issue status enum
CREATE TYPE issue_status AS ENUM ('reported', 'in_progress', 'resolved', 'rejected');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'citizen',
    is_verified BOOLEAN DEFAULT FALSE,
    location GEOMETRY(POINT, 4326), -- User's default location
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Issues table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category issue_category NOT NULL,
    status issue_status DEFAULT 'reported',
    location GEOMETRY(POINT, 4326) NOT NULL, -- Exact issue location
    address TEXT NOT NULL, -- Human readable address
    images TEXT[] DEFAULT '{}', -- Array of image URLs
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 0, -- Calculated priority
    assigned_to UUID REFERENCES users(id), -- Authority assigned to handle
    estimated_resolution DATE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue images table (normalized approach for better file management)
CREATE TABLE issue_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_key TEXT NOT NULL, -- Storage key for deletion
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments/Activity feed table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_official BOOLEAN DEFAULT FALSE, -- Mark official authority responses
    parent_id UUID REFERENCES comments(id), -- For threaded replies
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status updates/timeline table
CREATE TABLE status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    old_status issue_status,
    new_status issue_status NOT NULL,
    updated_by UUID NOT NULL REFERENCES users(id),
    notes TEXT, -- Optional notes about the status change
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User votes on issues (for community prioritization)
CREATE TABLE issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, user_id) -- One vote per user per issue
);

-- User bookmarks/saved issues
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, issue_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'status_update', 'new_comment', 'issue_resolved', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue categories metadata (for admin management)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7), -- Hex color for UI
    icon VARCHAR(50), -- Icon identifier
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Authority assignments and jurisdictions
CREATE TABLE authority_jurisdictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    jurisdiction_name VARCHAR(255) NOT NULL,
    boundary GEOMETRY(POLYGON, 4326), -- Geographic boundary
    categories issue_category[] DEFAULT '{}', -- Categories they handle
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and reporting tables
CREATE TABLE daily_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_issues INTEGER DEFAULT 0,
    new_issues INTEGER DEFAULT 0,
    resolved_issues INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX idx_issues_location ON issues USING GIST(location);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_comments_issue_id ON comments(issue_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_users_location ON users USING GIST(location);

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own data and public profile info of others
CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Issues are publicly readable, but only owners can update their own
CREATE POLICY "Issues are publicly readable" ON issues
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can create issues" ON issues
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own issues" ON issues
    FOR UPDATE USING (auth.uid() = user_id OR 
                     EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'authority')));

-- Comments are publicly readable, users can create and update their own
CREATE POLICY "Comments are publicly readable" ON comments
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Notifications are private to each user
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Functions for common operations
-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
    RETURN ST_Distance(
        ST_GeogFromText('POINT(' || lng1 || ' ' || lat1 || ')'),
        ST_GeogFromText('POINT(' || lng2 || ' ' || lat2 || ')')
    ) / 1000; -- Return distance in kilometers
END;
$$ LANGUAGE plpgsql;

-- Function to get issues within radius
CREATE OR REPLACE FUNCTION get_issues_within_radius(
    center_lat FLOAT,
    center_lng FLOAT,
    radius_km FLOAT DEFAULT 5.0,
    issue_status_filter issue_status DEFAULT NULL,
    issue_category_filter issue_category DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    description TEXT,
    category issue_category,
    status issue_status,
    images TEXT[],
    distance_km FLOAT,
    upvotes INTEGER,
    downvotes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    user_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.category,
        i.status,
        i.images,
        ST_Distance(
            ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
            i.location::geography
        ) / 1000 AS distance_km,
        i.upvotes,
        i.downvotes,
        i.created_at,
        u.name as user_name
    FROM issues i
    JOIN users u ON i.user_id = u.id
    WHERE ST_DWithin(
        ST_GeogFromText('POINT(' || center_lng || ' ' || center_lat || ')'),
        i.location::geography,
        radius_km * 1000
    )
    AND (issue_status_filter IS NULL OR i.status = issue_status_filter)
    AND (issue_category_filter IS NULL OR i.category = issue_category_filter)
    ORDER BY distance_km ASC, i.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();