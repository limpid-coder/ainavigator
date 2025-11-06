-- Taboos Schema
-- Implements AINAV-30: Taboos within the Sentiment areas
--
-- Data Structure:
-- - 100 taboos mapped to the 25 sentiment heatmap cells (5×5 grid)
-- - 4 taboos per cell (100 ÷ 25 = 4)
-- - Each taboo represents a specific resistance pattern to AI adoption

-- ============================================================================
-- TABOOS TABLE (All 100 taboos with sentiment cell mapping)
-- ============================================================================
CREATE TABLE IF NOT EXISTS taboos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL, -- e.g. "Adaptation", "Alienation"
  short_description TEXT NOT NULL, -- One-line summary
  description TEXT NOT NULL, -- Full explanation of the taboo
  how_it_shows_up TEXT NOT NULL, -- How it manifests in work practice
  possible_actions TEXT NOT NULL, -- Recommended actions to address

  -- Sentiment cell mapping (maps to 5×5 heatmap grid)
  level_id INT NOT NULL CHECK (level_id BETWEEN 1 AND 5),
  level_name TEXT NOT NULL,
  category_id INT NOT NULL CHECK (category_id BETWEEN 1 AND 5),
  root_cause TEXT NOT NULL,
  root_cause_explanation TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE taboos IS '100 AI adoption taboos mapped to 25 sentiment heatmap cells (4 per cell)';
COMMENT ON COLUMN taboos.level_id IS 'Sentiment level (1-5): 1=Personal, 2=Collaboration, 3=Trust, 4=Career, 5=Org Stability';
COMMENT ON COLUMN taboos.category_id IS 'Root cause category (1-5): 1=Too Autonomous, 2=Too Inflexible, 3=Emotionless, 4=Too Opaque, 5=Prefer Human';
COMMENT ON COLUMN taboos.root_cause IS 'One of: AI is too autonomous, AI is too inflexible, AI is emotionless, AI is too opaque, People prefer human interaction';

-- ============================================================================
-- INDEXES for efficient querying by sentiment cell
-- ============================================================================
CREATE INDEX idx_taboos_cell ON taboos(level_id, category_id);
CREATE INDEX idx_taboos_level ON taboos(level_id);
CREATE INDEX idx_taboos_category ON taboos(category_id);
CREATE INDEX idx_taboos_name ON taboos(name);

-- ============================================================================
-- HELPER VIEW: Taboos grouped by sentiment cell
-- ============================================================================
CREATE OR REPLACE VIEW taboos_by_cell AS
SELECT
  level_id,
  category_id,
  level_name,
  root_cause,
  COUNT(*) as taboo_count,
  json_agg(
    json_build_object(
      'id', id,
      'name', name,
      'short_description', short_description,
      'description', description,
      'how_it_shows_up', how_it_shows_up,
      'possible_actions', possible_actions,
      'root_cause_explanation', root_cause_explanation
    )
    ORDER BY name
  ) as taboos
FROM taboos
GROUP BY level_id, category_id, level_name, root_cause
ORDER BY level_id, category_id;

COMMENT ON VIEW taboos_by_cell IS 'Aggregates all taboos grouped by sentiment heatmap cell (should be 4 per cell)';
