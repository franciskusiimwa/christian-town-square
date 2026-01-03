# Supabase Email Configuration Guide

Complete guide to configure email redirects and custom sender names in Supabase.

## Part 1: Configure Email Redirects (Fix localhost issue)

### Step 1: Configure Site URL

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Set the **Site URL** to your production domain:
   ```
   https://christiantownsquare.com
   ```
   ⚠️ **IMPORTANT:** No trailing slash!

### Step 2: Configure Redirect URLs

In the same **URL Configuration** page, scroll to **Redirect URLs** section.

Add the following URLs (each on a separate line):

```
http://localhost:8080/auth
https://christiantownsquare.com/auth
```

⚠️ **CRITICAL REQUIREMENTS:**
- URLs must be EXACT matches (no trailing slashes unless your code uses them)
- You can also use wildcards for flexibility:
  ```
  http://localhost:8080/**
  https://christiantownsquare.com/**
  ```

### Step 3: Save Configuration

1. Click **Save** at the bottom of the page
2. Wait 1-2 minutes for changes to propagate

### Step 4: Test the Configuration

1. **Development Test:**
   - Make sure your `.env` has: `VITE_SITE_URL=` (blank or localhost)
   - Run `npm run dev`
   - Sign up with a test email
   - Check email - should contain `http://localhost:8080/auth`

2. **Production Test:**
   - Make sure your production `.env` has: `VITE_SITE_URL=https://christiantownsquare.com`
   - Deploy to production
   - Sign up with a test email
   - Check email - should contain `https://christiantownsquare.com/auth`

---

## Part 2: Custom Email Sender Name

By default, Supabase sends emails from `noreply@mail.app.supabase.io`. To use a custom sender name and email:

### Option A: Custom SMTP (Recommended)

#### Step 1: Access SMTP Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Authentication**
4. Scroll down to **SMTP Settings** section

#### Step 2: Enable Custom SMTP

1. Toggle **Enable Custom SMTP** to **ON**

#### Step 3: Configure SMTP Provider

Choose an SMTP provider (recommended options):

**Resend** (Easy setup, generous free tier):
- Sign up at [resend.com](https://resend.com)
- Get your API key
- In Supabase SMTP Settings:
  - **Host:** `smtp.resend.com`
  - **Port:** `465` or `587`
  - **Username:** `resend`
  - **Password:** Your Resend API key
  - **Sender email:** `noreply@christiantownsquare.com` (must verify domain first)
  - **Sender name:** `Christian Town Square`

**SendGrid** (Alternative):
- Sign up at [sendgrid.com](https://sendgrid.com)
- Create API key
- In Supabase SMTP Settings:
  - **Host:** `smtp.sendgrid.net`
  - **Port:** `587`
  - **Username:** `apikey`
  - **Password:** Your SendGrid API key
  - **Sender email:** `noreply@christiantownsquare.com`
  - **Sender name:** `Christian Town Square`

**Gmail** (Development only):
- **Host:** `smtp.gmail.com`
- **Port:** `587`
- **Username:** Your Gmail address
- **Password:** App-specific password (not your regular password)
- **Sender email:** Your Gmail address
- **Sender name:** `Christian Town Square`

#### Step 4: Verify Domain (For custom email)

To use `@christiantownsquare.com` email addresses:

1. Add DNS records in your domain registrar (GoDaddy, Namecheap, etc.)
2. Your SMTP provider will give you specific DNS records to add
3. Wait for DNS propagation (can take 24-48 hours)

#### Step 5: Test Email Sending

1. Click **Save** in SMTP Settings
2. Try signing up with a test account
3. Check that emails arrive from your custom sender name

### Option B: Use Supabase Default SMTP with Custom Name

If you don't want to set up custom SMTP but want a better sender name:

1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. You can customize the email content but **cannot change the sender name** with default SMTP
3. Emails will still come from `noreply@mail.app.supabase.io`

**Limitation:** You MUST use custom SMTP to change the sender name.

---

## Part 3: Customize Email Templates

### Access Email Templates

1. Go to **Authentication** → **Email Templates**
2. You'll see templates for:
   - Confirm signup
   - Magic link
   - Change email address
   - Reset password

### Customize the Templates

Example for **Confirm signup** template:

```html
<h2>Confirm your signup</h2>

<p>Welcome to Christian Town Square!</p>

<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>

<p>If you didn't sign up for an account, you can safely ignore this email.</p>

<p>Best regards,<br>The Christian Town Square Team</p>
```

**Available variables:**
- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Token }}` - The token (if you want to build custom UI)
- `{{ .TokenHash }}` - The token hash
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - Recipient's email

---

## Troubleshooting

### Email still shows localhost

**Check:**
1. ✅ `VITE_SITE_URL` is set to `https://christiantownsquare.com` in production
2. ✅ You rebuilt and redeployed after changing the env variable
3. ✅ Site URL in Supabase dashboard is set to production domain
4. ✅ Redirect URLs include `https://christiantownsquare.com/auth`
5. ✅ No trailing slashes in URLs
6. ✅ Waited 2 minutes after saving Supabase settings

**Solution:** Clear your browser cache and test with a fresh email address

### "Invalid redirect URL" error

**Cause:** The URL is not in the allowed Redirect URLs list

**Solution:**
1. Go to Authentication → URL Configuration
2. Add the exact URL: `https://christiantownsquare.com/auth`
3. Or use wildcard: `https://christiantownsquare.com/**`

### Emails not arriving

**Check:**
1. ✅ Spam folder
2. ✅ SMTP credentials are correct
3. ✅ Domain is verified (for custom email addresses)
4. ✅ Supabase logs: Dashboard → Logs → Auth Logs

### Custom sender name not showing

**Cause:** You're using default Supabase SMTP

**Solution:** You MUST configure Custom SMTP to use a custom sender name. Default SMTP always uses `noreply@mail.app.supabase.io`.

---

## Quick Reference

### Environment Variables (.env)

```env
# Production
VITE_SITE_URL=https://christiantownsquare.com

# Development (leave blank)
VITE_SITE_URL=
```

### Supabase Dashboard Settings

**Authentication → URL Configuration:**
- Site URL: `https://christiantownsquare.com`
- Redirect URLs:
  ```
  http://localhost:8080/**
  https://christiantownsquare.com/**
  ```

**Settings → Authentication → SMTP Settings:**
- Enable Custom SMTP: ON
- Sender email: `noreply@christiantownsquare.com`
- Sender name: `Christian Town Square`
- (Plus your SMTP provider settings)

---

## Related Documentation

- [Supabase Auth signUp API](https://supabase.com/docs/reference/javascript/auth-signup)
- [Redirect URLs Guide](https://supabase.com/docs/guides/auth/redirect-urls)
- [Custom SMTP Setup](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
