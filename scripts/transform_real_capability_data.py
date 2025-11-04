#!/usr/bin/env python3
"""
Transform Real Capability Data to Wide Format

Transforms the AI_CapScan 3NF fact table into wide format for database import.
Maps dimension_module columns (1_1_1, 1_2_1, etc.) to construct_1..construct_32.

Input: ./data/Database info/AICapability_load_db/AI_CapScan_csv/AI_CapScan_3NF_fact_table.csv
Output: data-foundation/capability_real_wide.csv
"""

import pandas as pd
import sys
from pathlib import Path

# File paths
INPUT_FILE = "./data/Database info/AICapability_load_db/AI_CapScan_csv/AI_CapScan_3NF_fact_table.csv"
CONSTRUCTS_FILE = "./data/Database info/AICapability_load_db/AI_CapScan_Questions_csv/constructs.csv"
OUTPUT_FILE = "data-foundation/capability_real_wide.csv"

# Column mapping: fact table column name → construct_id
# Pattern: {dimension}_{module}_1 maps to construct_id
# Dimension 1 (constructs 1-4): 1_1_1, 1_2_1, 1_3_1, 1_4_1
# Dimension 2 (constructs 5-8): 2_1_1, 2_2_1, 2_3_1, 2_4_1
# etc.
COLUMN_TO_CONSTRUCT = {
    # Dimension 1: Strategy & Vision (constructs 1-4)
    '1_1_1': 1,  # Alignment with Business Goals
    '1_2_1': 2,  # Leadership Commitment
    '1_3_1': 3,  # Long-Term Vision
    '1_4_1': 4,  # Resource Allocation

    # Dimension 2: Data (constructs 5-8)
    '2_1_1': 5,  # Data Quality
    '2_2_1': 6,  # Data Accessibility
    '2_3_1': 7,  # Data Governance Framework
    '2_4_1': 8,  # Data Integration

    # Dimension 3: Technology (constructs 9-12)
    '3_1_1': 9,   # AI Tools and Platforms
    '3_2_1': 10,  # Scalability
    '3_3_1': 11,  # Cloud vs. On-Premises
    '3_4_1': 12,  # Integration and Optimization

    # Dimension 4: Talent & Skills (constructs 13-16)
    '4_1_1': 13,  # AI Skills and Expertise
    '4_2_1': 14,  # Training and Development
    '4_3_1': 15,  # Recruitment and Team Formation
    '4_4_1': 16,  # Cross-Functional Collaboration

    # Dimension 5: Organisation & Processes (constructs 17-20)
    '5_1_1': 17,  # AI Governance and Structure
    '5_2_1': 18,  # Process Integration and Optimization
    '5_3_1': 19,  # Change Management
    '5_4_1': 20,  # AI-Driven Decision Optimization

    # Dimension 6: Innovation (constructs 21-24)
    '6_1_1': 21,  # Prototyping and Experimentation
    '6_2_1': 22,  # Products and Services
    '6_3_1': 23,  # Speed of Implementation
    '6_4_1': 24,  # Innovation Culture and Leadership

    # Dimension 7: Adaptation & Adoption (constructs 25-28)
    '7_1_1': 25,  # Tooldropping
    '7_2_1': 26,  # Jobs
    '7_3_1': 27,  # Engagement
    '7_4_1': 28,  # Confidence/Authority

    # Dimension 8: Ethics & Responsibility (constructs 29-32)
    '8_1_1': 29,  # Ethical AI Framework
    '8_2_1': 30,  # Bias and Fairness
    '8_3_1': 31,  # Transparency and Explainability
    '8_4_1': 32,  # Data Privacy and Security
}

def print_header(text: str):
    """Print formatted header"""
    print("=" * 80)
    print(text)
    print("=" * 80)

def print_step(text: str):
    """Print formatted step"""
    print(f"\n{text}")

def main():
    print_header("REAL CAPABILITY DATA TRANSFORMATION")
    print(f"Input:  {INPUT_FILE}")
    print(f"Output: {OUTPUT_FILE}")
    print_header("")

    # Load data
    print_step("📂 Loading fact table...")
    try:
        df = pd.read_csv(INPUT_FILE)
        print(f"  ✅ Loaded {len(df):,} rows, {len(df.columns)} columns")
    except FileNotFoundError:
        print(f"  ❌ Error: File not found: {INPUT_FILE}")
        sys.exit(1)

    # Load constructs mapping for validation
    print_step("📋 Loading constructs mapping...")
    try:
        constructs = pd.read_csv(CONSTRUCTS_FILE)
        print(f"  ✅ Loaded {len(constructs)} constructs across 8 dimensions")
    except FileNotFoundError:
        print(f"  ❌ Error: File not found: {CONSTRUCTS_FILE}")
        sys.exit(1)

    # Verify all construct columns exist
    print_step("🔍 Verifying column mapping...")
    missing_cols = [col for col in COLUMN_TO_CONSTRUCT.keys() if col not in df.columns]
    if missing_cols:
        print(f"  ❌ Error: Missing columns in fact table: {missing_cols}")
        sys.exit(1)
    print(f"  ✅ All 32 construct columns found in fact table")

    # Extract respondent metadata and scores
    print_step("🔄 Transforming to wide format...")

    # Select relevant columns
    metadata_cols = ['ResponseId_id', 'UserLanguage_id', 'Q1_id', 'Q39_id', 'Q40_id', 'Q41_id', 'is_synthetic']
    construct_cols = list(COLUMN_TO_CONSTRUCT.keys())

    # Create transformed dataframe
    transformed = df[metadata_cols + construct_cols].copy()

    # Rename construct columns to construct_1..construct_32
    rename_map = {col: f'construct_{construct_id}' for col, construct_id in COLUMN_TO_CONSTRUCT.items()}
    transformed.rename(columns=rename_map, inplace=True)

    # Rename metadata columns for clarity
    transformed.rename(columns={
        'ResponseId_id': 'respondent_id',
        'UserLanguage_id': 'user_language',
        'Q1_id': 'region',
        'Q39_id': 'department',
        'Q40_id': 'employment_type',
        'Q41_id': 'age',
        'is_synthetic': 'is_synthetic'
    }, inplace=True)

    # Group by respondent and average scores (handle multiple sessions)
    print_step("📊 Aggregating multiple sessions per respondent...")

    # Count sessions before aggregation
    sessions_per_respondent = transformed.groupby('respondent_id').size()
    total_sessions = len(transformed)
    unique_respondents = len(sessions_per_respondent)

    print(f"  Sessions: {total_sessions:,}")
    print(f"  Unique respondents: {unique_respondents}")
    print(f"  Avg sessions per respondent: {total_sessions/unique_respondents:.1f}")

    # Aggregate: average construct scores, keep first metadata
    agg_dict = {
        'user_language': 'first',
        'region': 'first',
        'department': 'first',
        'employment_type': 'first',
        'age': 'first',
        'is_synthetic': 'first'
    }

    # Add all construct columns to aggregation
    for i in range(1, 33):
        col_name = f'construct_{i}'
        agg_dict[col_name] = 'mean'

    transformed_agg = transformed.groupby('respondent_id').agg(agg_dict).reset_index()

    print(f"  ✅ Aggregated to {len(transformed_agg)} unique respondents")

    # Round construct scores to 2 decimal places
    for i in range(1, 33):
        col_name = f'construct_{i}'
        transformed_agg[col_name] = transformed_agg[col_name].round(2)

    # Add company assignment (will be done during import based on existing respondent data)
    print_step("ℹ️  Note: Company assignment will be handled during import")

    # Save to CSV
    print_step(f"💾 Saving to {OUTPUT_FILE}...")
    Path(OUTPUT_FILE).parent.mkdir(parents=True, exist_ok=True)
    transformed_agg.to_csv(OUTPUT_FILE, index=False)
    print(f"  ✅ Saved {len(transformed_agg)} rows")

    # Generate summary report
    print_step("📈 Transformation Summary:")
    print(f"  Input rows: {total_sessions:,}")
    print(f"  Output rows: {len(transformed_agg)}")
    print(f"  Sessions averaged: {total_sessions - len(transformed_agg):,}")
    print(f"  Constructs per respondent: 32")

    # Score statistics
    print_step("📊 Score Statistics (1-10 scale):")
    for i in range(1, 33):
        col_name = f'construct_{i}'
        scores = transformed_agg[col_name]
        print(f"  Construct {i:2d}: min={scores.min():.1f}, max={scores.max():.1f}, avg={scores.mean():.2f}")

    # Synthetic vs real data
    synthetic_count = transformed_agg['is_synthetic'].sum()
    real_count = len(transformed_agg) - synthetic_count
    print_step("📋 Data Source:")
    print(f"  Real data: {real_count}")
    print(f"  Synthetic data: {synthetic_count}")

    print_header("✅ TRANSFORMATION COMPLETE!")
    print(f"Next: Run import script to load into Supabase")
    print(f"  python3 scripts/import_real_capability_data.py")
    print_header("")

if __name__ == "__main__":
    main()
