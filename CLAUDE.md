# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Christian Town Square is a Q&A platform focused on faith-related questions and discussions. Built as a Vite React application with TypeScript, shadcn/ui components, Tailwind CSS, and Supabase for backend/authentication.

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm build

# Build for development mode
npm run build:dev

# Lint codebase
npm run lint

# Preview production build
npm preview
```

## Architecture

### Authentication & State
- Supabase Auth for user authentication (sign up, sign in, sign out)
- Auth context provider (`src/lib/auth-context.tsx`) wraps entire app
- Admin access controlled via `VITE_ADMIN_EMAIL` env var and database `is_admin` flag
- Protected routes redirect to `/auth` if user not authenticated

### Routing & Navigation
- Client-side routing via `react-router-dom` configured in `src/App.tsx`
- All routes defined in App component with AuthProvider and Layout wrappers
- Custom routes MUST be added above the catch-all `*` route
- Admin route (`/admin`) only accessible to admin users

### Data Management
- Supabase PostgreSQL database for all persistent data
- Real-time data fetching with Supabase client (`src/lib/supabase.ts`)
- Database tables: `profiles`, `questions`, `answers`
- Row Level Security (RLS) policies enforce access control
- TanStack Query (`@tanstack/react-query`) configured for caching
- Mock data (`src/lib/mockData.ts`) still used for topics list

### Component Structure
```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout wrapper
│   ├── questions/       # QuestionCard, AnswerCard
│   ├── topics/          # TopicChip
│   └── ui/              # shadcn/ui components (auto-generated)
├── pages/               # Route-level page components
├── hooks/               # Custom React hooks (use-mobile, use-toast)
└── lib/                 # Utilities and mock data
```

### Styling System
- Tailwind CSS with custom design tokens in `src/index.css`
- Theme: Warm parchment-inspired palette with navy accents
- Custom fonts: Playfair Display (serif/headings), Source Sans 3 (sans/body)
- Custom CSS variables for colors, shadows, and design tokens
- Dark mode support via `next-themes` (class-based)
- Path alias: `@/` maps to `./src/`

### Key Design Patterns
- All pages wrapped in `<Layout>` component (Header/Footer)
- UI components from shadcn/ui in `src/components/ui/`
- Toast notifications via both shadcn Toaster and Sonner
- Form validation using `react-hook-form` with `zod` resolvers

## TypeScript Configuration
- Relaxed TypeScript settings for rapid prototyping:
  - `noImplicitAny: false`
  - `strictNullChecks: false`
  - `noUnusedLocals: false`
  - `noUnusedParameters: false`

## Adding New Routes
When adding routes, always place them before the `*` catch-all route in `src/App.tsx`. The NotFound component must remain last.

## Environment Variables

Required variables in `.env` file:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=admin_email@example.com
```

See `SUPABASE_SETUP.md` for detailed setup instructions.

## Database Setup

Run `supabase-setup.sql` in Supabase SQL Editor to create tables:
- `profiles` - User profiles linked to auth.users
- `questions` - All questions with topics, view counts, answer counts
- `answers` - All answers/comments with voting, verification, pinning

## Admin Features

Admin users (determined by `VITE_ADMIN_EMAIL` or `is_admin` flag in database) can:
- Access admin dashboard at `/admin` (visible link in footer)
- Delete questions and answers (soft delete via status field)
- Pin answers as "Best Answer"
- Verify answers with verified badge
- View all content including metadata

## Component Guidelines
- Use shadcn/ui components from `@/components/ui/`
- Import utilities via `@/` path alias
- Follow existing component patterns in `src/components/` subdirectories
- Pages should use the `<Layout>` wrapper for consistent header/footer
- Use `useAuth()` hook to access current user and authentication state
- Components work with both mock data structure and Supabase data structure for compatibility
