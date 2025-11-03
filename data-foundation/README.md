# Data Foundation – Milestone 1

Contains demo dataset and schema for the AI Navigator MVP upload and sentiment heatmap module.

## Files
- `sentiment_demo.csv` – Cleaned, denormalized sentiment dataset
- `csv_schema_definition.md` – Column definitions and validation rules
- `data_model.md` – Logical 3NF reference

## Usage
Use this data for testing `/api/upload` and rendering the 25-area sentiment heatmap.  
Each row = one respondent (1–5 sentiment scores).  
Scores may be decimals if respondents had multiple sessions (averaged for accuracy).
