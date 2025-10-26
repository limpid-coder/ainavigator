#!/usr/bin/env python3
"""
Convert sentiment_demo.csv to SQL INSERT statements
"""
import csv
import sys

# Company ID for Acme Corp
COMPANY_ID = '550e8400-e29b-41d4-a716-446655440001'

def csv_to_sql(csv_path, output_path):
    """Convert CSV to SQL INSERT statements"""
    
    with open(csv_path, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        with open(output_path, 'w', encoding='utf-8') as sqlfile:
            # Write header
            sqlfile.write("-- =============================================\n")
            sqlfile.write("-- AI Navigator - Complete Demo Data Import\n")
            sqlfile.write("-- =============================================\n\n")
            
            # Insert companies
            sqlfile.write("-- Insert demo companies\n")
            sqlfile.write("INSERT INTO public.companies (id, name, display_name, logo_url) VALUES\n")
            sqlfile.write("  ('550e8400-e29b-41d4-a716-446655440001', 'acme-corp', 'Acme Corporation', null),\n")
            sqlfile.write("  ('550e8400-e29b-41d4-a716-446655440002', 'tech-innovations', 'Tech Innovations', null),\n")
            sqlfile.write("  ('550e8400-e29b-41d4-a716-446655440003', 'global-solutions', 'Global Solutions', null)\n")
            sqlfile.write("ON CONFLICT (name) DO NOTHING;\n\n")
            
            # Insert demo users
            sqlfile.write("-- Insert demo users (password is 'demo123' for all)\n")
            sqlfile.write("INSERT INTO public.demo_users (email, password_hash, company_id, full_name, role) VALUES\n")
            sqlfile.write("  ('demo@acme-corp.com', 'demo123', '550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'Chief AI Officer'),\n")
            sqlfile.write("  ('demo@tech-innovations.com', 'demo123', '550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'VP of Digital Transformation'),\n")
            sqlfile.write("  ('demo@global-solutions.com', 'demo123', '550e8400-e29b-41d4-a716-446655440003', 'Emma Rodriguez', 'Director of AI Strategy')\n")
            sqlfile.write("ON CONFLICT (email) DO NOTHING;\n\n")
            
            # Start respondents insert
            sqlfile.write("-- Insert all respondent data from CSV\n")
            sqlfile.write("INSERT INTO public.respondents (\n")
            sqlfile.write("  company_id, respondent_id, region, department, employment_type, age, user_language,\n")
            sqlfile.write("  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5,\n")
            sqlfile.write("  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,\n")
            sqlfile.write("  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,\n")
            sqlfile.write("  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,\n")
            sqlfile.write("  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25\n")
            sqlfile.write(") VALUES\n")
            
            # Process CSV rows
            rows = []
            for row in reader:
                values = [
                    f"'{COMPANY_ID}'",
                    f"'{row['RespondentID']}'",
                    f"'{row['Region'].replace(chr(39), chr(39)+chr(39))}'",  # Escape single quotes
                    f"'{row['Department'].replace(chr(39), chr(39)+chr(39))}'",
                    f"'{row['Employment_type'].replace(chr(39), chr(39)+chr(39))}'",
                    f"'{row['Age']}'",
                    f"'{row['UserLanguage']}'"
                ]
                
                # Add all sentiment scores
                for i in range(1, 26):
                    sentiment_key = f'Sentiment_{i}'
                    value = row[sentiment_key]
                    # Handle NULL/empty values
                    if value and value.strip():
                        values.append(value)
                    else:
                        values.append('NULL')
                
                rows.append(f"  ({', '.join(values)})")
            
            # Write all rows
            sqlfile.write(',\n'.join(rows))
            sqlfile.write(';\n')
            
            print(f"Successfully converted {len(rows)} rows to SQL")
            print(f"Output file: {output_path}")

if __name__ == '__main__':
    csv_path = 'data-foundation/sentiment_demo.csv'
    output_path = 'supabase/import_all_data.sql'
    
    print(f"Converting {csv_path} to SQL...")
    csv_to_sql(csv_path, output_path)
    print("Done!")

