# AI Navigator - Correct Product Specification
**Professional Consulting Platform for AI Readiness Assessment**

## What This Actually Is

### The Business Model
1. **LeadingWith.AI** conducts AI readiness assessments at enterprise clients
2. Consultants collect survey data from employees (sentiment + capability)
3. Data is processed, cleaned, and curated by your team
4. **AI Navigator** is the platform used to present findings to client executives
5. Platform generates insights, recommendations, and actionable plans
6. Client receives professional report and implementation roadmap

### Primary Users
**Consultant (You)**
- Upload processed client data
- Configure client profile (industry, size, context)
- Run analysis and generate insights
- Present findings in live session with client executives
- Export professional report for client

**Client Executive (End Viewer)**
- Views their organization's results in dashboard
- Explores sentiment and capability data
- Filters by department, region, etc.
- Understands gaps and priorities
- Reviews recommended interventions
- Makes decisions on next steps

---

## The Complete User Flow (Consultant + Client)

### PRE-SESSION: Consultant Preparation (10-15 min)

**Step 1: Create Client Project**
```
┌──────────────────────────────────────┐
│ New Client Project                   │
│                                      │
│ Client Name: Acme Financial Services │
│ Industry: [Financial Services ▼]     │
│ Size: [1000-5000 employees ▼]        │
│ Region: [Europe ▼]                   │
│ Assessment Date: [10/27/2025]        │
│                                      │
│ Primary Contact:                     │
│ Name: Sarah Chen                     │
│ Role: Chief Innovation Officer       │
│                                      │
│ [Create Project] →                   │
└──────────────────────────────────────┘
```

**Step 2: Upload Curated Data**
```
┌──────────────────────────────────────────┐
│ Upload Assessment Data                   │
│ Project: Acme Financial Services         │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 📄 Sentiment Survey Results         │ │
│ │                                     │ │
│ │ Drop CSV here or click to browse    │ │
│ │                                     │ │
│ │ Expected: 25 sentiment columns      │ │
│ │ + Demographics (region, dept, etc.) │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 📄 Capability Assessment Results    │ │
│ │                                     │ │
│ │ Drop CSV here or click to browse    │ │
│ │                                     │ │
│ │ Expected: 32 capability scores      │ │
│ │ + Open-ended responses              │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ✓ Sentiment: 1,247 responses loaded     │
│ ✓ Capability: 1,189 responses loaded    │
│ ✓ Data validated and ready              │
│                                          │
│ [Continue to Analysis] →                 │
└──────────────────────────────────────────┘
```

**Step 3: Run AI Analysis (Behind the scenes)**
```
Processing...
✓ Calculating sentiment heatmap
✓ Ranking 25 cells (relative scoring)
✓ Identifying lowest 5 scores
✓ Generating problem categories with GPT-4...
✓ Calculating capability dimensions
✓ Identifying gaps vs benchmarks
✓ Summarizing open-ended responses with GPT-4...
✓ Matching interventions to gaps
✓ Calculating ROI estimates

Analysis complete. Ready to present.
```

**Step 4: Review Dashboard Before Client Meeting**
- Check all calculations look correct
- Review GPT-generated insights
- Prepare talking points
- Set up presentation mode

---

### LIVE SESSION: Client Presentation (20-30 min)

**Presentation Mode Features:**
- Full screen dashboard
- Hide consultant controls
- Client branding (logo, colors)
- Smooth navigation
- No technical jargon

#### Session Flow:

**Opening (3 min): Overview**
```
"We surveyed 1,247 employees across your organization. 
Here's what we found..."

[Show Overview Dashboard]
- Overall Readiness: 62%
- Sentiment Average: 3.2/5
- Capability Maturity: 4.1/5
- Key insight bubbles
```

**Part 1 (8-10 min): Sentiment Deep-Dive**
```
"Let's look at how your people FEEL about AI..."

[Show Sentiment Heatmap]
- Point out: "Green areas = ready, Red = resistance"
- "Notice: Strong concerns around transparency (AI too opaque)"
- Apply filter: "Let's look at your Finance department specifically"
- Click red cell: "Here's what 23 people are worried about"

[Show GPT-Generated Problem Categories]
- "Our AI analyzed the lowest scores and identified 3 key challenges"
- Click "The Risky AI": Read description
- "This affects 23 people at the organizational leadership level"
```

**Part 2 (8-10 min): Capability Assessment**
```
"Now let's see how READY you are from a capability standpoint..."

[Show Capability Radar]
- "8 dimensions of AI maturity"
- "You're strong in Ethics and Innovation"
- "Data is your biggest gap - 4.1 vs 5.5 industry benchmark"

[Click Data dimension]
- "Let's drill into why Data is low"
- Show 4 constructs
- "Data Accessibility and Integration are the weak points"

[Show GPT Summary]
- "Here's what employees said in open-ended responses"
- Read key themes about data challenges
```

**Part 3 (5-7 min): Recommendations**
```
"Based on these gaps, here's what we recommend..."

[Show Intervention List]
- "We've matched 5 interventions to your specific gaps"
- "#1 Priority: Data Readiness Transformation"
  - Shows: Addresses Data gap + Opacity concerns
  - ROI: 30-50% reduction in AI project failures
  - Timeline: 12 weeks
  - Cost: $250-500K investment, estimated savings

[Client selects 2-3 they want to explore]
- Show detailed implementation plans
- Discuss resources, timeline, stakeholders
```

**Closing (3 min): Next Steps**
```
"Here's your action plan..."

[Export PDF Report]
- "You'll receive this 25-page report with all findings"
- "Includes: Data analysis, recommendations, ROI estimates"
- "Ready to share with your board"

[Schedule Implementation]
- "Let's schedule a workshop to plan execution"
- "We can help with implementation support"
```

---

## Platform Features (Consultant View)

### Client Management
```
Dashboard shows all client projects:

┌─────────────────────────────────────┐
│ Your Client Projects                │
│                                     │
│ ┌─────────────────────────────────┐│
│ │ Acme Financial Services         ││
│ │ Assessment: Oct 27, 2025        ││
│ │ Status: Analysis Complete       ││
│ │ 1,247 responses                 ││
│ │ [Open Dashboard] [Export]       ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─────────────────────────────────┐│
│ │ TechCorp Industries             ││
│ │ Assessment: Oct 15, 2025        ││
│ │ Status: Awaiting Data           ││
│ │ [Upload Data] [Configure]       ││
│ └─────────────────────────────────┘│
│                                     │
│ [+ New Client Project]              │
└─────────────────────────────────────┘
```

### Data Management
- Upload CSVs for each client
- Data validation with helpful errors
- Re-process if client provides updated data
- Version history: "Assessment v1.0 (Oct 27)" vs "Assessment v2.0 (Nov 15)"

### AI Analysis Controls
- "Regenerate Insights" button (if data changes)
- "Customize Problem Categories" (edit GPT outputs if needed)
- "Add Custom Interventions" (beyond standard library)
- "Adjust Benchmarks" (use different industry comparisons)

### Presentation Mode
- Toggle: "Consultant View" ↔ "Client View"
- Client View: Clean, professional, branded
- Consultant View: Shows controls, notes, admin features

---

## Platform Features (Client View)

### Navigation
- Clean, intuitive top nav
- Progress breadcrumbs: "Overview > Sentiment > Problem Categories"
- Always visible: "Export Report" button

### Filtering
- Persistent filter panel (slide-in from right)
- Real-time updates when filters change
- Show: "Showing 347 of 1,247 responses (Finance dept only)"

### Insights
- AI-generated summaries throughout
- Clear labeling: "AI Analysis" badge
- "Regenerate" option if they want fresh take

### Interactivity
- Click any chart element for details
- Drill down unlimited levels
- Compare segments side-by-side
- Bookmark interesting findings

### Export
- PDF: Professional 25-page report
- PowerPoint: Key slides for board presentation
- CSV: Raw data for their analysis
- Share link: Secure view-only URL for stakeholders

---

## Technical Implementation Plan

### Phase 1: Reorganize Codebase (2 hours)
1. Create `src/` directory
2. Move and reorganize all files
3. Update imports and configs
4. Test build

### Phase 2: Fix Data Model (3 hours)
1. Load metadata CSVs (levels, categories, dimensions, constructs)
2. Create proper constants with actual labels
3. Fix sentiment column mapping (Sentiment_1-25 → grid positions)
4. Implement relative ranking color logic
5. Add statistics (σ, averages, counts)

### Phase 3: Rebuild Sentiment Heatmap (4 hours)
1. Correct 5×5 grid with proper labels
2. Ranking-based coloring (top3, top8, middle, bottom8, bottom3)
3. Row/column averages display
4. Overall average + standard deviation
5. Respondent count
6. Cell click → detail view with context
7. "Analyze Problem Areas" → GPT integration trigger

### Phase 4: Fix Capability Assessment (4 hours)
1. Overview table with all 8 dimensions (avg, max, min, spread, benchmark)
2. Proper radar with 3 layers (max/avg/min)
3. Click dimension → drilldown page with:
   - Dimension description
   - 4-construct radar
   - Score vs benchmark
   - Status message
4. Navigation between dimensions
5. "View Open-Ended Summary" button

### Phase 5: GPT-4 Integration (5 hours)
1. Create API routes for GPT analysis
2. Build prompt templates:
   - Problem category generation (from lowest sentiment cells)
   - Intervention generation (3 actions per category)
   - Open-ended text summarization (capability insights)
   - Executive summary generation
3. Frontend hooks for GPT calls
4. Loading states ("Analyzing with GPT-4...")
5. Fallback handling if GPT fails

### Phase 6: Recommendations Engine (3 hours)
1. Problem Categories view (GPT-generated from sentiment)
2. Intervention matching (combine sentiment + capability gaps)
3. Detailed intervention pages with ROI
4. Action plan builder (client selects interventions)
5. Combined view showing selected actions

### Phase 7: Export & Reporting (3 hours)
1. PDF generator with proper structure:
   - Cover with client branding
   - Executive summary
   - Sentiment analysis (heatmap + problem categories)
   - Capability assessment (8 dimensions)
   - Open-ended insights
   - Recommended interventions
   - Implementation timeline
2. PowerPoint export (key slides)
3. Data export options

### Phase 8: Polish & Client Branding (2 hours)
1. Client logo upload and display
2. Color scheme customization
3. Professional presentation mode
4. Smooth transitions
5. Print-optimized views

**Total: ~26 hours (3-4 days of focused work)**

---

## Immediate Next Steps

Want me to start implementing? I'll begin with:
1. Create `src/` structure
2. Load all metadata CSVs into constants (proper labels)
3. Fix heatmap with correct ranking logic
4. Build capability overview properly
5. Then add GPT integration
6. Finally polish the complete flow

**Ready to proceed?**

