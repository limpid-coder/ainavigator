# Supabase Demo Setup

## Quick Start

### 1. Set up Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Get your service role key from Settings → API

### 2. Configure Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Migrations

**In Supabase SQL Editor:**

1. Run `migrations/001_demo_schema.sql` 
   - Creates companies, demo_users, and respondents tables
   - Sets up RLS policies
   - Creates 3 demo companies and demo login accounts

### 4. Import CSV Data

**Option A: Automated (Recommended)**
```bash
npm install
npm run import-demo-data
```

**Option B: Manual (Supabase Dashboard)**
See `IMPORT_INSTRUCTIONS.md` for detailed steps.

### 5. Verify Setup

Run this in Supabase SQL Editor:

```sql
-- Should show 3 companies
SELECT * FROM companies;

-- Should show ~3400+ respondents distributed across companies
SELECT 
  c.display_name,
  COUNT(r.id) as respondent_count
FROM companies c
LEFT JOIN respondents r ON r.company_id = c.id
GROUP BY c.id, c.display_name;
```

## Demo Login Credentials

| Company | Email | Password |
|---------|-------|----------|
| Acme Corporation | demo@acme-corp.com | demo123 |
| Tech Innovations | demo@tech-innovations.com | demo123 |
| Global Solutions | demo@global-solutions.com | demo123 |

## Schema Overview

```
companies
├── id (UUID, PK)
├── name (TEXT, unique slug)
├── display_name (TEXT)
└── created_at

demo_users
├── id (UUID, PK)
├── email (TEXT, unique)
├── password_hash (TEXT)
├── company_id (UUID, FK → companies)
└── full_name

respondents
├── id (UUID, PK)
├── company_id (UUID, FK → companies)
├── respondent_id (TEXT, from CSV)
├── region, department, employment_type, age, user_language
├── sentiment_1 through sentiment_25 (DECIMAL)
└── created_at
```

## Row-Level Security (RLS)

- Users can only query their own company's data
- Set user context: `SET app.user_email = 'demo@acme-corp.com'`
- Policies automatically filter by company_id

## Next Steps

1. Build auth API routes (`/api/auth/login`, `/api/auth/logout`)
2. Update dashboard to query from Supabase instead of sessionStorage
3. Add company context to authenticated sessions
4. Display company name in header

## Troubleshooting

**Import fails with "permission denied"**
- Make sure you're using the service role key, not anon key
- Check that RLS policies allow inserts (or use service role to bypass)

**No data showing in dashboard**
- Verify RLS policies
- Check that user context is set correctly
- Query directly in SQL editor to confirm data exists


