"""
Capability Data Transformation Script
======================================

Transforms capability assessment data from long format (one row per construct)
to wide format (one row per respondent with 32 construct columns).

Author: AI Navigator Team
Date: November 3, 2025
Version: 1.0 (Web Summit MVP)

Usage:
    python scripts/transform_capability_data.py

Outputs:
    - data-foundation/capability_demo_wide.csv (transformed data)
    - logs/transformation_report.txt (validation summary)
"""

import pandas as pd
import numpy as np
import hashlib
from pathlib import Path
from datetime import datetime

# Configuration
INPUT_FILE = "data-foundation/capability_demo.csv"
OUTPUT_FILE = "data-foundation/capability_demo_wide.csv"
REPORT_FILE = "logs/transformation_report.txt"

# Company IDs for demo distribution
DEMO_COMPANIES = {
    0: "acme-corp",
    1: "tech-innovations",
    2: "global-solutions"
}

def hash_respondent_to_company(respondent_id: str) -> str:
    """
    Deterministically assign respondent to a company using hash-based distribution.

    Args:
        respondent_id: Unique respondent identifier

    Returns:
        company_name: One of 'acme-corp', 'tech-innovations', 'global-solutions'
    """
    # Use MD5 hash for consistent distribution
    hash_value = int(hashlib.md5(respondent_id.encode()).hexdigest(), 16)
    company_index = hash_value % 3
    return DEMO_COMPANIES[company_index]


def validate_input_data(df: pd.DataFrame) -> dict:
    """
    Validate input data structure and quality.

    Returns:
        dict: Validation results and statistics
    """
    print("🔍 Validating input data...")

    validation = {
        'total_rows': len(df),
        'unique_respondents': df['ResponseId_id'].nunique(),
        'unique_constructs': df['construct_id'].nunique(),
        'score_range': (df['score'].min(), df['score'].max()),
        'null_scores': df['score'].isnull().sum(),
        'duplicate_entries': len(df) - len(df[['ResponseId_id', 'construct_id']].drop_duplicates()),
        'expected_rows': df['ResponseId_id'].nunique() * 32,
    }

    # Check for construct_id range (should be 1-32)
    construct_range = sorted(df['construct_id'].unique())
    validation['construct_range'] = (min(construct_range), max(construct_range))
    validation['missing_constructs'] = set(range(1, 33)) - set(construct_range)

    # Industry/country/role distributions
    validation['industries'] = df['industry_synthetic'].value_counts().to_dict()
    validation['countries'] = df['country_synthetic'].value_counts().to_dict()
    validation['roles'] = df['role_synthetic'].value_counts().to_dict()

    print(f"  ✅ Total rows: {validation['total_rows']:,}")
    print(f"  ✅ Unique respondents: {validation['unique_respondents']:,}")
    print(f"  ✅ Unique constructs: {validation['unique_constructs']}")
    print(f"  ✅ Score range: {validation['score_range'][0]:.2f} - {validation['score_range'][1]:.2f}")
    print(f"  ⚠️  Duplicate entries: {validation['duplicate_entries']:,}")
    print(f"  ⚠️  Null scores: {validation['null_scores']:,}")

    if validation['missing_constructs']:
        print(f"  ⚠️  Missing constructs: {validation['missing_constructs']}")

    return validation


def handle_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """
    Handle duplicate construct scores for same respondent by averaging.

    Args:
        df: Input dataframe with potential duplicates

    Returns:
        pd.DataFrame: Deduplicated data with averaged scores
    """
    print("\n🔄 Handling duplicate entries...")

    initial_count = len(df)

    # Group by respondent and construct, average scores
    deduplicated = df.groupby(['ResponseId_id', 'construct_id']).agg({
        'score': 'mean',  # Average duplicate scores
        'dimension_id': 'first',
        'dimension': 'first',
        'construct': 'first',
        'industry_synthetic': 'first',
        'country_synthetic': 'first',
        'continent_synthetic': 'first',
        'role_synthetic': 'first'
    }).reset_index()

    duplicates_removed = initial_count - len(deduplicated)

    print(f"  ✅ Rows before: {initial_count:,}")
    print(f"  ✅ Rows after: {len(deduplicated):,}")
    print(f"  ✅ Duplicates averaged: {duplicates_removed:,}")

    return deduplicated


def pivot_to_wide_format(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transform from long format (one row per construct) to wide format
    (one row per respondent with construct_1...construct_32 columns).

    Args:
        df: Deduplicated long-format dataframe

    Returns:
        pd.DataFrame: Wide-format dataframe with one row per respondent
    """
    print("\n🔄 Pivoting to wide format...")

    # Pivot construct scores
    pivoted_scores = df.pivot_table(
        index='ResponseId_id',
        columns='construct_id',
        values='score',
        aggfunc='mean'  # Safety net for any remaining duplicates
    )

    # Rename columns to construct_1, construct_2, ..., construct_32
    pivoted_scores.columns = [f'construct_{int(col)}' for col in pivoted_scores.columns]
    pivoted_scores = pivoted_scores.reset_index()

    # Get metadata (one row per respondent)
    # Use first occurrence of each respondent for metadata
    metadata = df.groupby('ResponseId_id').first()[
        ['industry_synthetic', 'country_synthetic', 'continent_synthetic', 'role_synthetic']
    ].reset_index()

    # Merge scores with metadata
    wide_df = pivoted_scores.merge(metadata, on='ResponseId_id', how='left')

    print(f"  ✅ Respondents in wide format: {len(wide_df):,}")
    print(f"  ✅ Columns created: {len([col for col in wide_df.columns if col.startswith('construct_')])}")

    return wide_df


def add_company_assignments(df: pd.DataFrame) -> pd.DataFrame:
    """
    Assign each respondent to a demo company using hash-based distribution.

    Args:
        df: Wide-format dataframe

    Returns:
        pd.DataFrame: Dataframe with company_id column added
    """
    print("\n🏢 Assigning respondents to demo companies...")

    df['company_name'] = df['ResponseId_id'].apply(hash_respondent_to_company)

    # Display distribution
    distribution = df['company_name'].value_counts()
    print(f"  Distribution:")
    for company, count in distribution.items():
        percentage = (count / len(df)) * 100
        print(f"    {company}: {count:,} ({percentage:.1f}%)")

    return df


def map_metadata_fields(df: pd.DataFrame) -> pd.DataFrame:
    """
    Map capability synthetic fields to database schema fields.

    Mapping:
        industry_synthetic → industry (new field)
        country_synthetic → region (existing field)
        continent_synthetic → continent (new field)
        role_synthetic → employment_type (existing field)

    Args:
        df: Wide-format dataframe with synthetic fields

    Returns:
        pd.DataFrame: Dataframe with mapped field names
    """
    print("\n🗺️  Mapping metadata fields to database schema...")

    df_mapped = df.copy()

    # Rename columns to match database schema
    df_mapped = df_mapped.rename(columns={
        'ResponseId_id': 'respondent_id',
        'industry_synthetic': 'industry',
        'country_synthetic': 'region',
        'continent_synthetic': 'continent',
        'role_synthetic': 'employment_type'
    })

    print(f"  ✅ Mapped fields:")
    print(f"    industry_synthetic → industry")
    print(f"    country_synthetic → region")
    print(f"    continent_synthetic → continent")
    print(f"    role_synthetic → employment_type")

    return df_mapped


def validate_output_data(df: pd.DataFrame) -> dict:
    """
    Validate transformed wide-format data.

    Returns:
        dict: Validation results
    """
    print("\n✅ Validating output data...")

    validation = {
        'total_respondents': len(df),
        'columns': len(df.columns),
        'construct_columns': len([col for col in df.columns if col.startswith('construct_')]),
        'null_counts': df.isnull().sum().to_dict(),
        'score_ranges': {}
    }

    # Check score ranges for each construct
    for i in range(1, 33):
        col = f'construct_{i}'
        if col in df.columns:
            validation['score_ranges'][col] = {
                'min': df[col].min(),
                'max': df[col].max(),
                'mean': df[col].mean(),
                'null_count': df[col].isnull().sum()
            }

    # Company distribution
    validation['company_distribution'] = df['company_name'].value_counts().to_dict()

    print(f"  ✅ Total respondents: {validation['total_respondents']:,}")
    print(f"  ✅ Total columns: {validation['columns']}")
    print(f"  ✅ Construct columns: {validation['construct_columns']}")

    # Check for any respondent with ALL null constructs
    all_construct_cols = [col for col in df.columns if col.startswith('construct_')]
    completely_null = df[all_construct_cols].isnull().all(axis=1).sum()

    if completely_null > 0:
        print(f"  ⚠️  Respondents with ALL null constructs: {completely_null}")
    else:
        print(f"  ✅ No respondents with ALL null constructs")

    return validation


def generate_report(input_validation: dict, output_validation: dict, output_path: str):
    """
    Generate a detailed transformation report.
    """
    report_lines = [
        "=" * 80,
        "CAPABILITY DATA TRANSFORMATION REPORT",
        "=" * 80,
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "INPUT DATA SUMMARY",
        "-" * 80,
        f"Total rows: {input_validation['total_rows']:,}",
        f"Unique respondents: {input_validation['unique_respondents']:,}",
        f"Unique constructs: {input_validation['unique_constructs']}",
        f"Score range: {input_validation['score_range'][0]:.2f} - {input_validation['score_range'][1]:.2f}",
        f"Duplicate entries found: {input_validation['duplicate_entries']:,}",
        f"Null scores: {input_validation['null_scores']:,}",
        "",
        "TRANSFORMATION RESULTS",
        "-" * 80,
        f"Output respondents: {output_validation['total_respondents']:,}",
        f"Construct columns created: {output_validation['construct_columns']}",
        "",
        "COMPANY DISTRIBUTION",
        "-" * 80,
    ]

    for company, count in output_validation['company_distribution'].items():
        percentage = (count / output_validation['total_respondents']) * 100
        report_lines.append(f"{company}: {count:,} ({percentage:.1f}%)")

    report_lines.extend([
        "",
        "SCORE STATISTICS (Sample: construct_1, construct_16, construct_32)",
        "-" * 80,
    ])

    for construct_key in ['construct_1', 'construct_16', 'construct_32']:
        if construct_key in output_validation['score_ranges']:
            stats = output_validation['score_ranges'][construct_key]
            report_lines.append(
                f"{construct_key}: min={stats['min']:.2f}, max={stats['max']:.2f}, "
                f"mean={stats['mean']:.2f}, nulls={stats['null_count']}"
            )

    report_lines.extend([
        "",
        "NEXT STEPS",
        "-" * 80,
        "1. Review transformation_report.txt for data quality",
        "2. Apply database migration: npm run db:migrate",
        "3. Import transformed data: python scripts/import_capability_wide.py",
        "4. Validate in database: npm run db:validate",
        "",
        "=" * 80,
    ])

    # Write report
    report_dir = Path(REPORT_FILE).parent
    report_dir.mkdir(exist_ok=True)

    with open(REPORT_FILE, 'w') as f:
        f.write('\n'.join(report_lines))

    print(f"\n📄 Report saved to: {REPORT_FILE}")


def main():
    """Main transformation pipeline."""
    print("=" * 80)
    print("CAPABILITY DATA TRANSFORMATION PIPELINE")
    print("=" * 80)
    print(f"Input: {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print("=" * 80)

    # Step 1: Load data
    print("\n📂 Loading capability data...")
    df = pd.read_csv(INPUT_FILE)
    print(f"  ✅ Loaded {len(df):,} rows")

    # Step 2: Validate input
    input_validation = validate_input_data(df)

    # Step 3: Handle duplicates
    df_deduped = handle_duplicates(df)

    # Step 4: Pivot to wide format
    df_wide = pivot_to_wide_format(df_deduped)

    # Step 5: Add company assignments
    df_wide = add_company_assignments(df_wide)

    # Step 6: Map metadata fields
    df_final = map_metadata_fields(df_wide)

    # Step 7: Validate output
    output_validation = validate_output_data(df_final)

    # Step 8: Save transformed data
    print(f"\n💾 Saving transformed data to {OUTPUT_FILE}...")
    output_dir = Path(OUTPUT_FILE).parent
    output_dir.mkdir(exist_ok=True)
    df_final.to_csv(OUTPUT_FILE, index=False)
    print(f"  ✅ Saved {len(df_final):,} rows")

    # Step 9: Generate report
    generate_report(input_validation, output_validation, REPORT_FILE)

    print("\n" + "=" * 80)
    print("✅ TRANSFORMATION COMPLETE!")
    print("=" * 80)
    print(f"Output file: {OUTPUT_FILE}")
    print(f"Report file: {REPORT_FILE}")
    print("\nNext steps:")
    print("1. Review the transformation report")
    print("2. Apply database migration (add industry/continent columns)")
    print("3. Run import script to load data into Supabase")
    print("=" * 80)


if __name__ == "__main__":
    main()
