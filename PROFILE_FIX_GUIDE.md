# Fix: Missing Profile Error When Posting Questions

## Error Message
```
{code: "23503", details: "Key is not present in table \"profiles\".",
 message: "insert or update on table \"questions\" violates foreign key constraint \"questions_author_id_fkey\""}
```

## What Causes This

This error occurs when:
1. A user is authenticated (signed in)
2. They try to post a question or answer
3. BUT their profile doesn't exist in the `profiles` table
4. The foreign key constraint fails because `author_id` references a non-existent profile

**Root Cause:** The database trigger that should create profiles for new users didn't fire, or the user signed up before the trigger was created.

---

## Solution 1: Run SQL Fix (Immediate Fix)

### Step 1: Run the SQL Script

1. Go to Supabase Dashboard → SQL Editor
2. Open the file: `fix-missing-profiles.sql`
3. Copy and paste the entire script
4. Click **Run**

This script will:
- ✅ Create profiles for all users that don't have them
- ✅ Verify the trigger exists and is correct
- ✅ Recreate the trigger to ensure it fires for new users
- ✅ Show you any orphaned questions (optional)

### Step 2: Verify Fix

After running the script:
1. Check the query results
2. Look for the message: "INSERT 0 X" (where X is number of profiles created)
3. If X > 0, profiles were created for existing users

---

## Solution 2: Frontend Auto-Fix (Already Implemented)

The code has been updated to automatically handle missing profiles:

### What It Does

When a user posts a question or answer:
1. **Checks** if their profile exists
2. **Creates** the profile if it's missing
3. **Falls back** to guest posting if profile creation fails
4. **Shows** a toast notification if posting as guest

### Files Updated

- ✅ `src/pages/AskQuestion.tsx` - Ensures profile exists before posting question
- ✅ `src/pages/QuestionDetail.tsx` - Ensures profile exists before posting answer

### Code Added

```typescript
// If user is authenticated, ensure their profile exists
if (user) {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  // If profile doesn't exist, create it
  if (profileError || !profileData) {
    console.log("Profile doesn't exist, creating one...");
    const { error: createError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username: username || user.email?.split("@")[0] || "User",
      });

    if (createError) {
      console.error("Failed to create profile:", createError);
      toast({
        title: "Posting as guest",
        description: "We couldn't link this to your account, posting as guest instead.",
      });
    }
  }
}
```

---

## Solution 3: Enable RLS Policy for Profile Creation (Optional)

If users still can't create profiles, you may need to add an RLS policy:

```sql
-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = id);
```

---

## Testing the Fix

### Test 1: Existing User
1. Sign in with an existing account
2. Try posting a question
3. Should work without errors

### Test 2: New User
1. Sign up with a new account
2. Verify email (if required)
3. Try posting a question
4. Should work without errors

### Test 3: Check Database
1. Go to Supabase → Table Editor → profiles
2. Verify all authenticated users have profiles
3. Count should match users in auth.users

---

## Prevention: Ensure Trigger is Working

The database trigger should automatically create profiles for new users.

### Verify Trigger Exists

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Check trigger function exists
SELECT * FROM pg_proc
WHERE proname = 'handle_new_user';
```

### Test Trigger Manually

```sql
-- This should be done automatically, but you can test:
SELECT handle_new_user();
```

---

## Understanding the Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  bio TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Questions Table (Foreign Key)
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- CAN BE NULL
  author_name TEXT NOT NULL,
  ...
);
```

**Key Point:** `author_id` CAN be NULL (for anonymous/guest posts), but if it's NOT NULL, it MUST reference a valid profile.

---

## Quick Checklist

If you encounter this error:

- [ ] Run `fix-missing-profiles.sql` in Supabase SQL Editor
- [ ] Verify trigger exists: Check `on_auth_user_created`
- [ ] Check profiles table: All users should have profiles
- [ ] Test posting: Try posting a question/answer
- [ ] Check console: Look for "Profile doesn't exist, creating one..." message
- [ ] Verify frontend code: Ensure latest code is deployed

---

## Common Issues

### Issue 1: "Profile doesn't exist" message keeps appearing

**Cause:** RLS policy prevents frontend from creating profiles

**Fix:** Add the RLS policy from Solution 3 above

### Issue 2: Trigger doesn't fire for new signups

**Cause:** Trigger was deleted or modified

**Fix:** Run the SQL fix script to recreate the trigger

### Issue 3: Some users have profiles, others don't

**Cause:** Trigger was added after some users signed up

**Fix:** Run the SQL fix script to backfill missing profiles

---

## For Development vs Production

### Development (localhost)
- The frontend auto-fix will handle this
- Check browser console for logs
- May see "Posting as guest" notifications

### Production
- Should run SQL fix script once
- Trigger should handle all new users
- Frontend auto-fix is backup safety net

---

## Summary

**The fix has 3 layers:**

1. **Database Trigger** (automatic, runs on signup)
   - Creates profile when user signs up
   - Should work for all new users

2. **SQL Fix Script** (one-time, backfills)
   - Creates profiles for existing users
   - Fixes the trigger if broken

3. **Frontend Auto-Fix** (safety net)
   - Checks profile exists before posting
   - Creates profile if missing
   - Falls back to guest if fails

---

**Your issue should now be fixed!**

Run the SQL script, deploy the updated code, and test posting a question.
