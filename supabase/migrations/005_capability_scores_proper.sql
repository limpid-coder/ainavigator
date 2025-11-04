-- Capability Scores Table (LONG Format)
-- Matches the data scientist's capability_demo.csv structure
-- One row per construct score per respondent

CREATE TABLE IF NOT EXISTS capability_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  respondent_id TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  dimension_id INTEGER NOT NULL CHECK (dimension_id BETWEEN 1 AND 8),
  dimension TEXT NOT NULL,
  construct_id INTEGER NOT NULL CHECK (construct_id BETWEEN 1 AND 32),
  construct TEXT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  industry_synthetic TEXT,
  country_synthetic TEXT,
  continent_synthetic TEXT,
  role_synthetic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, respondent_id, construct_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_capability_scores_respondent ON capability_scores(respondent_id);
CREATE INDEX IF NOT EXISTS idx_capability_scores_company ON capability_scores(company_id);
CREATE INDEX IF NOT EXISTS idx_capability_scores_dimension ON capability_scores(dimension_id);
CREATE INDEX IF NOT EXISTS idx_capability_scores_construct ON capability_scores(construct_id);
CREATE INDEX IF NOT EXISTS idx_capability_scores_industry ON capability_scores(industry_synthetic);
CREATE INDEX IF NOT EXISTS idx_capability_scores_continent ON capability_scores(continent_synthetic);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_capability_scores_company_dimension
  ON capability_scores(company_id, dimension_id);
CREATE INDEX IF NOT EXISTS idx_capability_scores_company_construct
  ON capability_scores(company_id, construct_id);

-- Row Level Security
ALTER TABLE capability_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view capability scores from their company"
  ON capability_scores FOR SELECT
  USING (company_id IN (SELECT company_id FROM demo_users WHERE email = current_setting('app.user_email', true)));

-- Comment on table
COMMENT ON TABLE capability_scores IS 'Capability maturity scores in LONG format - one row per construct score per respondent. Matches data scientist capability_demo.csv structure.';
