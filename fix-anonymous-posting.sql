-- Quick Fix for Anonymous Posting RLS Policy Issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop ALL existing policies on questions table
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
DROP POLICY IF EXISTS "Anyone can insert questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON questions;
DROP POLICY IF EXISTS "Users can insert questions" ON questions;
DROP POLICY IF EXISTS "Users can update their own questions" ON questions;
DROP POLICY IF EXISTS "Admins can update any question" ON questions;

-- Step 2: Drop ALL existing policies on answers table
DROP POLICY IF EXISTS "Answers are viewable by everyone" ON answers;
DROP POLICY IF EXISTS "Anyone can insert answers" ON answers;
DROP POLICY IF EXISTS "Authenticated users can insert answers" ON answers;
DROP POLICY IF EXISTS "Users can insert answers" ON answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON answers;
DROP POLICY IF EXISTS "Admins can update any answer" ON answers;

-- Step 3: Create NEW policies for questions
CREATE POLICY "questions_select_policy" ON questions
  FOR SELECT USING (true);

CREATE POLICY "questions_insert_policy" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "questions_update_own" ON questions
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "questions_update_admin" ON questions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Step 4: Create NEW policies for answers
CREATE POLICY "answers_select_policy" ON answers
  FOR SELECT USING (true);

CREATE POLICY "answers_insert_policy" ON answers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "answers_update_own" ON answers
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "answers_update_admin" ON answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Step 5: Verify RLS is enabled
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
