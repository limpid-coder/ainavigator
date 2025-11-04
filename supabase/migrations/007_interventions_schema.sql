-- Interventions Schema
-- Implements AINAV-10: BIG ONE - NEW INTERVENTIONS
--
-- Data Structure:
-- - 10 interventions across 3 levels (Strategy, Adoption, Innovation)
-- - Mappings to 25 sentiment heatmap cells (5×5 grid)
-- - Mappings to 8 capability dimensions
-- - Next-step progression logic for each intervention

-- ============================================================================
-- 1. INTERVENTIONS TABLE (Master list of all interventions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL, -- A1, A2, B1, B2, etc.
  name TEXT NOT NULL,
  level VARCHAR(100) NOT NULL, -- A (Strategy), B (Adoption), C (Innovation)
  core_function TEXT NOT NULL,
  description TEXT, -- Full description from Word doc
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE interventions IS 'Master list of 10 spotlight interventions across 3 levels';
COMMENT ON COLUMN interventions.code IS 'Intervention code (A1-A3, B1-B5, C1-C2)';
COMMENT ON COLUMN interventions.level IS 'A (Strategy & Governance), B (Adoption & Behaviour), C (Innovation & Experimentation)';

-- ============================================================================
-- 2. SENTIMENT HEATMAP MAPPINGS (25 cells → 3 interventions each)
-- ============================================================================
CREATE TABLE IF NOT EXISTS intervention_sentiment_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- e.g. "The Intrusive AI"
  reason TEXT NOT NULL, -- e.g. "AI is too Autonomous"
  level_name TEXT NOT NULL, -- e.g. "1 - Personal Workflow Preferences"

  -- Cell identification (L1_C1, L1_C2, etc.)
  level_id INT NOT NULL CHECK (level_id BETWEEN 1 AND 5),
  category_id INT NOT NULL CHECK (category_id BETWEEN 1 AND 5),

  -- Three recommended interventions per cell
  primary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  secondary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  tertiary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(level_id, category_id)
);

COMMENT ON TABLE intervention_sentiment_mappings IS 'Maps each of 25 sentiment heatmap cells to 3 recommended interventions';
COMMENT ON COLUMN intervention_sentiment_mappings.level_id IS 'Sentiment level (1-5): 1=Personal, 2=Collaboration, 3=Trust, 4=Career, 5=Org Stability';
COMMENT ON COLUMN intervention_sentiment_mappings.category_id IS 'Reason category (1-5): 1=Autonomous, 2=Inflexible, 3=Emotionless, 4=Opaque, 5=Prefer Human';

-- ============================================================================
-- 3. CAPABILITY DIMENSION MAPPINGS (8 dimensions → 3 interventions each)
-- ============================================================================
CREATE TABLE IF NOT EXISTS intervention_capability_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension_id INT NOT NULL CHECK (dimension_id BETWEEN 1 AND 8) UNIQUE,
  dimension_name TEXT NOT NULL,

  -- Three recommended interventions per dimension
  primary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  secondary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  tertiary_intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),

  rationale TEXT, -- Mechanism of change explanation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE intervention_capability_mappings IS 'Maps each of 8 capability dimensions to 3 recommended interventions';
COMMENT ON COLUMN intervention_capability_mappings.dimension_id IS '1=Strategy&Vision, 2=Data, 3=Technology, 4=Talent&Skills, 5=Org&Processes, 6=Innovation, 7=Adaptation&Adoption, 8=Ethics&Responsibility';

-- ============================================================================
-- 4. NEXT STEPS / PROGRESSION LOGIC (10 interventions → 3 next steps each)
-- ============================================================================
CREATE TABLE IF NOT EXISTS intervention_next_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_code VARCHAR(10) NOT NULL REFERENCES interventions(code),

  -- Three logical next interventions
  primary_next_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  secondary_next_code VARCHAR(10) NOT NULL REFERENCES interventions(code),
  tertiary_next_code VARCHAR(10) NOT NULL REFERENCES interventions(code),

  rationale TEXT, -- Progression logic explanation
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(intervention_code)
);

COMMENT ON TABLE intervention_next_steps IS 'Defines logical next steps for each intervention (progression workflow)';

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_sentiment_mappings_cell ON intervention_sentiment_mappings(level_id, category_id);
CREATE INDEX idx_capability_mappings_dimension ON intervention_capability_mappings(dimension_id);
CREATE INDEX idx_interventions_code ON interventions(code);
CREATE INDEX idx_next_steps_intervention ON intervention_next_steps(intervention_code);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_sentiment_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_capability_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE intervention_next_steps ENABLE ROW LEVEL SECURITY;

-- Public read access (interventions are not company-specific)
CREATE POLICY "Public read access for interventions"
  ON interventions FOR SELECT
  USING (true);

CREATE POLICY "Public read access for sentiment mappings"
  ON intervention_sentiment_mappings FOR SELECT
  USING (true);

CREATE POLICY "Public read access for capability mappings"
  ON intervention_capability_mappings FOR SELECT
  USING (true);

CREATE POLICY "Public read access for next steps"
  ON intervention_next_steps FOR SELECT
  USING (true);
