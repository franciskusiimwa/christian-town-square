# Supabase Setup Guide

This guide will help you set up Supabase for the Christian Town Square application.

> **✨ Anonymous Posting Enabled:** This setup supports posting questions and answers without signing in. Users can participate as guests by providing just their name.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Create Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - Name: Christian Town Square
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"
5. Wait for the project to be provisioned (this takes a few minutes)

## Step 2: Set Up Database Tables

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the `supabase-setup.sql` file from this repository
4. **IMPORTANT**: Before running, update line 135 in the SQL file:
   ```sql
   admin_email := 'franciskusiimwa@gmail.com'; -- Change this to YOUR email
   ```
5. Copy all the SQL code from that file
6. Paste it into the SQL Editor
7. Click "Run" to execute the SQL

This will create:
- `profiles` table for user data
- `questions` table for all questions
- `answers` table for all answers/comments
- Proper indexes for performance
- Row Level Security (RLS) policies
- Triggers for automatic timestamp updates
- **Auto-profile creation trigger** (creates profile when user signs up)

## Step 3: Configure Environment Variables

1. In your Supabase project dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" under Project Settings
3. You'll see two important values:
   - **Project URL** - Copy this
   - **anon public** key - Copy this (under "Project API keys")

4. Open the `.env` file in the root of this project
5. Replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_ADMIN_EMAIL=your_email@example.com
   ```

## Step 4: Set Up Admin Access

The `VITE_ADMIN_EMAIL` in your `.env` file determines who has admin access.

**Option 1: Auto-Admin on Signup**
- When you sign up with the email specified in `VITE_ADMIN_EMAIL`, you'll automatically be set as admin

**Option 2: Manual Admin Assignment**
1. Sign up for an account in your app
2. Go to Supabase Dashboard → Table Editor → `profiles`
3. Find your user row
4. Set `is_admin` to `true`

## Step 5: Configure Authentication

1. In Supabase Dashboard, go to "Authentication" → "Providers"
2. Enable "Email" provider (should be enabled by default)
3. Configure email templates if desired:
   - Go to "Authentication" → "Email Templates"
   - Customize the confirmation email, password reset, etc.

## Step 6: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8080

3. Test the following:
   - ✅ Sign up with a new account
   - ✅ Check your email for confirmation (if email confirmation is enabled)
   - ✅ Sign in with your account
   - ✅ Post a new question
   - ✅ Post an answer to a question
   - ✅ Access the admin dashboard (footer should show "Admin" link if you're an admin)

## Optional: Configure Email Settings

For production, you'll want to configure a custom SMTP provider:

1. Go to "Authentication" → "Settings" in Supabase
2. Scroll to "SMTP Settings"
3. Enter your SMTP provider details (e.g., SendGrid, Mailgun, AWS SES)

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only edit their own content
- ✅ Admins can moderate all content
- ✅ The `.env` file is gitignored to protect your keys
- ⚠️ **Never commit your `.env` file to version control**
- ⚠️ **Never expose your service role key (only use the anon key in frontend)**

## Database Schema Overview

### profiles
- User account information
- Links to Supabase auth.users
- `is_admin` flag for admin privileges

### questions
- All questions posted by users
- Supports anonymous posting
- Tracks view count and answer count
- Can be soft-deleted (status: 'deleted')

### answers
- All answers/comments to questions
- Voting system (upvotes)
- Verification and pinning by admins
- Can be soft-deleted

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env` file exists in the root directory
- Check that variables start with `VITE_`
- Restart your dev server after changing `.env`

### "new row violates row-level security policy for table 'profiles'" error
- This means the trigger isn't set up correctly
- Go to SQL Editor and run the trigger creation code from `supabase-setup.sql`
- Make sure you updated the admin email in the trigger function
- See `FIX_RLS_ERROR.md` for detailed fix instructions

### "over_email_send_rate_limit" error
- Wait 60 seconds between signup attempts
- OR disable email confirmation in Auth settings (for development only)
- OR use different email addresses for testing

### Can't sign in
- Check Supabase Dashboard → Authentication → Users to see if user was created
- Check email confirmation settings (you may want to disable for development)
- Check browser console for errors
- Make sure user has a corresponding profile in the profiles table

### Questions/Answers not showing
- Check Supabase Dashboard → Table Editor to see if data was inserted
- Check browser console for RLS policy errors
- Make sure status is 'active' not 'deleted'

### Admin dashboard not accessible
- Verify `VITE_ADMIN_EMAIL` matches your logged-in email
- Check `profiles` table to ensure `is_admin` is true
- Sign out and sign back in to refresh admin status

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
