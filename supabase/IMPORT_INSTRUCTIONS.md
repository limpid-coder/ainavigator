# Import CSV Data to Supabase

## Step 1: Run Schema Migration
In Supabase SQL Editor, run: `supabase/migrations/001_demo_schema.sql`

## Step 2: Import CSV via Supabase Dashboard

### Option A: Using Supabase Dashboard (Easiest)
1. Go to your Supabase project → Table Editor
2. Select `respondents` table
3. Click "Insert" → "Import data from CSV"
4. Upload `data-foundation/sentiment_demo.csv`
5. Map columns (Supabase will auto-detect)
6. **Important**: Set `company_id` to one of your company UUIDs
   - You'll need to run this 3 times, once for each company
   - Split the CSV manually or import all to one company first

### Option B: Using SQL COPY Command
If you have CLI access:

```bash
# Copy CSV to a temp location accessible to Postgres
supabase db push

# Then run in SQL Editor:
```

```sql
-- Create temp table
CREATE TEMP TABLE csv_import (LIKE respondents INCLUDING ALL);

-- Load CSV (adjust path)
COPY csv_import (
  respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_10, sentiment_11, sentiment_12, sentiment_13, 
  sentiment_14, sentiment_15, sentiment_16, sentiment_17, sentiment_18, 
  sentiment_19, sentiment_2, sentiment_20, sentiment_21, sentiment_22, 
  sentiment_23, sentiment_24, sentiment_25, sentiment_3, sentiment_4, 
  sentiment_5, sentiment_6, sentiment_7, sentiment_8, sentiment_9
)
FROM '/path/to/sentiment_demo.csv'
DELIMITER ',' CSV HEADER;

-- Insert with company_id for Acme Corp
INSERT INTO respondents 
SELECT 
  gen_random_uuid(),
  (SELECT id FROM companies WHERE name = 'acme-corp'),
  respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5,
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25,
  NOW()
FROM csv_import;
```

### Option C: Using Node Script
Run the provided import script:

```bash
npm run import-demo-data
```

## Step 3: Verify Data

```sql
-- Check companies
SELECT * FROM companies;

-- Check demo users
SELECT email, full_name, company_id FROM demo_users;

-- Check respondent counts per company
SELECT 
  c.display_name,
  COUNT(r.id) as respondent_count,
  AVG(r.sentiment_1) as avg_sentiment_1
FROM companies c
LEFT JOIN respondents r ON r.company_id = c.id
GROUP BY c.id, c.display_name;
```

## Demo Login Credentials

- **Acme Corporation**: `demo@acme-corp.com` / `demo123`
- **Tech Innovations**: `demo@tech-innovations.com` / `demo123`
- **Global Solutions**: `demo@global-solutions.com` / `demo123`


