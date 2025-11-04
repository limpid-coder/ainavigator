"""
Capability Data Import Script
==============================

Imports transformed wide-format capability data into Supabase database.
Handles company ID mapping and inserts new respondents with capability scores.

Author: AI Navigator Team
Date: November 3, 2025
Version: 1.0 (Web Summit MVP)

Prerequisites:
    - Run transform_capability_data.py first
    - Supabase credentials in environment variables:
        NEXT_PUBLIC_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY

Usage:
    python scripts/import_capability_wide.py
"""

import pandas as pd
import os
from supabase import create_client, Client
from pathlib import Path
from datetime import datetime

# Configuration
INPUT_FILE = "data-foundation/capability_demo_wide.csv"
BATCH_SIZE = 500  # Insert in batches to avoid timeout
LOG_FILE = "logs/import_log.txt"

# Company name to ID mapping (will be fetched from database)
COMPANY_MAPPING = {}


def initialize_supabase() -> Client:
    """Initialize Supabase client."""
    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not url or not key:
        raise ValueError(
            "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and "
            "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
        )

    return create_client(url, key)


def fetch_company_mapping(supabase: Client) -> dict:
    """
    Fetch company name to UUID mapping from database.

    Returns:
        dict: {company_name: company_uuid}
    """
    print("🏢 Fetching company IDs from database...")

    response = supabase.table('companies').select('id,name').execute()

    if not response.data:
        raise ValueError("No companies found in database. Run demo schema migration first.")

    mapping = {company['name']: company['id'] for company in response.data}

    print(f"  ✅ Found {len(mapping)} companies:")
    for name, uuid in mapping.items():
        print(f"    {name}: {uuid}")

    return mapping


def prepare_row_for_insert(row: pd.Series, company_mapping: dict) -> dict:
    """
    Prepare a single row for database insertion.

    Args:
        row: Pandas Series representing one respondent
        company_mapping: Dict mapping company names to UUIDs

    Returns:
        dict: Row data formatted for Supabase insert
    """
    # Map company name to UUID
    company_id = company_mapping.get(row['company_name'])

    if not company_id:
        raise ValueError(f"Unknown company: {row['company_name']}")

    # Build insert data
    insert_data = {
        'company_id': company_id,
        'respondent_id': row['respondent_id'],
        'region': row.get('region'),
        'department': None,  # Capability data doesn't have department
        'employment_type': row.get('employment_type'),
        'age': None,  # Capability data doesn't have age
        'user_language': None,  # Capability data doesn't have language
        'industry': row.get('industry'),
        'continent': row.get('continent'),
    }

    # Add all 32 construct scores
    for i in range(1, 33):
        col_name = f'construct_{i}'
        value = row.get(col_name)

        # Convert NaN to None for database insertion
        if pd.isna(value):
            insert_data[col_name] = None
        else:
            insert_data[col_name] = float(value)

    return insert_data


def import_in_batches(supabase: Client, df: pd.DataFrame, company_mapping: dict) -> dict:
    """
    Import data in batches to avoid timeouts.

    Returns:
        dict: Import statistics
    """
    total_rows = len(df)
    batches = (total_rows // BATCH_SIZE) + 1

    stats = {
        'total_rows': total_rows,
        'inserted': 0,
        'errors': 0,
        'error_details': []
    }

    print(f"\n📤 Importing {total_rows:,} respondents in {batches} batches...")

    for batch_num in range(batches):
        start_idx = batch_num * BATCH_SIZE
        end_idx = min((batch_num + 1) * BATCH_SIZE, total_rows)

        batch_df = df.iloc[start_idx:end_idx]

        print(f"  Batch {batch_num + 1}/{batches}: rows {start_idx+1}-{end_idx}... ", end='')

        # Prepare batch data
        batch_data = []
        for _, row in batch_df.iterrows():
            try:
                batch_data.append(prepare_row_for_insert(row, company_mapping))
            except Exception as e:
                stats['errors'] += 1
                stats['error_details'].append({
                    'respondent_id': row.get('respondent_id', 'unknown'),
                    'error': str(e)
                })
                continue

        # Insert batch
        try:
            response = supabase.table('respondents').insert(batch_data).execute()
            stats['inserted'] += len(batch_data)
            print(f"✅ {len(batch_data)} rows")
        except Exception as e:
            stats['errors'] += len(batch_data)
            print(f"❌ Error: {str(e)}")
            stats['error_details'].append({
                'batch': batch_num + 1,
                'error': str(e)
            })

    return stats


def verify_import(supabase: Client, expected_count: int) -> dict:
    """
    Verify imported data in database.

    Returns:
        dict: Verification results
    """
    print("\n🔍 Verifying import...")

    # Count total respondents with capability data
    response = supabase.table('respondents')\
        .select('*', count='exact')\
        .not_.is_('construct_1', 'null')\
        .execute()

    actual_count = response.count if hasattr(response, 'count') else len(response.data)

    # Get company distribution
    response_all = supabase.table('respondents')\
        .select('company_id')\
        .not_.is_('construct_1', 'null')\
        .execute()

    company_distribution = {}
    for row in response_all.data:
        company_id = row['company_id']
        company_distribution[company_id] = company_distribution.get(company_id, 0) + 1

    # Get score ranges
    response_scores = supabase.table('respondents')\
        .select('construct_1,construct_16,construct_32')\
        .not_.is_('construct_1', 'null')\
        .limit(1000)\
        .execute()

    score_stats = {
        'construct_1': [],
        'construct_16': [],
        'construct_32': []
    }

    for row in response_scores.data:
        for col in score_stats.keys():
            if row.get(col) is not None:
                score_stats[col].append(float(row[col]))

    verification = {
        'expected_count': expected_count,
        'actual_count': actual_count,
        'match': actual_count == expected_count,
        'company_distribution': company_distribution,
        'score_ranges': {}
    }

    for col, values in score_stats.items():
        if values:
            verification['score_ranges'][col] = {
                'min': min(values),
                'max': max(values),
                'mean': sum(values) / len(values),
                'sample_size': len(values)
            }

    print(f"  Expected respondents: {expected_count:,}")
    print(f"  Actual respondents: {actual_count:,}")
    print(f"  Match: {'✅' if verification['match'] else '❌'}")

    print(f"\n  Company distribution:")
    for company_id, count in company_distribution.items():
        print(f"    {company_id}: {count:,}")

    return verification


def generate_log(stats: dict, verification: dict, log_path: str):
    """Generate import log file."""
    log_lines = [
        "=" * 80,
        "CAPABILITY DATA IMPORT LOG",
        "=" * 80,
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"Input file: {INPUT_FILE}",
        "",
        "IMPORT STATISTICS",
        "-" * 80,
        f"Total rows processed: {stats['total_rows']:,}",
        f"Successfully inserted: {stats['inserted']:,}",
        f"Errors encountered: {stats['errors']}",
        "",
        "VERIFICATION RESULTS",
        "-" * 80,
        f"Expected count: {verification['expected_count']:,}",
        f"Actual count: {verification['actual_count']:,}",
        f"Match: {'YES' if verification['match'] else 'NO'}",
        "",
        "COMPANY DISTRIBUTION",
        "-" * 80,
    ]

    for company_id, count in verification['company_distribution'].items():
        log_lines.append(f"{company_id}: {count:,}")

    log_lines.extend([
        "",
        "SCORE RANGES (Sample)",
        "-" * 80,
    ])

    for col, ranges in verification['score_ranges'].items():
        log_lines.append(
            f"{col}: min={ranges['min']:.2f}, max={ranges['max']:.2f}, "
            f"mean={ranges['mean']:.2f} (n={ranges['sample_size']})"
        )

    if stats['error_details']:
        log_lines.extend([
            "",
            "ERRORS",
            "-" * 80,
        ])
        for error in stats['error_details'][:10]:  # Show first 10 errors
            log_lines.append(str(error))

    log_lines.extend([
        "",
        "=" * 80,
    ])

    # Write log
    log_dir = Path(log_path).parent
    log_dir.mkdir(exist_ok=True)

    with open(log_path, 'w') as f:
        f.write('\n'.join(log_lines))

    print(f"\n📄 Import log saved to: {log_path}")


def main():
    """Main import pipeline."""
    print("=" * 80)
    print("CAPABILITY DATA IMPORT PIPELINE")
    print("=" * 80)
    print(f"Input: {INPUT_FILE}")
    print("=" * 80)

    # Step 1: Initialize Supabase
    print("\n🔐 Initializing Supabase connection...")
    try:
        supabase = initialize_supabase()
        print("  ✅ Connected to Supabase")
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return

    # Step 2: Fetch company mapping
    try:
        company_mapping = fetch_company_mapping(supabase)
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return

    # Step 3: Load transformed data
    print(f"\n📂 Loading transformed data from {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE)
        print(f"  ✅ Loaded {len(df):,} rows")
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return

    # Step 4: Import data in batches
    stats = import_in_batches(supabase, df, company_mapping)

    # Step 5: Verify import
    verification = verify_import(supabase, expected_count=len(df))

    # Step 6: Generate log
    generate_log(stats, verification, LOG_FILE)

    # Final summary
    print("\n" + "=" * 80)
    if stats['errors'] == 0 and verification['match']:
        print("✅ IMPORT SUCCESSFUL!")
    else:
        print("⚠️  IMPORT COMPLETED WITH ISSUES")

    print("=" * 80)
    print(f"Inserted: {stats['inserted']:,} / {stats['total_rows']:,}")
    print(f"Errors: {stats['errors']}")
    print(f"Database count: {verification['actual_count']:,}")
    print(f"Log file: {LOG_FILE}")
    print("\nNext steps:")
    print("1. Review import log for any errors")
    print("2. Test API endpoints: GET /api/data/respondents")
    print("3. Validate benchmarks: GET /api/benchmarks/overview")
    print("=" * 80)


if __name__ == "__main__":
    main()
