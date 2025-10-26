#!/usr/bin/env python3
"""
Import CSV data directly to Supabase using the API
"""
import csv
import os
from pathlib import Path
from supabase import create_client, Client

# Load environment variables from .env.local
def load_env():
    env_file = Path('.env.local')
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
    
load_env()

# Get Supabase credentials from environment
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing Supabase credentials!")
    print("Please ensure .env.local contains:")
    print("  NEXT_PUBLIC_SUPABASE_URL=your-url")
    print("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key")
    exit(1)

# Company ID for Acme Corp
COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

def setup_supabase() -> Client:
    """Initialize Supabase client"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def insert_companies(supabase: Client):
    """Insert demo companies"""
    print("Inserting companies...")
    companies = [
        {
            'id': '550e8400-e29b-41d4-a716-446655440001',
            'name': 'acme-corp',
            'display_name': 'Acme Corporation'
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440002',
            'name': 'tech-innovations',
            'display_name': 'Tech Innovations'
        },
        {
            'id': '550e8400-e29b-41d4-a716-446655440003',
            'name': 'global-solutions',
            'display_name': 'Global Solutions'
        }
    ]
    
    for company in companies:
        try:
            supabase.table('companies').upsert(company, on_conflict='name').execute()
            print(f"  [OK] {company['display_name']}")
        except Exception as e:
            print(f"  [ERROR] {company['display_name']}: {str(e)}")

def insert_users(supabase: Client):
    """Insert demo users"""
    print("\nInserting demo users...")
    users = [
        {
            'email': 'demo@acme-corp.com',
            'password_hash': 'demo123',
            'company_id': '550e8400-e29b-41d4-a716-446655440001',
            'full_name': 'Sarah Johnson',
            'role': 'Chief AI Officer'
        },
        {
            'email': 'demo@tech-innovations.com',
            'password_hash': 'demo123',
            'company_id': '550e8400-e29b-41d4-a716-446655440002',
            'full_name': 'Michael Chen',
            'role': 'VP of Digital Transformation'
        },
        {
            'email': 'demo@global-solutions.com',
            'password_hash': 'demo123',
            'company_id': '550e8400-e29b-41d4-a716-446655440003',
            'full_name': 'Emma Rodriguez',
            'role': 'Director of AI Strategy'
        }
    ]
    
    for user in users:
        try:
            supabase.table('demo_users').upsert(user, on_conflict='email').execute()
            print(f"  [OK] {user['email']}")
        except Exception as e:
            print(f"  [ERROR] {user['email']}: {str(e)}")

def insert_respondents_batch(supabase: Client, csv_path: str, batch_size: int = 100):
    """Insert respondents in batches"""
    print(f"\nImporting respondents from CSV (batch size: {batch_size})...")
    
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        batch = []
        total = 0
        
        for row in reader:
            respondent = {
                'company_id': COMPANY_ID,
                'respondent_id': row['RespondentID'],
                'region': row['Region'],
                'department': row['Department'],
                'employment_type': row['Employment_type'],
                'age': row['Age'],
                'user_language': row['UserLanguage']
            }
            
            # Add sentiment scores
            for i in range(1, 26):
                sentiment_key = f'Sentiment_{i}'
                value = row[sentiment_key]
                respondent[f'sentiment_{i}'] = float(value) if value and value.strip() else None
            
            batch.append(respondent)
            
            # Insert batch when it reaches batch_size
            if len(batch) >= batch_size:
                try:
                    supabase.table('respondents').insert(batch).execute()
                    total += len(batch)
                    print(f"  [OK] Imported {total} respondents...")
                    batch = []
                except Exception as e:
                    print(f"  [ERROR] Error inserting batch: {str(e)}")
                    batch = []
        
        # Insert remaining batch
        if batch:
            try:
                supabase.table('respondents').insert(batch).execute()
                total += len(batch)
                print(f"  [OK] Imported {total} respondents...")
            except Exception as e:
                print(f"  [ERROR] Error inserting final batch: {str(e)}")
        
        print(f"\n[SUCCESS] Total respondents imported: {total}")

def main():
    print("=" * 50)
    print("AI Navigator - Supabase Data Import")
    print("=" * 50)
    
    # Initialize Supabase
    supabase = setup_supabase()
    
    # Insert data
    insert_companies(supabase)
    insert_users(supabase)
    insert_respondents_batch(supabase, 'data-foundation/sentiment_demo.csv', batch_size=100)
    
    print("\n" + "=" * 50)
    print("[SUCCESS] Import complete!")
    print("=" * 50)
    print("\nYou can now login with:")
    print("  Email: demo@acme-corp.com")
    print("  Password: demo123")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nImport cancelled by user.")
    except Exception as e:
        print(f"\n[ERROR] {str(e)}")

