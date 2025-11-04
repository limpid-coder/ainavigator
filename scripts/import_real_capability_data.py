#!/usr/bin/env python3
"""
Import Real Capability Data to Supabase

Updates existing respondents with capability construct scores.
For respondents that don't exist, creates new records with company assignment.

Requires environment variables:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
"""

import os
import sys
import pandas as pd
from supabase import create_client, Client
from datetime import datetime
import hashlib

# Configuration
INPUT_FILE = "data-foundation/capability_real_wide.csv"
BATCH_SIZE = 50
LOG_DIR = "logs"

# Demo companies for new respondents
DEMO_COMPANIES = ["acme-corp", "tech-innovations", "global-solutions"]

def print_header(text: str):
    """Print formatted header"""
    print("=" * 80)
    print(text)
    print("=" * 80)

def print_step(text: str):
    """Print formatted step"""
    print(f"\n{text}")

def hash_respondent_to_company(respondent_id: str) -> str:
    """Deterministically assign respondent to company using hash"""
    hash_value = int(hashlib.md5(respondent_id.encode()).hexdigest(), 16)
    company_index = hash_value % 3
    return DEMO_COMPANIES[company_index]

def main():
    print_header("REAL CAPABILITY DATA IMPORT PIPELINE")
    print(f"Input: {INPUT_FILE}")
    print_header("")

    # Check environment variables
    print_step("🔐 Initializing Supabase connection...")
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    if not supabase_url or not supabase_key:
        print("  ❌ Error: Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
        sys.exit(1)

    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    print("  ✅ Connected to Supabase")

    # Fetch company IDs
    print_step("🏢 Fetching company IDs from database...")
    companies_response = supabase.table('companies').select('id,name').execute()
    companies = {c['name']: c['id'] for c in companies_response.data}
    print(f"  ✅ Found {len(companies)} companies:")
    for name, uuid in companies.items():
        print(f"    {name}: {uuid}")

    # Load transformed data
    print_step(f"📂 Loading transformed data from {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
        print(f"  ✅ Loaded {len(df)} rows")
    except FileNotFoundError:
        print(f"  ❌ Error: File not found: {INPUT_FILE}")
        sys.exit(1)

    # Check which respondents already exist
    print_step("🔍 Checking existing respondents...")
    existing_response = supabase.table('respondents').select('respondent_id').execute()
    existing_ids = {r['respondent_id'] for r in existing_response.data}
    print(f"  ✅ Found {len(existing_ids)} existing respondents in database")

    # Separate into updates vs inserts
    df_existing = df[df['respondent_id'].isin(existing_ids)]
    df_new = df[~df['respondent_id'].isin(existing_ids)]

    print(f"\n  Respondents to UPDATE: {len(df_existing)}")
    print(f"  Respondents to INSERT: {len(df_new)}")

    # Prepare update records
    update_count = 0
    if len(df_existing) > 0:
        print_step(f"🔄 Updating {len(df_existing)} existing respondents...")

        for idx, row in df_existing.iterrows():
            update_data = {}

            # Add all construct scores
            for i in range(1, 33):
                col_name = f'construct_{i}'
                value = row.get(col_name)
                update_data[col_name] = None if pd.isna(value) else float(value)

            # Update via respondent_id
            try:
                supabase.table('respondents').update(update_data).eq('respondent_id', row['respondent_id']).execute()
                update_count += 1
                if (update_count) % 10 == 0:
                    print(f"  Updated {update_count}/{len(df_existing)}...")
            except Exception as e:
                print(f"  ❌ Error updating {row['respondent_id']}: {e}")

        print(f"  ✅ Updated {update_count} respondents")

    # Prepare insert records
    insert_count = 0
    if len(df_new) > 0:
        print_step(f"📤 Inserting {len(df_new)} new respondents...")

        insert_records = []
        for idx, row in df_new.iterrows():
            # Assign company via hash
            company_name = hash_respondent_to_company(row['respondent_id'])
            company_id = companies.get(company_name)

            if not company_id:
                print(f"  ⚠️  Warning: Company {company_name} not found, skipping {row['respondent_id']}")
                continue

            insert_data = {
                'company_id': company_id,
                'respondent_id': row['respondent_id'],
                'region': row.get('region') if pd.notna(row.get('region')) else None,
                'department': row.get('department') if pd.notna(row.get('department')) else None,
                'employment_type': row.get('employment_type') if pd.notna(row.get('employment_type')) else None,
                'age': row.get('age') if pd.notna(row.get('age')) else None,
                'user_language': row.get('user_language') if pd.notna(row.get('user_language')) else None,
            }

            # Add all construct scores
            for i in range(1, 33):
                col_name = f'construct_{i}'
                value = row.get(col_name)
                insert_data[col_name] = None if pd.isna(value) else float(value)

            insert_records.append(insert_data)

        # Insert in batches
        total_batches = (len(insert_records) + BATCH_SIZE - 1) // BATCH_SIZE
        for batch_num in range(total_batches):
            start_idx = batch_num * BATCH_SIZE
            end_idx = min(start_idx + BATCH_SIZE, len(insert_records))
            batch = insert_records[start_idx:end_idx]

            print(f"  Batch {batch_num + 1}/{total_batches}: rows {start_idx + 1}-{end_idx}...", end=" ")

            try:
                response = supabase.table('respondents').insert(batch).execute()
                inserted = len(response.data)
                insert_count += inserted
                print(f"✅ {inserted} rows")
            except Exception as e:
                print(f"❌ Error: {e}")

        print(f"  ✅ Inserted {insert_count} new respondents")

    # Verify import
    print_step("🔍 Verifying import...")
    all_respondents_after = supabase.table('respondents').select('respondent_id,construct_1').execute()
    respondents_with_capability = [r for r in all_respondents_after.data if r.get('construct_1') is not None]

    print(f"  Total respondents in database: {len(all_respondents_after.data)}")
    print(f"  Respondents with capability data: {len(respondents_with_capability)}")
    print(f"  Expected: {len(existing_ids) + insert_count}")

    if len(respondents_with_capability) >= (len(existing_ids) + insert_count):
        print(f"  Match: ✅")
    else:
        print(f"  Mismatch: ⚠️")

    # Company distribution for new inserts
    if insert_count > 0:
        print_step("\n  Company distribution (new inserts):")
        company_counts = {}
        for record in insert_records[:insert_count]:
            company_id = record['company_id']
            company_name = [name for name, uuid in companies.items() if uuid == company_id][0]
            company_counts[company_name] = company_counts.get(company_name, 0) + 1

        for company_name, count in company_counts.items():
            print(f"    {companies[company_name]}: {count}")

    # Create import log
    print_step(f"📄 Import log saved to: {LOG_DIR}/import_log.txt")
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(f"{LOG_DIR}/import_log.txt", 'w') as f:
        f.write(f"Real Capability Data Import - {datetime.now()}\n")
        f.write(f"=" * 80 + "\n\n")
        f.write(f"Input file: {INPUT_FILE}\n")
        f.write(f"Respondents updated: {update_count}\n")
        f.write(f"Respondents inserted: {insert_count}\n")
        f.write(f"Total capability respondents: {len(respondents_with_capability)}\n")
        f.write(f"\nStatus: {'SUCCESS' if insert_count + update_count == len(df) else 'PARTIAL'}\n")

    print_header("✅ IMPORT SUCCESSFUL!")
    print(f"Updated: {update_count} / {len(df_existing)}")
    print(f"Inserted: {insert_count} / {len(df_new)}")
    print(f"Total: {update_count + insert_count} / {len(df)}")
    print(f"\nDatabase now has {len(respondents_with_capability)} respondents with capability data")
    print(f"Log file: {LOG_DIR}/import_log.txt")
    print(f"\nNext steps:")
    print(f"1. Review import log for any errors")
    print(f"2. Test API endpoints: GET /api/data/respondents")
    print(f"3. Validate benchmarks: GET /api/benchmarks/overview")
    print_header("")

if __name__ == "__main__":
    main()
