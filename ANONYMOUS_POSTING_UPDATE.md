# Anonymous Posting Update - Migration Guide

## What Changed

The system now allows **anyone to post questions and answers without signing in**. This makes your platform more accessible and encourages participation from visitors.

## ✅ What You Need to Do

### Option 1: Fresh Start (Recommended if you have no important data)

If you don't have any important data in your database:

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Delete all tables:**
   ```sql
   DROP TABLE IF EXISTS answers CASCADE;
   DROP TABLE IF EXISTS questions CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
   ```

3. **Run the updated setup script:**
   - Copy ALL contents from `supabase-setup.sql`
   - Paste and run in SQL Editor
   - This creates tables with anonymous support

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

5. **Test it:**
   - Go to http://localhost:8080
   - Click "Ask a Question"
   - You'll see a "Your Name" field (no login required!)
   - Post a question or answer without signing in

---

### Option 2: Migrate Existing Data

If you have data you want to keep:

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Run this migration SQL:**

```sql
-- Step 1: Make author_id nullable in questions table
ALTER TABLE questions
  ALTER COLUMN author_id DROP NOT NULL;

ALTER TABLE questions
  ALTER COLUMN author_id SET DEFAULT NULL;

ALTER TABLE questions
  ALTER COLUMN author_name SET DEFAULT 'Anonymous';

-- Change foreign key constraint to allow NULL
ALTER TABLE questions
  DROP CONSTRAINT IF EXISTS questions_author_id_fkey;

ALTER TABLE questions
  ADD CONSTRAINT questions_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- Step 2: Make author_id nullable in answers table
ALTER TABLE answers
  ALTER COLUMN author_id DROP NOT NULL;

ALTER TABLE answers
  ALTER COLUMN author_id SET DEFAULT NULL;

ALTER TABLE answers
  ALTER COLUMN author_name SET DEFAULT 'Anonymous';

-- Change foreign key constraint to allow NULL
ALTER TABLE answers
  DROP CONSTRAINT IF EXISTS answers_author_id_fkey;

ALTER TABLE answers
  ADD CONSTRAINT answers_author_id_fkey
  FOREIGN KEY (author_id)
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- Step 3: Update RLS policies for questions
DROP POLICY IF EXISTS "Authenticated users can insert questions" ON questions;
CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT WITH CHECK (true);

-- Step 4: Update RLS policies for answers
DROP POLICY IF EXISTS "Authenticated users can insert answers" ON answers;
CREATE POLICY "Anyone can insert answers" ON answers
  FOR INSERT WITH CHECK (true);
```

3. **Verify the migration:**
   - Go to **Table Editor** → **questions**
   - Check that `author_id` column allows NULL
   - Check that `author_name` has default value 'Anonymous'

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

---

## 🎯 How It Works Now

### For Questions:

**Without Login:**
- User sees "Your Name" field at the top of the form
- Must enter a name (or check "Post anonymously")
- Question is saved with `author_id = NULL`

**With Login:**
- No name field needed
- Uses their username automatically
- Question is saved with their `author_id`

**Anonymous Option:**
- Available to both logged-in and guest users
- Shows as "Anonymous" regardless
- Guests can skip name field when anonymous

### For Answers:

**Without Login:**
- User sees "Your Name" field above the answer box
- Must enter a name to post
- Answer is saved with `author_id = NULL`

**With Login:**
- No name field shown
- Uses their username automatically
- Answer is saved with their `author_id`

---

## 🔍 Database Changes Summary

### questions table:
- ✅ `author_id` is now **nullable** (allows NULL)
- ✅ Foreign key changed to `ON DELETE SET NULL`
- ✅ `author_name` defaults to 'Anonymous'

### answers table:
- ✅ `author_id` is now **nullable** (allows NULL)
- ✅ Foreign key changed to `ON DELETE SET NULL`
- ✅ `author_name` defaults to 'Anonymous'

### RLS Policies:
- ✅ Questions: "Anyone can insert" (no auth required)
- ✅ Answers: "Anyone can insert" (no auth required)
- ✅ Profiles: Unchanged (still require auth for updates)

---

## 🧪 Testing Checklist

After migration, test these scenarios:

### Guest User (Not Logged In):
- [ ] Go to homepage
- [ ] Click "Ask a Question"
- [ ] See "Your Name" field at top
- [ ] Enter name and post question
- [ ] Question appears on homepage
- [ ] Click on question
- [ ] See "Your Name" field above answer box
- [ ] Post an answer with your name
- [ ] Answer appears immediately

### Guest with Anonymous:
- [ ] Click "Ask a Question"
- [ ] Enable "Post anonymously" toggle
- [ ] Name field should be disabled
- [ ] Post question
- [ ] Should show as "Anonymous"

### Logged In User:
- [ ] Sign in
- [ ] Click "Ask a Question"
- [ ] NO "Your Name" field (uses username)
- [ ] Post question
- [ ] Shows your username
- [ ] Post answer
- [ ] Shows your username

### Admin:
- [ ] Access admin dashboard
- [ ] See both authenticated and anonymous posts
- [ ] Can delete/moderate all content
- [ ] Can pin/verify answers

---

## ⚠️ Important Notes

1. **Existing Data:** If you ran the migration (Option 2), all your existing questions and answers will still work. They have `author_id` values pointing to user profiles.

2. **Mixed Content:** Your database will now contain:
   - Old posts: `author_id = UUID` (from logged-in users)
   - New posts: `author_id = NULL` (from guests)
   - Both types work seamlessly together!

3. **Admin Powers:** Admins can still moderate ALL content, including anonymous posts.

4. **No Spam Protection:** Since anyone can post, you might want to add:
   - Rate limiting
   - CAPTCHA
   - Content moderation tools
   - (These are not implemented yet)

---

## 🚀 Next Steps

Optional improvements you might want to add:

1. **Rate Limiting:** Prevent spam by limiting posts per IP
2. **Email Notifications:** Let users subscribe to answer notifications
3. **Search:** Add search functionality for questions
4. **Tags:** Allow custom tags beyond the predefined topics
5. **Voting:** Let guests vote on answers (currently requires account)

---

## Need Help?

If you encounter errors:

1. Check browser console for error messages
2. Check Supabase Dashboard → Logs
3. Verify RLS policies are applied correctly
4. Make sure you restarted dev server after migration
5. See `FIX_RLS_ERROR.md` for common RLS issues
