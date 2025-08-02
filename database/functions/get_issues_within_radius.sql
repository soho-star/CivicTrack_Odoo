-- Function to get issues within a specified radius
-- This is the main function for location-based issue discovery

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
    updated_at TIMESTAMP WITH TIME ZONE,
    user_id UUID,
    user_name VARCHAR,
    user_avatar_url TEXT,
    address TEXT,
    location_lat FLOAT,
    location_lng FLOAT
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
        i.updated_at,
        i.user_id,
        u.name as user_name,
        u.avatar_url as user_avatar_url,
        i.address,
        ST_Y(i.location) as location_lat,
        ST_X(i.location) as location_lng
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
$$ LANGUAGE plpgsql SECURITY DEFINER;