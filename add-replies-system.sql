-- Add Reply System for Answers
-- Allows users to reply to answers, creating threaded conversations

-- Step 1: Create replies table
CREATE TABLE IF NOT EXISTS replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  answer_id UUID NOT NULL REFERENCES answers(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'Guest',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_replies_answer_id ON replies(answer_id);
CREATE INDEX IF NOT EXISTS idx_replies_author_id ON replies(author_id);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON replies(created_at);
CREATE INDEX IF NOT EXISTS idx_replies_status ON replies(status);

-- Step 3: Enable RLS on replies
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for replies
-- Allow anyone to view active replies
CREATE POLICY "replies_select_policy" ON replies
  FOR SELECT USING (status = 'active');

-- Allow anyone (authenticated or not) to insert replies
CREATE POLICY "replies_insert_policy" ON replies
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own replies
CREATE POLICY "replies_update_own_policy" ON replies
  FOR UPDATE USING (
    auth.uid() = author_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Allow users to delete their own replies (soft delete)
CREATE POLICY "replies_delete_policy" ON replies
  FOR UPDATE USING (
    auth.uid() = author_id OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true)
  );

-- Step 5: Create function to update timestamp
CREATE OR REPLACE FUNCTION update_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger for updated_at
CREATE TRIGGER trigger_replies_updated_at
  BEFORE UPDATE ON replies
  FOR EACH ROW
  EXECUTE FUNCTION update_replies_updated_at();

-- Step 7: Verify the setup
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'replies'
ORDER BY ordinal_position;
