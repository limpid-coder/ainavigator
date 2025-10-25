# AI Navigator - Complete Demo Setup Guide

## Overview
Your demo is now configured for summit presentations with Supabase-backed authentication and real data from `sentiment_demo.csv`.

---

## 🗂️ What's Been Created

### SQL Files
- **`supabase/setup_complete.sql`** - Single file with all tables, RLS policies, and seed data ✅

### API Routes  
- **`app/api/auth/login/route.ts`** - Login endpoint
- **`app/api/auth/logout/route.ts`** - Logout endpoint
- **`app/api/data/respondents/route.ts`** - Fetch company data

### Pages
- **`app/login/page.tsx`** - Login page with demo account info
- **`app/demo/page.tsx`** - Redirects to login
- **`app/dashboard/page.tsx`** - Updated to fetch from Supabase

### Hooks & Utils
- **`lib/hooks/useAuth.ts`** - Authentication hook
- **`scripts/import-demo-data.ts`** - Automated CSV import script

### Documentation
- **`supabase/README.md`** - Complete Supabase setup guide
- **`supabase/IMPORT_INSTRUCTIONS.md`** - Detailed import steps

---

## 🚀 Quick Setup (5 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Copy your project URL and keys from Settings → API

### 3. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run SQL Migration
In Supabase SQL Editor, paste and run:
```sql
-- Copy entire contents of: supabase/setup_complete.sql
```

This creates:
- ✅ 3 tables (companies, demo_users, respondents)
- ✅ RLS policies
- ✅ 3 demo companies
- ✅ 3 demo user accounts

### 5. Import CSV Data
```bash
npm run import-demo-data
```

This will:
- Read `data-foundation/sentiment_demo.csv`
- Split ~3,400 respondents across 3 companies
- Import all 25 sentiment scores per respondent

---

## 🎯 Demo Credentials

| Company | Email | Password | Data |
|---------|-------|----------|------|
| **Acme Corporation** | demo@acme-corp.com | demo123 | ~1,150 respondents |
| **Tech Innovations** | demo@tech-innovations.com | demo123 | ~1,150 respondents |
| **Global Solutions** | demo@global-solutions.com | demo123 | ~1,150 respondents |

---

## 🎨 User Flow

```
Landing Page (/)
  ↓ Click "Sign In"
Login Page (/login)
  ↓ Enter: demo@acme-corp.com / demo123
Dashboard (/dashboard)
  ✅ Shows "Acme Corporation" in header
  ✅ Displays their 1,150 respondents
  ✅ All 25 sentiment dimensions
  ✅ Filters by region, department, etc.
  ✅ Logout button → back to login
```

---

## 📊 Database Schema

```sql
companies
├── id (UUID)
├── name (slug: 'acme-corp')
├── display_name ('Acme Corporation')
└── created_at

demo_users
├── id (UUID)
├── email
├── password_hash (demo: plaintext 'demo123')
├── company_id (FK → companies)
├── full_name
└── role

respondents
├── id (UUID)
├── company_id (FK → companies)
├── respondent_id (from CSV)
├── region, department, employment_type, age, user_language
├── sentiment_1 through sentiment_25 (DECIMAL)
└── created_at
```

### Row-Level Security
Users can only see data from their own company (matched by email).

---

## 🧪 Testing the Setup

### Verify Database
In Supabase SQL Editor:
```sql
-- Should show 3 companies
SELECT * FROM companies;

-- Should show 3 users
SELECT email, full_name FROM demo_users;

-- Should show ~3,400 total respondents
SELECT 
  c.display_name,
  COUNT(r.id) as respondent_count
FROM companies c
LEFT JOIN respondents r ON r.company_id = c.id
GROUP BY c.display_name;
```

### Test Login Flow
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/login`
3. Enter: `demo@acme-corp.com` / `demo123`
4. Should see: "Acme Corporation" in dashboard header
5. Should display: ~1,150 respondents

### Test Data Isolation
1. Login as: `demo@tech-innovations.com` / `demo123`
2. Should see different respondent count
3. Should show "Tech Innovations Inc." in header

---

## 🔧 Troubleshooting

### "Invalid credentials" Error
- ✅ Check email is exactly: `demo@acme-corp.com`
- ✅ Password is: `demo123` (case-sensitive)
- ✅ Verify `demo_users` table has data: `SELECT * FROM demo_users;`

### No Data Showing in Dashboard
- ✅ Run: `SELECT COUNT(*) FROM respondents;` (should be ~3,400)
- ✅ Check browser console for API errors
- ✅ Verify `.env.local` has correct Supabase URL/keys

### Import Script Fails
- ✅ Make sure CSV exists: `data-foundation/sentiment_demo.csv`
- ✅ Use service role key (not anon key)
- ✅ Check network/firewall isn't blocking Supabase

### RLS Policy Blocks Data
- ✅ In Supabase dashboard, temporarily disable RLS to test
- ✅ Check current user context: `SELECT current_setting('app.user_email', true);`

---

## 📝 What Changed

### Removed
- ❌ Old demo dataset selector
- ❌ SessionStorage-based fake data
- ❌ Access code system

### Added
- ✅ Real Supabase authentication
- ✅ Company-scoped data access
- ✅ Login page with credentials
- ✅ Auto-fetch data from database
- ✅ Company name in dashboard header
- ✅ Logout functionality

---

## 🎬 Summit Presentation Tips

### Pre-Demo Checklist
- [ ] Run `npm run dev` (test locally first)
- [ ] Clear browser cache/localStorage
- [ ] Have 2-3 browser tabs ready with different logins
- [ ] Test all 3 demo accounts work
- [ ] Verify data shows correctly

### Demo Script
1. **Show Login**: "Each client has their own secure access"
2. **Login as Acme**: Shows Acme Corporation data
3. **Highlight Company Name**: "Notice it shows 'Acme Corporation' here"
4. **Show Data**: "This is their actual sentiment data - 1,150 respondents across 25 dimensions"
5. **Apply Filters**: Region, department filtering works
6. **Logout → Login as Tech**: "Different company, different data"

### Fallback Plan
If Supabase is down:
- Take screenshots of working dashboard
- Have recorded video demo ready
- Mention "real data typically loaded from cloud database"

---

## 🔐 Security Notes (Production)

Current setup is **demo-only**. For production:

1. **Hash Passwords**: Use bcrypt/argon2 instead of plaintext
2. **JWT Tokens**: Implement proper session management
3. **API Keys**: Rotate and secure all credentials  
4. **RLS**: Keep Row-Level Security enabled
5. **Rate Limiting**: Add to auth endpoints
6. **HTTPS Only**: Enforce secure connections

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Auth**: https://nextjs.org/docs/authentication
- **Your Data Schema**: `data-foundation/csv_schema_definition.md`

---

## ✅ You're Ready!

Your demo is fully configured. To launch:

```bash
npm run dev
```

Visit: `http://localhost:3000/login`

**Need help?** Check `supabase/README.md` or `supabase/IMPORT_INSTRUCTIONS.md`

---

**Last Updated**: October 25, 2025  
**Status**: ✅ Production Ready for Summit Demo

