#!/usr/bin/env python3
"""
Import Capability Data (LONG Format) to Supabase

Loads capability_demo.csv directly into capability_scores table.
Assigns company_id deterministically based on respondent_id hash.

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
INPUT_FILE = "data-foundation/capability_demo.csv"
BATCH_SIZE = 1000
LOG_DIR = "logs"

# Demo companies for respondent assignment
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
    print_header("CAPABILITY DATA IMPORT (LONG FORMAT)")
    print(f"Input: {INPUT_FILE}")
    print_header("")

    # Check environment variables
    print_step("🔐 Initializing Supabase connection...")
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    if not supabase_url or not supabase_key:
        print("  ❌ Error: Missing Supabase credentials")
        sys.exit(1)

    # Initialize Supabase client
    supabase: Client = create_client(supabase_url, supabase_key)
    print("  ✅ Connected to Supabase")

    # Fetch company IDs
    print_step("🏢 Fetching company IDs...")
    companies_response = supabase.table('companies').select('id,name').execute()
    companies = {c['name']: c['id'] for c in companies_response.data}
    print(f"  ✅ Found {len(companies)} companies")

    # Load capability data
    print_step(f"📂 Loading capability data from {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
        print(f"  ✅ Loaded {len(df):,} rows")
        print(f"  Columns: {', '.join(df.columns.tolist())}")
    except FileNotFoundError:
        print(f"  ❌ Error: File not found: {INPUT_FILE}")
        sys.exit(1)

    # Data validation
    print_step("🔍 Validating data...")
    unique_respondents = df['ResponseId_id'].nunique()
    unique_constructs = df['construct_id'].nunique()
    print(f"  Unique respondents: {unique_respondents}")
    print(f"  Unique constructs: {unique_constructs}")
    print(f"  Expected rows per respondent: 32")
    print(f"  Actual avg rows per respondent: {len(df) / unique_respondents:.1f}")

    # Clear existing capability scores
    print_step("🗑️  Clearing existing capability scores...")
    try:
        supabase.table('capability_scores').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("  ✅ Cleared existing data")
    except Exception as e:
        print(f"  ⚠️  Warning: {e}")

    # Prepare insert records
    print_step("📦 Preparing records for import...")
    insert_records = []

    for idx, row in df.iterrows():
        # Assign company via hash
        company_name = hash_respondent_to_company(row['ResponseId_id'])
        company_id = companies.get(company_name)

        if not company_id:
            print(f"  ⚠️  Warning: Company {company_name} not found, skipping row {idx}")
            continue

        insert_data = {
            'respondent_id': row['ResponseId_id'],
            'company_id': company_id,
            'dimension_id': int(row['dimension_id']),
            'dimension': row['dimension'],
            'construct_id': int(row['construct_id']),
            'construct': row['construct'],
            'score': float(row['score']),
            'industry_synthetic': row.get('industry_synthetic'),
            'country_synthetic': row.get('country_synthetic'),
            'continent_synthetic': row.get('continent_synthetic'),
            'role_synthetic': row.get('role_synthetic')
        }

        insert_records.append(insert_data)

    print(f"  ✅ Prepared {len(insert_records):,} records")

    # Insert in batches
    print_step(f"📤 Importing {len(insert_records):,} records in batches of {BATCH_SIZE}...")
    total_batches = (len(insert_records) + BATCH_SIZE - 1) // BATCH_SIZE
    insert_count = 0

    for batch_num in range(total_batches):
        start_idx = batch_num * BATCH_SIZE
        end_idx = min(start_idx + BATCH_SIZE, len(insert_records))
        batch = insert_records[start_idx:end_idx]

        print(f"  Batch {batch_num + 1}/{total_batches}: rows {start_idx + 1:,}-{end_idx:,}...", end=" ", flush=True)

        try:
            response = supabase.table('capability_scores').insert(batch).execute()
            inserted = len(response.data)
            insert_count += inserted
            print(f"✅ {inserted} rows")
        except Exception as e:
            print(f"❌ Error: {e}")
            # Continue with next batch
            continue

    print(f"\n  ✅ Inserted {insert_count:,} / {len(insert_records):,} records")

    # Verify import
    print_step("🔍 Verifying import...")
    count_response = supabase.table('capability_scores').select('id', count='exact').execute()
    actual_count = count_response.count

    print(f"  Expected: {insert_count:,}")
    print(f"  Actual in database: {actual_count:,}")

    if actual_count == insert_count:
        print(f"  Match: ✅")
    else:
        print(f"  Mismatch: ⚠️")

    # Company distribution
    print_step("📊 Company distribution:")
    company_counts = {}
    for record in insert_records:
        company_id = record['company_id']
        company_name = [name for name, uuid in companies.items() if uuid == company_id][0]
        company_counts[company_name] = company_counts.get(company_name, 0) + 1

    for company_name, count in sorted(company_counts.items()):
        respondent_count = count // 32  # Each respondent has 32 constructs
        print(f"  {company_name}: {count:,} scores ({respondent_count} respondents)")

    # Create import log
    os.makedirs(LOG_DIR, exist_ok=True)
    log_file = f"{LOG_DIR}/capability_import_log.txt"
    with open(log_file, 'w') as f:
        f.write(f"Capability Data Import (LONG Format) - {datetime.now()}\n")
        f.write(f"=" * 80 + "\n\n")
        f.write(f"Input file: {INPUT_FILE}\n")
        f.write(f"Total rows: {len(df):,}\n")
        f.write(f"Records inserted: {insert_count:,}\n")
        f.write(f"Database count: {actual_count:,}\n")
        f.write(f"\nCompany Distribution:\n")
        for company_name, count in sorted(company_counts.items()):
            f.write(f"  {company_name}: {count:,} scores\n")
        f.write(f"\nStatus: {'SUCCESS' if actual_count == insert_count else 'PARTIAL'}\n")

    print_step(f"📄 Import log saved to: {log_file}")

    print_header("✅ IMPORT COMPLETE!")
    print(f"Loaded: {insert_count:,} / {len(insert_records):,} capability scores")
    print(f"Database count: {actual_count:,}")
    print(f"Log file: {log_file}")
    print(f"\nNext steps:")
    print(f"1. Review import log for any errors")
    print(f"2. Update benchmark service to use capability_scores table")
    print(f"3. Test API endpoints with new schema")
    print_header("")

if __name__ == "__main__":
    main()
