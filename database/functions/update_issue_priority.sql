-- Function to calculate and update issue priority score
-- Priority is based on category, votes, and time since creation

CREATE OR REPLACE FUNCTION calculate_issue_priority(issue_id UUID)
RETURNS INTEGER AS $$
DECLARE
    issue_record RECORD;
    priority_score INTEGER := 0;
    days_old INTEGER;
    category_weight INTEGER;
    vote_score INTEGER;
BEGIN
    -- Get issue details
    SELECT i.category, i.upvotes, i.downvotes, i.created_at
    INTO issue_record
    FROM issues i
    WHERE i.id = issue_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Calculate days since creation
    days_old := EXTRACT(DAYS FROM NOW() - issue_record.created_at);
    
    -- Category weight
    CASE issue_record.category
        WHEN 'severe' THEN category_weight := 100;
        WHEN 'mild' THEN category_weight := 50;
        WHEN 'low' THEN category_weight := 25;
        ELSE category_weight := 25;
    END CASE;
    
    -- Vote score (upvotes - downvotes)
    vote_score := COALESCE(issue_record.upvotes, 0) - COALESCE(issue_record.downvotes, 0);
    
    -- Calculate priority: category weight + vote score - age penalty
    priority_score := category_weight + (vote_score * 5) - (days_old * 2);
    
    -- Ensure minimum score of 0
    IF priority_score < 0 THEN
        priority_score := 0;
    END IF;
    
    RETURN priority_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update priority score for an issue
CREATE OR REPLACE FUNCTION update_issue_priority(issue_id UUID)
RETURNS VOID AS $$
DECLARE
    new_priority INTEGER;
BEGIN
    new_priority := calculate_issue_priority(issue_id);
    
    UPDATE issues 
    SET priority_score = new_priority,
        updated_at = NOW()
    WHERE id = issue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update all issue priorities (for batch processing)
CREATE OR REPLACE FUNCTION update_all_issue_priorities()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
    issue_record RECORD;
BEGIN
    FOR issue_record IN SELECT id FROM issues WHERE status != 'resolved'
    LOOP
        PERFORM update_issue_priority(issue_record.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;