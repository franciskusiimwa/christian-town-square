-- Automatic Answer Count Update
-- This creates a trigger that automatically updates answer_count when answers are added/removed

-- Step 1: Create function to update answer count
CREATE OR REPLACE FUNCTION update_question_answer_count()
RETURNS TRIGGER AS $$
BEGIN
  -- When an answer is inserted or its status changes to active
  IF (TG_OP = 'INSERT' AND NEW.status = 'active') OR
     (TG_OP = 'UPDATE' AND OLD.status != 'active' AND NEW.status = 'active') THEN
    UPDATE questions
    SET answer_count = answer_count + 1
    WHERE id = NEW.question_id;

  -- When an answer is deleted or its status changes to deleted
  ELSIF (TG_OP = 'DELETE' AND OLD.status = 'active') OR
        (TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active') THEN
    UPDATE questions
    SET answer_count = GREATEST(answer_count - 1, 0)
    WHERE id = COALESCE(NEW.question_id, OLD.question_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Step 2: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_answer_count ON answers;

-- Step 3: Create trigger on answers table
CREATE TRIGGER trigger_update_answer_count
  AFTER INSERT OR UPDATE OR DELETE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_question_answer_count();

-- Step 4: Fix existing answer counts
UPDATE questions
SET answer_count = (
  SELECT COUNT(*)
  FROM answers
  WHERE answers.question_id = questions.id
  AND answers.status = 'active'
);

-- Step 5: Verify it works
SELECT
  q.id,
  q.title,
  q.answer_count,
  COUNT(a.id) as actual_count
FROM questions q
LEFT JOIN answers a ON a.question_id = q.id AND a.status = 'active'
GROUP BY q.id, q.title, q.answer_count
ORDER BY q.created_at DESC
LIMIT 10;
