-- Debug script to check answers in the database
-- Run this in Supabase SQL Editor to see what's happening

-- Step 1: Check if there are any answers
SELECT
  id,
  question_id,
  author_name,
  body,
  status,
  created_at
FROM answers
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Check questions and their answer counts
SELECT
  id,
  title,
  answer_count,
  (SELECT COUNT(*) FROM answers WHERE answers.question_id = questions.id AND answers.status = 'active') as actual_answer_count
FROM questions
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Fix any mismatched answer counts
UPDATE questions
SET answer_count = (
  SELECT COUNT(*)
  FROM answers
  WHERE answers.question_id = questions.id
  AND answers.status = 'active'
)
WHERE id IN (
  SELECT id FROM questions
);

-- Step 4: Verify the fix
SELECT
  id,
  title,
  answer_count,
  (SELECT COUNT(*) FROM answers WHERE answers.question_id = questions.id AND answers.status = 'active') as actual_answer_count
FROM questions
ORDER BY created_at DESC
LIMIT 10;
