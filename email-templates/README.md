# Email Templates for Christian Town Square

Professional, on-brand email templates for Supabase authentication.

## Templates Included

1. **confirm-signup.html** - Email confirmation for new user registrations
2. **reset-password.html** - Password reset requests
3. **magic-link.html** - Passwordless login (magic link)
4. **change-email.html** - Email address change confirmation

## Design Features

✅ **On-Brand Styling:**
- Warm parchment color scheme (#f9f7f4 background)
- Navy blue accents (#1e3a5f) matching the site
- Georgia/serif fonts for headings (brand consistency)
- Professional sans-serif for body text (readability)

✅ **Mobile-Responsive:**
- Works perfectly on all devices
- Table-based layout for maximum email client compatibility
- Optimized for Gmail, Outlook, Apple Mail, etc.

✅ **Secure & Clear:**
- Prominent call-to-action buttons
- Fallback text links for accessibility
- Security notices where appropriate
- Professional footer with links

## How to Upload to Supabase

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `mmheiutwxtqhckdrfcey`
3. Navigate to **Authentication** → **Email Templates**

### Step 2: Upload Each Template

For each template, follow these steps:

#### A. Confirm Signup Template

1. Click on **"Confirm signup"** in the email templates list
2. Copy the contents of `confirm-signup.html`
3. Paste into the template editor
4. Click **Save**

#### B. Reset Password Template

1. Click on **"Reset password"** (or "Recovery")
2. Copy the contents of `reset-password.html`
3. Paste into the template editor
4. Click **Save**

#### C. Magic Link Template

1. Click on **"Magic Link"**
2. Copy the contents of `magic-link.html`
3. Paste into the template editor
4. Click **Save**

#### D. Change Email Template

1. Click on **"Change Email Address"** (or similar)
2. Copy the contents of `change-email.html`
3. Paste into the template editor
4. Click **Save**

### Step 3: Test Your Templates

After uploading:

1. **Test Signup:** Create a new account and check the email
2. **Test Password Reset:** Request a password reset
3. **Check Rendering:** Open emails in different clients (Gmail, Outlook, etc.)
4. **Verify Links:** Make sure all `{{ .ConfirmationURL }}` links work correctly

## Template Variables

These Supabase variables are automatically replaced when emails are sent:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ .ConfirmationURL }}` | Full confirmation URL with token | `https://christiantownsquare.com/auth?token_hash=...` |
| `{{ .Token }}` | The raw token | `abc123...` |
| `{{ .TokenHash }}` | The token hash | `def456...` |
| `{{ .SiteURL }}` | Your site URL from settings | `https://christiantownsquare.com` |
| `{{ .Email }}` | Recipient's email address | `user@example.com` |

**⚠️ Important:** Never modify the variable syntax `{{ .VariableName }}` - Supabase needs this exact format.

## Customization

You can customize these templates further:

### Change Colors

Find and replace these color codes:

- **Navy Blue (Primary):** `#1e3a5f` → Your color
- **Parchment Background:** `#f9f7f4` → Your color
- **Text Color:** `#2c2415` → Your color
- **Border Color:** `#e5dfd6` → Your color

### Change Links

Update footer links to match your actual pages:
- `/guidelines` - Community Guidelines page
- `/privacy` - Privacy Policy page
- `/about` - About/Contact page

### Change Branding

1. Update the header title: `Christian Town Square`
2. Update the tagline: `Honest Questions. Thoughtful Answers.`
3. Update the copyright year and name

## Preview in Email Clients

These templates are tested and work in:

- ✅ Gmail (Web & Mobile)
- ✅ Apple Mail (macOS & iOS)
- ✅ Outlook (Web & Desktop)
- ✅ Yahoo Mail
- ✅ Proton Mail
- ✅ Thunderbird

## Troubleshooting

### Images/Icons Not Showing

These templates use Unicode emojis (⚠️, 🔒, 📧) which work across all email clients. No external images needed!

### Links Not Working

Make sure you've configured:
1. **Site URL** in Supabase: `https://christiantownsquare.com`
2. **Redirect URLs** include: `https://christiantownsquare.com/**`
3. Your `.env` has: `VITE_SITE_URL=https://christiantownsquare.com`

### Styling Looks Different

Email clients have limited CSS support. These templates use inline styles and table-based layouts for maximum compatibility. Don't use:
- Flexbox or Grid
- External CSS files
- Modern CSS features

### Plain Text Version

Supabase automatically generates a plain text version from your HTML. The templates are designed to degrade gracefully to plain text.

## Best Practices

✅ **Do:**
- Keep templates under 102KB (Gmail limit)
- Use inline CSS styles
- Test in multiple email clients
- Include both button and text link versions
- Use table-based layouts

❌ **Don't:**
- Use JavaScript (it won't work)
- Link to external stylesheets
- Use background images (limited support)
- Forget to test the confirmation URL
- Use forms in emails

## Support

If you encounter issues:

1. Check Supabase Auth Logs: Dashboard → Logs → Auth Logs
2. Verify email settings: Dashboard → Authentication → Providers → Email
3. Test with different email providers
4. Check spam/junk folders

---

**Last Updated:** January 2025
**Compatible with:** Supabase Auth v2.x
**Email Template Version:** 1.0
