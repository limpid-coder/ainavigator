-- Load sentiment data from CSV
-- Run this after uploading sentiment_demo.csv to Supabase Storage or using local CSV

-- Option 1: If you have the CSV in Supabase storage/local and can use COPY command
-- COPY respondents (
--   respondent_id, region, department, employment_type, age, user_language,
--   sentiment_1, sentiment_10, sentiment_11, sentiment_12, sentiment_13, sentiment_14,
--   sentiment_15, sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_2,
--   sentiment_20, sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25,
--   sentiment_3, sentiment_4, sentiment_5, sentiment_6, sentiment_7, sentiment_8, sentiment_9
-- )
-- FROM '/path/to/sentiment_demo.csv'
-- WITH (FORMAT csv, HEADER true);

-- Option 2: Load data and distribute to demo companies
-- This temp table matches your CSV column order
CREATE TEMP TABLE temp_sentiment_import (
  respondent_id TEXT,
  region TEXT,
  department TEXT,
  employment_type TEXT,
  age TEXT,
  user_language TEXT,
  sentiment_1 DECIMAL(10,6),
  sentiment_10 DECIMAL(10,6),
  sentiment_11 DECIMAL(10,6),
  sentiment_12 DECIMAL(10,6),
  sentiment_13 DECIMAL(10,6),
  sentiment_14 DECIMAL(10,6),
  sentiment_15 DECIMAL(10,6),
  sentiment_16 DECIMAL(10,6),
  sentiment_17 DECIMAL(10,6),
  sentiment_18 DECIMAL(10,6),
  sentiment_19 DECIMAL(10,6),
  sentiment_2 DECIMAL(10,6),
  sentiment_20 DECIMAL(10,6),
  sentiment_21 DECIMAL(10,6),
  sentiment_22 DECIMAL(10,6),
  sentiment_23 DECIMAL(10,6),
  sentiment_24 DECIMAL(10,6),
  sentiment_25 DECIMAL(10,6),
  sentiment_3 DECIMAL(10,6),
  sentiment_4 DECIMAL(10,6),
  sentiment_5 DECIMAL(10,6),
  sentiment_6 DECIMAL(10,6),
  sentiment_7 DECIMAL(10,6),
  sentiment_8 DECIMAL(10,6),
  sentiment_9 DECIMAL(10,6)
);

-- After loading into temp table, distribute to companies
-- Assign first 1/3 to acme-corp
INSERT INTO respondents (
  company_id, respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5, 
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
)
SELECT 
  (SELECT id FROM companies WHERE name = 'acme-corp'),
  respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5,
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
FROM temp_sentiment_import
LIMIT 1150;

-- Assign second 1/3 to tech-innovations
INSERT INTO respondents (
  company_id, respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5, 
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
)
SELECT 
  (SELECT id FROM companies WHERE name = 'tech-innovations'),
  respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5,
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
FROM temp_sentiment_import
OFFSET 1150 LIMIT 1150;

-- Assign remaining to global-solutions
INSERT INTO respondents (
  company_id, respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5, 
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
)
SELECT 
  (SELECT id FROM companies WHERE name = 'global-solutions'),
  respondent_id, region, department, employment_type, age, user_language,
  sentiment_1, sentiment_2, sentiment_3, sentiment_4, sentiment_5,
  sentiment_6, sentiment_7, sentiment_8, sentiment_9, sentiment_10,
  sentiment_11, sentiment_12, sentiment_13, sentiment_14, sentiment_15,
  sentiment_16, sentiment_17, sentiment_18, sentiment_19, sentiment_20,
  sentiment_21, sentiment_22, sentiment_23, sentiment_24, sentiment_25
FROM temp_sentiment_import
OFFSET 2300;

DROP TABLE temp_sentiment_import;


