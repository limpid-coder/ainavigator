-- Remove Capability Construct Columns from Respondents Table
-- Capability data is now properly stored in capability_scores table (LONG format)
-- These WIDE format columns in respondents table are no longer needed

-- Drop indexes first (created in migration 003)
DROP INDEX IF EXISTS idx_respondents_constructs_1_4;
DROP INDEX IF EXISTS idx_respondents_constructs_5_8;
DROP INDEX IF EXISTS idx_respondents_constructs_9_12;
DROP INDEX IF EXISTS idx_respondents_constructs_13_16;

-- Remove construct columns (construct_1 through construct_32)
ALTER TABLE respondents
  DROP COLUMN IF EXISTS construct_1,
  DROP COLUMN IF EXISTS construct_2,
  DROP COLUMN IF EXISTS construct_3,
  DROP COLUMN IF EXISTS construct_4,
  DROP COLUMN IF EXISTS construct_5,
  DROP COLUMN IF EXISTS construct_6,
  DROP COLUMN IF EXISTS construct_7,
  DROP COLUMN IF EXISTS construct_8,
  DROP COLUMN IF EXISTS construct_9,
  DROP COLUMN IF EXISTS construct_10,
  DROP COLUMN IF EXISTS construct_11,
  DROP COLUMN IF EXISTS construct_12,
  DROP COLUMN IF EXISTS construct_13,
  DROP COLUMN IF EXISTS construct_14,
  DROP COLUMN IF EXISTS construct_15,
  DROP COLUMN IF EXISTS construct_16,
  DROP COLUMN IF EXISTS construct_17,
  DROP COLUMN IF EXISTS construct_18,
  DROP COLUMN IF EXISTS construct_19,
  DROP COLUMN IF EXISTS construct_20,
  DROP COLUMN IF EXISTS construct_21,
  DROP COLUMN IF EXISTS construct_22,
  DROP COLUMN IF EXISTS construct_23,
  DROP COLUMN IF EXISTS construct_24,
  DROP COLUMN IF EXISTS construct_25,
  DROP COLUMN IF EXISTS construct_26,
  DROP COLUMN IF EXISTS construct_27,
  DROP COLUMN IF EXISTS construct_28,
  DROP COLUMN IF EXISTS construct_29,
  DROP COLUMN IF EXISTS construct_30,
  DROP COLUMN IF EXISTS construct_31,
  DROP COLUMN IF EXISTS construct_32;

-- Update table comment to reflect correct structure
COMMENT ON TABLE respondents IS 'Respondent sentiment data with 25 sentiment scores (sentiment_1..25) for 5x5 heatmap analysis. Capability scores are stored separately in capability_scores table.';
