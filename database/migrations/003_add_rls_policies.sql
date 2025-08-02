-- Migration 003: Row Level Security Policies
-- Sets up RLS policies for Supabase authentication

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Issues policies
CREATE POLICY "Issues are publicly readable" ON issues
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can create issues" ON issues
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own issues" ON issues
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'authority'))
    );

CREATE POLICY "Admins can delete issues" ON issues
    FOR DELETE USING (
        EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );

-- Issue images policies
CREATE POLICY "Issue images are publicly readable" ON issue_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can upload images for their issues" ON issue_images
    FOR INSERT WITH CHECK (
        EXISTS(SELECT 1 FROM issues WHERE id = issue_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete their issue images" ON issue_images
    FOR DELETE USING (
        EXISTS(SELECT 1 FROM issues WHERE id = issue_id AND user_id = auth.uid())
    );

-- Comments policies
CREATE POLICY "Comments are publicly readable" ON comments
    FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Status updates policies
CREATE POLICY "Status updates are publicly readable" ON status_updates
    FOR SELECT USING (TRUE);

CREATE POLICY "Authorities can create status updates" ON status_updates
    FOR INSERT WITH CHECK (
        EXISTS(SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'authority'))
    );

-- Issue votes policies
CREATE POLICY "Votes are publicly readable" ON issue_votes
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can vote on issues" ON issue_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their votes" ON issue_votes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their votes" ON issue_votes
    FOR DELETE USING (auth.uid() = user_id);

-- User bookmarks policies
CREATE POLICY "Users can view own bookmarks" ON user_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks" ON user_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON user_bookmarks
    FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE); -- Allow system to create notifications