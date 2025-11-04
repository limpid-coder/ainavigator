-- Add Industry and Continent Fields for Capability Benchmarking
-- Extends respondents table with new metadata fields from capability data

-- Add new columns for capability metadata
ALTER TABLE respondents
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS continent TEXT;

-- Add indexes for benchmark filtering performance
CREATE INDEX IF NOT EXISTS idx_respondents_industry ON respondents(industry);
CREATE INDEX IF NOT EXISTS idx_respondents_continent ON respondents(continent);
CREATE INDEX IF NOT EXISTS idx_respondents_industry_region ON respondents(industry, region);
CREATE INDEX IF NOT EXISTS idx_respondents_continent_department ON respondents(continent, department);

-- Add comments for documentation
COMMENT ON COLUMN respondents.industry IS 'Industry segment for benchmark filtering (e.g., Financial Services, Technology, Healthcare)';
COMMENT ON COLUMN respondents.continent IS 'Continental region for global benchmarking (e.g., Europe, Asia, North America)';

-- Optional: Add check constraints for data quality (uncomment if you want to enforce specific values)
-- ALTER TABLE respondents ADD CONSTRAINT check_industry
--   CHECK (industry IN ('Financial Services', 'Technology', 'Healthcare', 'Manufacturing', 'Education', 'Government', NULL));

-- ALTER TABLE respondents ADD CONSTRAINT check_continent
--   CHECK (continent IN ('Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania', NULL));
