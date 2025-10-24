# Logical Data Model (3NF)

**Respondent**
| Field | Type | Description |
|--------|------|-------------|
| RespondentID | string | Unique respondent |
| Region | string | Respondent region |
| Department | string | Business unit |
| Employment_type | string | Experience group |
| Age | string | Age group |
| UserLanguage | string | Survey language |

**Session**
| Field | Type | Description |
|--------|------|-------------|
| SessionID | string | Unique session |
| RespondentID | string | Links to Respondent |
| Finished | int | 1 = complete |

**Response**
| Field | Type | Description |
|--------|------|-------------|
| SessionID | string | Links to Session |
| QuestionCode | string | Sentiment question code |
| Score | float | Sentiment rating (1–5) |
