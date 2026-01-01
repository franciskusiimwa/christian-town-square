-- Add View Tracking System
-- Tracks unique views by IP address and user account
-- Prevents duplicate view counts within 24 hours

-- Step 1: Create question_views table
CREATE TABLE IF NOT EXISTS question_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_views_question_id ON question_views(question_id);
CREATE INDEX IF NOT EXISTS idx_question_views_viewer_ip ON question_views(viewer_ip);
CREATE INDEX IF NOT EXISTS idx_question_views_viewer_id ON question_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_question_views_viewed_at ON question_views(viewed_at);

-- Step 3: Enable RLS on question_views
ALTER TABLE question_views ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies if they exist
DROP POLICY IF EXISTS "question_views_select_policy" ON question_views;
DROP POLICY IF EXISTS "question_views_insert_policy" ON question_views;

-- Step 5: Create RLS policies for question_views
CREATE POLICY "question_views_select_policy" ON question_views
  FOR SELECT USING (true);

CREATE POLICY "question_views_insert_policy" ON question_views
  FOR INSERT WITH CHECK (true);

-- Step 6: Create function to record a view (only if not viewed recently)
CREATE OR REPLACE FUNCTION record_question_view(
  p_question_id UUID,
  p_viewer_ip TEXT,
  p_viewer_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_recent_view_exists BOOLEAN;
  v_time_threshold TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set threshold to 24 hours ago
  v_time_threshold := NOW() - INTERVAL '24 hours';

  -- Check if there's a recent view from this IP or user
  SELECT EXISTS(
    SELECT 1
    FROM question_views
    WHERE question_id = p_question_id
      AND viewed_at > v_time_threshold
      AND (
        (viewer_ip = p_viewer_ip) OR
        (p_viewer_id IS NOT NULL AND viewer_id = p_viewer_id)
      )
  ) INTO v_recent_view_exists;

  -- If no recent view exists, record the view
  IF NOT v_recent_view_exists THEN
    INSERT INTO question_views (question_id, viewer_ip, viewer_id)
    VALUES (p_question_id, p_viewer_ip, p_viewer_id);

    -- Increment the view count
    UPDATE questions
    SET view_count = view_count + 1
    WHERE id = p_question_id;

    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create function to clean up old view records (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_question_views()
RETURNS void AS $$
BEGIN
  -- Delete views older than 30 days (keep for analytics)
  DELETE FROM question_views
  WHERE viewed_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Verify the setup
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'question_views'
ORDER BY ordinal_position;
