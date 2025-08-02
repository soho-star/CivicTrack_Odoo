-- Database triggers for automated functionality

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to relevant tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at 
    BEFORE UPDATE ON issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create status update when issue status changes
CREATE OR REPLACE FUNCTION create_status_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create status update if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO status_updates (issue_id, old_status, new_status, updated_by, notes)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.user_id, 'Status updated automatically');
        
        -- Update priority score when status changes
        PERFORM update_issue_priority(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_status_change_trigger
    AFTER UPDATE ON issues
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION create_status_update();

-- Trigger to update vote counts when votes are added/removed/changed
CREATE OR REPLACE FUNCTION update_issue_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- New vote
        IF NEW.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        ELSIF NEW.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        END IF;
        
        -- Update priority after vote change
        PERFORM update_issue_priority(NEW.issue_id);
        
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Vote type changed
        IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
            UPDATE issues SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.issue_id;
        END IF;
        
        -- Update priority after vote change
        PERFORM update_issue_priority(NEW.issue_id);
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Vote removed
        IF OLD.vote_type = 'upvote' THEN
            UPDATE issues SET upvotes = upvotes - 1 WHERE id = OLD.issue_id;
        ELSIF OLD.vote_type = 'downvote' THEN
            UPDATE issues SET downvotes = downvotes - 1 WHERE id = OLD.issue_id;
        END IF;
        
        -- Update priority after vote change
        PERFORM update_issue_priority(OLD.issue_id);
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_vote_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON issue_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_issue_vote_counts();

-- Trigger to create notifications for issue updates
CREATE OR REPLACE FUNCTION create_issue_notification()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    notification_type TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- New issue created - notify nearby users (this would be handled by application logic)
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Issue updated
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            notification_type := 'status_update';
            notification_title := 'Issue Status Updated';
            notification_message := 'Your reported issue "' || NEW.title || '" status changed to ' || NEW.status;
            
            -- Notify the issue reporter
            INSERT INTO notifications (user_id, issue_id, type, title, message)
            VALUES (NEW.user_id, NEW.id, notification_type, notification_title, notification_message);
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER issue_notification_trigger
    AFTER INSERT OR UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION create_issue_notification();

-- Trigger to create notifications for new comments
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
    issue_title TEXT;
    issue_user_id UUID;
    notification_title TEXT;
    notification_message TEXT;
BEGIN
    -- Get issue details
    SELECT title, user_id INTO issue_title, issue_user_id
    FROM issues WHERE id = NEW.issue_id;
    
    -- Don't notify if the commenter is the issue owner
    IF NEW.user_id != issue_user_id THEN
        notification_title := 'New Comment on Your Issue';
        notification_message := 'Someone commented on your issue "' || issue_title || '"';
        
        INSERT INTO notifications (user_id, issue_id, type, title, message)
        VALUES (issue_user_id, NEW.issue_id, 'new_comment', notification_title, notification_message);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_notification_trigger
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION create_comment_notification();