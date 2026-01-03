# Password Reset Flow - Implementation Guide

Complete password reset functionality has been implemented for Christian Town Square.

## ✅ What's Been Implemented

1. **Password Reset Request** - Users can request a password reset via email
2. **Email Template** - Professional, on-brand password reset email
3. **Secure Token Handling** - Uses Supabase's secure token system
4. **New Password Form** - Clean UI for setting a new password
5. **Validation** - Password confirmation and minimum length checks

## 🔄 How the Flow Works

### Step 1: User Requests Password Reset

1. User goes to `/auth` page
2. Clicks on "Reset" tab
3. Enters their email address
4. Clicks "Send Reset Link"

**What happens:**
- `resetPassword()` function is called
- Supabase sends an email using the `reset-password.html` template
- Email contains a secure link: `https://christiantownsquare.com/auth?token_hash=...&type=recovery`

### Step 2: User Receives Email

The user receives a professionally branded email with:
- Clear instructions
- Prominent "Reset Password" button
- Security notice (link expires in 1 hour)
- Fallback text link
- On-brand Christian Town Square styling

### Step 3: User Clicks Reset Link

When the user clicks the link in the email:
1. They're redirected to: `https://christiantownsquare.com/auth?token_hash=ABC123&type=recovery`
2. The Auth page detects `type=recovery` in the URL
3. Sets `isResettingPassword = true`
4. Shows the "Set New Password" form

### Step 4: User Sets New Password

1. User enters new password (minimum 8 characters)
2. User confirms the password
3. Clicks "Update Password"

**What happens:**
- Validates passwords match
- Validates minimum length (8 characters)
- Calls `updatePassword()` function
- Supabase updates the password
- User is signed in automatically
- Redirected to homepage

## 📁 Files Modified

### 1. `src/lib/auth-context.tsx`

Added two new functions:

```typescript
resetPassword: (email: string) => Promise<void>
updatePassword: (newPassword: string) => Promise<void>
```

**`resetPassword(email)`:**
- Sends password reset email using Supabase
- Uses `emailRedirectTo` to ensure correct redirect URL
- Works with both localhost and production

**`updatePassword(newPassword)`:**
- Updates the user's password
- Called when user submits the new password form

### 2. `src/pages/Auth.tsx`

Added:
- "Reset" tab to the auth page (3 tabs now: Sign In, Sign Up, Reset)
- Password reset request form
- New password form (shown when coming from email link)
- Token detection for `type=recovery`
- Password validation (match check, minimum length)

### 3. `email-templates/reset-password.html`

Professional email template with:
- Christian Town Square branding
- Clear call-to-action button
- Security notice about 1-hour expiration
- Fallback text link
- Mobile-responsive design

## 🧪 How to Test

### Test 1: Request Password Reset

1. Start dev server: `npm run dev`
2. Go to `http://localhost:8080/auth`
3. Click "Reset" tab
4. Enter a valid email address (one you can access)
5. Click "Send Reset Link"
6. Check your email (including spam folder)

**Expected Result:**
- Toast notification: "Password reset email sent!"
- Email arrives with professional branding
- Email has "Reset Password" button

### Test 2: Reset Password via Email

1. Open the password reset email
2. Click "Reset Password" button
3. Should redirect to: `http://localhost:8080/auth?token_hash=...&type=recovery`
4. Page should show "Set New Password" form

**Expected Result:**
- Page title: "Set New Password"
- Two password input fields
- "Update Password" button
- No sign-in/sign-up tabs visible

### Test 3: Set New Password

1. Enter a new password (at least 8 characters)
2. Confirm the password (enter same password again)
3. Click "Update Password"

**Expected Result:**
- Toast notification: "Password updated!"
- Automatically signed in
- Redirected to homepage

### Test 4: Sign In with New Password

1. Sign out
2. Go to `/auth`
3. Click "Sign In" tab
4. Enter email and NEW password
5. Click "Sign In"

**Expected Result:**
- Successfully signed in with new password
- Old password no longer works

## 🔒 Security Features

1. **Token Expiration:** Reset links expire after 1 hour
2. **One-Time Use:** Each reset token can only be used once
3. **Secure Transport:** Uses HTTPS in production
4. **Password Validation:** Minimum 8 characters required
5. **Email Verification:** Only sends to registered email addresses

## 🎨 UI/UX Features

1. **Three-Tab Layout:** Sign In, Sign Up, Reset
2. **Clear Visual Feedback:** Toast notifications for all actions
3. **Inline Validation:** Password match and length checks
4. **Loading States:** Buttons show "Sending..." and "Updating password..."
5. **Error Handling:** Clear error messages for all failure cases

## 📧 Email Configuration

### Required Supabase Settings

**1. URL Configuration** (Dashboard → Authentication → URL Configuration)

- **Site URL:** `https://christiantownsquare.com`
- **Redirect URLs:**
  ```
  http://localhost:8080/**
  https://christiantownsquare.com/**
  ```

**2. Email Template** (Dashboard → Authentication → Email Templates)

- Click "Reset Password" or "Recovery"
- Copy contents from `email-templates/reset-password.html`
- Paste into editor
- Click Save

## 🐛 Troubleshooting

### Email not arriving

**Check:**
1. ✅ Email is registered in the database
2. ✅ Spam/junk folder
3. ✅ Supabase email settings are enabled
4. ✅ Check Supabase logs (Dashboard → Logs → Auth Logs)

**Solution:**
- Wait 1-2 minutes for email to arrive
- Check Supabase auth logs for errors
- Verify email provider settings in Supabase

### "Invalid or expired link" error

**Cause:** Token has expired (>1 hour old) or already been used

**Solution:**
- Request a new password reset
- Use the link within 1 hour
- Each link can only be used once

### Password not updating

**Check:**
1. ✅ Both passwords match
2. ✅ Password is at least 8 characters
3. ✅ You clicked the link from the email (has `type=recovery` in URL)

**Solution:**
- Check browser console for errors
- Make sure you're coming from the email link
- Try requesting a new reset link

### Redirects to localhost instead of production

**Cause:** `VITE_SITE_URL` not set in production environment

**Solution:**
1. Set `VITE_SITE_URL=https://christiantownsquare.com` in production env vars
2. Rebuild and redeploy
3. Verify Supabase Site URL is set to production domain

## 📝 Code Examples

### Requesting Password Reset (Frontend)

```typescript
const handleResetPassword = async (email: string) => {
  try {
    await resetPassword(email);
    // Email sent successfully
  } catch (error) {
    // Handle error
  }
};
```

### Updating Password (Frontend)

```typescript
const handleUpdatePassword = async (newPassword: string) => {
  try {
    await updatePassword(newPassword);
    // Password updated successfully
    // User is automatically signed in
  } catch (error) {
    // Handle error
  }
};
```

### Auth Context Integration

```typescript
const { resetPassword, updatePassword } = useAuth();

// Request reset
await resetPassword('user@example.com');

// Update password (after clicking email link)
await updatePassword('newSecurePassword123');
```

## 🚀 Production Deployment

Before deploying to production:

1. **Set Environment Variable:**
   ```
   VITE_SITE_URL=https://christiantownsquare.com
   ```

2. **Configure Supabase:**
   - Site URL: `https://christiantownsquare.com`
   - Add to Redirect URLs: `https://christiantownsquare.com/**`

3. **Upload Email Template:**
   - Go to Supabase Dashboard → Email Templates
   - Upload `reset-password.html`

4. **Test in Production:**
   - Request password reset from production site
   - Verify email contains production URL
   - Verify reset flow works end-to-end

## 📊 User Flow Diagram

```
User Forgot Password
        ↓
  Goes to /auth
        ↓
  Clicks "Reset" Tab
        ↓
  Enters Email
        ↓
  Clicks "Send Reset Link"
        ↓
  Receives Email
        ↓
  Clicks "Reset Password" Button
        ↓
  Redirected to /auth?token_hash=...&type=recovery
        ↓
  Sees "Set New Password" Form
        ↓
  Enters New Password (2x)
        ↓
  Clicks "Update Password"
        ↓
  Password Updated
        ↓
  Automatically Signed In
        ↓
  Redirected to Homepage
```

## ✨ Next Steps

1. **Test the flow** on localhost
2. **Upload email template** to Supabase
3. **Test with real email** to verify email delivery
4. **Deploy to production** with correct environment variables
5. **Test in production** to verify end-to-end flow

---

**Last Updated:** January 2025
**Status:** ✅ Fully Implemented and Ready for Testing
