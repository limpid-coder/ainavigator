# CSV Schema – AI Navigator MVP

## Sentiment Data (sentiment_demo.csv)
Each row = one respondent.

| Column | Type | Example | Description |
|--------|------|----------|-------------|
| RespondentID | string | R001 | Unique respondent |
| Region | string | Utrecht | Region label |
| Department | string | HR | Business unit |
| Employment_type | string | 10–20 year | Tenure group |
| Age | string | 25–35 | Age group |
| UserLanguage | string | NL | Survey language |
| Sentiment_1 … Sentiment_25 | number (1–5) | 3.8 | Sentiment scores (averaged if duplicate sessions) |
