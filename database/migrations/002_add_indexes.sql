-- Migration 002: Add Performance Indexes
-- Creates indexes for better query performance

-- Spatial indexes for location-based queries
CREATE INDEX idx_issues_location ON issues USING GIST(location);
CREATE INDEX idx_users_location ON users USING GIST(location);

-- Regular indexes for common queries
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_priority_score ON issues(priority_score DESC);

-- Comment indexes
CREATE INDEX idx_comments_issue_id ON comments(issue_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Vote indexes
CREATE INDEX idx_issue_votes_issue_id ON issue_votes(issue_id);
CREATE INDEX idx_issue_votes_user_id ON issue_votes(user_id);

-- Status update indexes
CREATE INDEX idx_status_updates_issue_id ON status_updates(issue_id);
CREATE INDEX idx_status_updates_created_at ON status_updates(created_at DESC);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);