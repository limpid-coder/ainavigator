#!/usr/bin/env python3
"""
Import Taboos Data to Supabase
Implements AINAV-30: Taboos within the Sentiment areas

This script:
1. Reads taboos_extracted.json (100 taboos)
2. Maps root causes to category IDs (1-5)
3. Imports all taboos to the 'taboos' table in Supabase
4. Each of the 25 sentiment cells gets exactly 4 taboos
"""

import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Initialize Supabase client
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise Exception('Missing Supabase credentials in .env.local')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Root cause to category_id mapping
ROOT_CAUSE_TO_CATEGORY = {
    'AI is too autonomous': 1,
    'AI is too inflexible': 2,
    'AI is emotionless': 3,
    'AI is too opaque': 4,
    'People prefer human interaction': 5
}

def import_taboos():
    """Import all taboos from JSON to Supabase"""

    print("🔍 Loading taboos from JSON...")

    # Load the extracted taboos
    with open('data/taboos_extracted.json', 'r', encoding='utf-8') as f:
        taboos_data = json.load(f)

    print(f"✅ Loaded {len(taboos_data)} taboos")

    # Transform data for database insertion
    print("\n🔄 Transforming taboos data...")

    taboos_for_db = []
    for taboo in taboos_data:
        # Map root cause to category_id
        category_id = ROOT_CAUSE_TO_CATEGORY.get(taboo['root_cause'])

        if not category_id:
            print(f"⚠️  Warning: Unknown root cause '{taboo['root_cause']}' for taboo '{taboo['name']}'")
            continue

        taboo_record = {
            'name': taboo['name'],
            'short_description': taboo['short_description'],
            'description': taboo['description'],
            'how_it_shows_up': taboo['how_it_shows_up'],
            'possible_actions': taboo['possible_actions'],
            'level_id': taboo['level'],
            'level_name': taboo['level_name'],
            'category_id': category_id,
            'root_cause': taboo['root_cause'],
            'root_cause_explanation': taboo['root_cause_explanation']
        }

        taboos_for_db.append(taboo_record)

    print(f"✅ Transformed {len(taboos_for_db)} taboos for database")

    # Verify distribution
    print("\n📊 Distribution by Level:")
    level_counts = {}
    for taboo in taboos_for_db:
        level_counts[taboo['level_id']] = level_counts.get(taboo['level_id'], 0) + 1

    for level_id in sorted(level_counts.keys()):
        print(f"   Level {level_id}: {level_counts[level_id]} taboos")

    print("\n📊 Distribution by Category:")
    category_counts = {}
    for taboo in taboos_for_db:
        category_counts[taboo['category_id']] = category_counts.get(taboo['category_id'], 0) + 1

    for cat_id in sorted(category_counts.keys()):
        print(f"   Category {cat_id}: {category_counts[cat_id]} taboos")

    print("\n📊 Distribution by Cell (should be 4 per cell):")
    cell_counts = {}
    for taboo in taboos_for_db:
        cell_key = f"L{taboo['level_id']}_C{taboo['category_id']}"
        cell_counts[cell_key] = cell_counts.get(cell_key, 0) + 1

    for cell_key in sorted(cell_counts.keys()):
        count = cell_counts[cell_key]
        status = "✅" if count == 4 else "⚠️"
        print(f"   {status} {cell_key}: {count} taboos")

    # Clear existing data
    print("\n🗑️  Clearing existing taboos...")
    try:
        supabase.table('taboos').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("✅ Existing taboos cleared")
    except Exception as e:
        print(f"ℹ️  No existing taboos to clear (table might be empty): {e}")

    # Insert taboos
    print("\n📥 Importing taboos to Supabase...")

    # Insert in batches of 20
    batch_size = 20
    total_inserted = 0

    for i in range(0, len(taboos_for_db), batch_size):
        batch = taboos_for_db[i:i + batch_size]

        try:
            result = supabase.table('taboos').insert(batch).execute()
            total_inserted += len(batch)
            print(f"   ✅ Inserted batch {i//batch_size + 1} ({len(batch)} taboos)")
        except Exception as e:
            print(f"   ❌ Error inserting batch {i//batch_size + 1}: {e}")
            # Try inserting one by one for this batch
            for taboo in batch:
                try:
                    supabase.table('taboos').insert(taboo).execute()
                    total_inserted += 1
                    print(f"      ✅ Inserted '{taboo['name']}'")
                except Exception as e2:
                    print(f"      ❌ Failed to insert '{taboo['name']}': {e2}")

    print(f"\n✅ Import complete! Total taboos inserted: {total_inserted}")

    # Verify the import
    print("\n🔍 Verifying import...")
    result = supabase.table('taboos').select('count', count='exact').execute()
    db_count = result.count if hasattr(result, 'count') else 0
    print(f"✅ Taboos in database: {db_count}")

    if db_count == len(taboos_for_db):
        print("✅ All taboos successfully imported!")
    else:
        print(f"⚠️  Warning: Expected {len(taboos_for_db)} taboos, but found {db_count} in database")

if __name__ == '__main__':
    print("=" * 60)
    print("Taboos Data Import")
    print("=" * 60)
    import_taboos()
    print("\n" + "=" * 60)
    print("Import Complete!")
    print("=" * 60)
