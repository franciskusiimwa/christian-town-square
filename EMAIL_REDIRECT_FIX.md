# Email Redirect URL Fix

This document explains how the confirmation email redirect URL has been fixed to work with both localhost (development) and production domains.

## Code Changes

### 1. Updated `src/lib/auth-context.tsx`

Added a `getRedirectUrl()` function that:
- Uses `VITE_SITE_URL` environment variable if set (for production)
- Falls back to `window.location.origin` if not set (works for both localhost and production)
- Appends `/auth` as the redirect path

The `signUp` function now includes `emailRedirectTo` option to ensure confirmation emails use the correct URL.

### 2. Updated `.env`

Added `VITE_SITE_URL` environment variable:
```env
VITE_SITE_URL=
```

**For Development:**
- Leave blank or set to `http://localhost:8080`
- The code will automatically use `window.location.origin`

**For Production:**
- Set to your production domain: `https://yourdomain.com`
- Example: `VITE_SITE_URL=https://christiansquare.com`

## Supabase Dashboard Configuration (IMPORTANT)

You also need to configure your Supabase project settings:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following settings:

### Site URL
Set this to your **production domain**:
```
https://yourdomain.com
```

### Redirect URLs
Add both localhost and production URLs to allow redirects from both:
```
http://localhost:8080/auth
http://localhost:8080/**
https://yourdomain.com/auth
https://yourdomain.com/**
```

The `**` wildcard allows any path under that domain.

## How It Works

### Development (localhost)
1. User signs up on `http://localhost:8080`
2. Code uses `window.location.origin` → `http://localhost:8080`
3. Supabase sends confirmation email with link: `http://localhost:8080/auth?token=...`
4. User clicks link and is redirected to localhost auth page
5. Auth page processes the token and logs user in

### Production
1. Set `VITE_SITE_URL=https://yourdomain.com` in production environment
2. User signs up on `https://yourdomain.com`
3. Code uses `VITE_SITE_URL` → `https://yourdomain.com`
4. Supabase sends confirmation email with link: `https://yourdomain.com/auth?token=...`
5. User clicks link and is redirected to production auth page
6. Auth page processes the token and logs user in

## Deployment Checklist

When deploying to production (Vercel, Netlify, etc.):

- [ ] Set `VITE_SITE_URL` environment variable to your production domain
- [ ] Update Supabase Dashboard → Authentication → Site URL
- [ ] Add production domain to Supabase Redirect URLs
- [ ] Test signup flow to verify email contains production URL
- [ ] Verify confirmation link redirects to production domain

## Testing

1. **Development Test:**
   - Sign up with a new email
   - Check the confirmation email
   - Verify link contains `http://localhost:8080`

2. **Production Test:**
   - Deploy to production with `VITE_SITE_URL` set
   - Sign up with a new email
   - Check the confirmation email
   - Verify link contains your production domain

## Troubleshooting

**Email still shows localhost after deploying:**
- Make sure `VITE_SITE_URL` is set in your production environment variables
- Rebuild and redeploy your application
- Check Supabase Dashboard → Authentication → Site URL is set to production domain

**"Invalid redirect URL" error:**
- Add your domain to Supabase Redirect URLs in the dashboard
- Include both the exact path and wildcard pattern

**Confirmation link doesn't work:**
- Verify the `/auth` route exists in your application
- Check that Auth.tsx properly handles the email confirmation token
- Look for token in URL params and verify it's being processed
