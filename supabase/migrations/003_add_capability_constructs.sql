-- Add Capability Construct Columns to Respondents Table
-- Extends the respondents table with 32 construct scores for capability assessment

-- Add construct columns (construct_1 through construct_32)
-- Each construct score is expected to be on a 1-5 scale (Likert-style rating)

ALTER TABLE respondents
  ADD COLUMN IF NOT EXISTS construct_1 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_2 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_3 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_4 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_5 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_6 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_7 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_8 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_9 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_10 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_11 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_12 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_13 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_14 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_15 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_16 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_17 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_18 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_19 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_20 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_21 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_22 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_23 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_24 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_25 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_26 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_27 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_28 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_29 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_30 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_31 DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS construct_32 DECIMAL(5,2);

-- Add indexes for capability queries (aggregate by dimension)
CREATE INDEX IF NOT EXISTS idx_respondents_constructs_1_4 ON respondents(construct_1, construct_2, construct_3, construct_4);
CREATE INDEX IF NOT EXISTS idx_respondents_constructs_5_8 ON respondents(construct_5, construct_6, construct_7, construct_8);
CREATE INDEX IF NOT EXISTS idx_respondents_constructs_9_12 ON respondents(construct_9, construct_10, construct_11, construct_12);
CREATE INDEX IF NOT EXISTS idx_respondents_constructs_13_16 ON respondents(construct_13, construct_14, construct_15, construct_16);

-- Add comment for documentation
COMMENT ON TABLE respondents IS 'Respondent data including sentiment scores (sentiment_1..25) and capability construct scores (construct_1..32)';
