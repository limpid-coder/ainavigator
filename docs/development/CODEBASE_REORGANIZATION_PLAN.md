# Codebase Reorganization Plan
**Moving to Professional `src/` Structure**

## Current Problems
- ❌ Components scattered across root and nested folders
- ❌ Utils and libs mixed together
- ❌ Data files in multiple locations
- ❌ No clear separation between client/server
- ❌ Types defined in multiple places
- ❌ Hard to find anything

## New Structure (Professional Standard)

```
ainavigator/
├── src/
│   ├── app/                          # Next.js App Router (keep as is)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── data/
│   │   │   └── gpt/                 # NEW: GPT integration endpoints
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/                   # UI Components
│   │   ├── dashboard/
│   │   │   ├── heatmap/
│   │   │   │   ├── HeatmapView.tsx
│   │   │   │   ├── HeatmapCell.tsx
│   │   │   │   ├── HeatmapLegend.tsx
│   │   │   │   └── HeatmapStats.tsx
│   │   │   ├── capability/
│   │   │   │   ├── CapabilityRadar.tsx
│   │   │   │   ├── ConstructDrilldown.tsx
│   │   │   │   └── DimensionCard.tsx
│   │   │   ├── interventions/
│   │   │   │   ├── ProblemCategoryCard.tsx
│   │   │   │   ├── ActionList.tsx
│   │   │   │   ├── ActionDetail.tsx
│   │   │   │   └── InterventionModal.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── AISummaryPanel.tsx
│   │   │   │   ├── StatsCards.tsx
│   │   │   │   └── ROIModal.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── shared/
│   │   │   ├── Header.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── ui/                       # Shadcn/base components
│   │       └── ...
│   │
│   ├── lib/                          # Core Business Logic
│   │   ├── ai/                       # GPT Integration
│   │   │   ├── prompts/
│   │   │   │   ├── problemCategory.ts
│   │   │   │   ├── interventions.ts
│   │   │   │   └── summary.ts
│   │   │   ├── gpt.service.ts
│   │   │   └── types.ts
│   │   ├── calculations/
│   │   │   ├── heatmap.ts
│   │   │   ├── capability.ts
│   │   │   ├── ranking.ts          # NEW: Relative ranking logic
│   │   │   ├── statistics.ts       # NEW: σ, averages
│   │   │   └── filtering.ts
│   │   ├── data/
│   │   │   ├── loaders/
│   │   │   │   ├── sentiment.ts
│   │   │   │   ├── capability.ts
│   │   │   │   └── benchmarks.ts
│   │   │   ├── transformers/
│   │   │   │   ├── sentiment.ts
│   │   │   │   └── capability.ts
│   │   │   └── validators/
│   │   │       └── csv.ts
│   │   ├── constants/
│   │   │   ├── sentiment.ts         # Levels, categories
│   │   │   ├── capability.ts        # Dimensions, constructs
│   │   │   ├── colors.ts
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useDashboard.ts
│   │   │   ├── useFilters.ts
│   │   │   └── useGPT.ts           # NEW: GPT integration hook
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── supabase.service.ts
│   │   │   └── pdf.service.ts
│   │   ├── store/
│   │   │   ├── dashboardStore.ts
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   ├── sentiment.ts
│   │   │   ├── capability.ts
│   │   │   ├── intervention.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── format.ts
│   │       ├── export.ts
│   │       └── helpers.ts
│   │
│   └── config/                      # Configuration
│       ├── database.ts
│       ├── env.ts
│       └── constants.ts
│
├── data/                            # Data Files (Keep)
│   ├── Database info/
│   ├── data-foundation/
│   └── documentation/
│
├── public/                          # Static Assets (Keep)
│   └── demo_data/
│
├── docs/                            # Documentation
│   ├── PRD_COMPLIANCE_REPORT.md
│   ├── ACTUAL_DATA_MODEL_UNDERSTANDING.md
│   ├── CODEBASE_REORGANIZATION_PLAN.md
│   ├── DEMO_READY.md
│   └── API_DOCUMENTATION.md
│
├── scripts/                         # Build/Deploy Scripts
│   └── migrate-to-src.ts
│
└── [config files]                   # Root configs (Keep)
    ├── next.config.ts
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

## Migration Strategy

### Phase 1: Create Structure (30 mins)
1. Create `src/` directory
2. Move `app/` into `src/app/`
3. Create subdirectories in `src/`
4. Update `next.config.ts` and `tsconfig.json`

### Phase 2: Reorganize Components (1 hour)
1. Split dashboard components into logical groups
2. Create proper component hierarchy
3. Update imports

### Phase 3: Refactor Lib (2 hours)
1. Separate calculations by domain
2. Create proper service layer
3. Extract constants properly
4. Organize types

### Phase 4: Add GPT Integration (3 hours)
1. Create AI service structure
2. Build prompt templates
3. Implement API routes
4. Connect to UI

### Phase 5: Update Imports & Test (1 hour)
1. Fix all import paths
2. Test build
3. Test all features
4. Update documentation

## Key Improvements

### ✅ Clear Separation of Concerns
- **Components**: Pure UI, no business logic
- **Lib**: All business logic, calculations, services
- **API**: Server-side endpoints
- **Data**: External data files

### ✅ Easy to Find Things
```
Need to modify heatmap colors? 
→ src/lib/constants/colors.ts

Need to fix ranking logic?
→ src/lib/calculations/ranking.ts

Need to update GPT prompts?
→ src/lib/ai/prompts/

Need to fix capability radar?
→ src/components/dashboard/capability/CapabilityRadar.tsx
```

### ✅ Scalable Architecture
- Easy to add new features
- Clear where new code goes
- Simple to onboard new developers
- Professional standard structure

### ✅ Better Type Safety
- All types in `src/lib/types/`
- Domain-specific type files
- Shared types easily accessible

## Implementation Commands

### Step 1: Update Next.js Config
```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Tell Next.js where src is
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

export default nextConfig
```

### Step 2: Update TypeScript Config
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/lib/types/*"]
    }
  }
}
```

### Step 3: Migration Script
```bash
# Run this to auto-migrate
npm run migrate:src
```

## GPT Integration Structure

### New Files to Create

```typescript
// src/lib/ai/gpt.service.ts
export class GPTService {
  async generateProblemCategories(lowestScores: HeatmapCell[]): Promise<ProblemCategory[]>
  async generateInterventions(category: ProblemCategory): Promise<Intervention[]>
  async generateExecutiveSummary(data: DashboardData): Promise<string>
}

// src/lib/ai/prompts/problemCategory.ts
export const PROBLEM_CATEGORY_PROMPT = `
You are analyzing organizational AI readiness survey data...
[detailed prompt]
`

// src/lib/ai/prompts/interventions.ts
export const INTERVENTION_PROMPT = `
Based on the identified problem category, generate 3 specific, actionable interventions...
[detailed prompt]
`

// src/app/api/gpt/analyze/route.ts
export async function POST(request: Request) {
  // Analyze lowest scores and generate problem categories
}

// src/app/api/gpt/interventions/route.ts
export async function POST(request: Request) {
  // Generate interventions for a problem category
}
```

## Benefits of Reorganization

### Before (Current)
- ❌ Finding files takes 5+ minutes
- ❌ Unclear where new code goes
- ❌ Import paths are messy
- ❌ Hard to reason about structure
- ❌ Difficult for new developers

### After (With src/)
- ✅ Find files in < 30 seconds
- ✅ Clear conventions for all code
- ✅ Clean, consistent imports
- ✅ Professional standard structure
- ✅ Easy to onboard and scale

## Timeline

| Phase | Time | Status |
|-------|------|--------|
| 1. Create Structure | 30 mins | ⏳ Pending |
| 2. Move Components | 1 hour | ⏳ Pending |
| 3. Refactor Lib | 2 hours | ⏳ Pending |
| 4. Add GPT Integration | 3 hours | ⏳ Pending |
| 5. Fix Imports & Test | 1 hour | ⏳ Pending |
| **Total** | **7.5 hours** | ⏳ Pending |

## Next Steps

1. **Review this plan** - Does the structure make sense?
2. **Approve migration** - Ready to start?
3. **Run migration** - Execute phase by phase
4. **Test thoroughly** - Ensure nothing breaks
5. **Update docs** - Reflect new structure

## Questions to Confirm

1. ✅ Move to `src/` structure?
2. ✅ Split components by domain (heatmap, capability, interventions)?
3. ✅ Create dedicated AI/GPT service layer?
4. ✅ Reorganize lib into specialized folders?
5. ✅ Use this as the standard going forward?

**Ready to start migration?**


