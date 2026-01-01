-- Fix NOT NULL constraint on author_id columns
-- Run this in Supabase SQL Editor

-- Step 1: Make author_id nullable in questions table
ALTER TABLE questions
  ALTER COLUMN author_id DROP NOT NULL;

-- Step 2: Make author_id nullable in answers table
ALTER TABLE answers
  ALTER COLUMN author_id DROP NOT NULL;

-- Step 3: Update foreign key constraints to allow NULL with SET NULL on delete
ALTER TABLE questions
  DROP CONSTRAINT IF EXISTS questions_author_id_fkey;

ALTER TABLE questions
  ADD CONSTRAINT questions_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

ALTER TABLE answers
  DROP CONSTRAINT IF EXISTS answers_author_id_fkey;

ALTER TABLE answers
  ADD CONSTRAINT answers_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- Verify the changes
SELECT
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'questions'
  AND column_name = 'author_id';

SELECT
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'answers'
  AND column_name = 'author_id';
