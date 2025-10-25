# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Navigator is an enterprise-grade platform for assessing AI adoption readiness. It combines sentiment analysis with capability maturity assessment to provide actionable insights for organizations. The platform is built with Next.js 16 (App Router), React 19, TypeScript 5, and Tailwind CSS 4.

**Target Demo**: Web Summit 2025 MVP (October 26, 2025)

## Essential Commands

### Development
```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Create production build
npm start                # Start production server
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking (tsc --noEmit)
npm run format           # Format with Prettier
npm run format:check     # Check formatting without changes
```

### Testing
```bash
npm test                 # Run all Jest tests
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:e2e         # Run Playwright E2E tests
npm run test:coverage    # Generate coverage report
```

### Analysis
```bash
npm run analyze          # Analyze bundle size with next-bundle-analyzer
```

## Architecture Principles

### 1. **Enterprise-Grade Structure**

The codebase follows strict separation of concerns:

- **`app/`**: Next.js App Router pages and layouts
- **`components/`**: React components (UI, forms, layouts)
- **`lib/`**: Core business logic layer (services, state, utilities, types)
  - `config/`: Environment-based configuration
  - `services/`: Service layer (API, logger, error handling)
  - `store/`: Zustand state management with persistence
  - `types/`: TypeScript type definitions and models
  - `utils/`: Utility functions (calculations, security, performance)
  - `validation/`: Zod schemas for runtime validation
  - `hooks/`: Custom React hooks
  - `design/`: Design system tokens (single source of truth)

### 2. **State Management with Zustand**

The application uses a **slice-based Zustand store** (`lib/store/index.ts`) with middleware:
- **Immer** for immutable updates
- **Persist** for localStorage persistence (user, theme, filters, sidebarOpen)
- **DevTools** for debugging
- **SubscribeWithSelector** for granular subscriptions

**Store slices**:
- `AuthSlice`: user, session, authentication state
- `DataSlice`: sentimentData, capabilityData, organization
- `FilterSlice`: regions, departments, ageGroups, dateRange
- `UploadSlice`: file upload tracking and progress
- `UISlice`: theme, sidebar, activeView, notifications, modals

**Usage pattern**: Use specific selectors (`useAuth()`, `useData()`, `useFilters()`, `useUI()`) instead of the full store to optimize re-renders.

### 3. **Error Management Architecture**

Centralized error handling via `lib/services/error.service.ts`:

**Error Categories**:
- `NETWORK`: Retry with exponential backoff
- `VALIDATION`: Show inline feedback
- `AUTHENTICATION`: Redirect to login
- `AUTHORIZATION`: Access denied message
- `BUSINESS_LOGIC`: User-friendly message
- `SYSTEM`: Log and show generic message

**Custom error classes**: `NetworkError`, `ValidationError`, `AuthenticationError`, `AuthorizationError`, `BusinessLogicError`, `SystemError`

All errors include metadata: category, severity, code, timestamp, context, recoverable flag.

### 4. **Type Safety & Validation**

- **Strict TypeScript**: No `any` types allowed (`strict: true` in tsconfig.json)
- **Runtime validation**: All inputs validated with Zod schemas (`lib/validation/schemas.ts`)
- **Domain models**: Comprehensive type definitions in `lib/types/models.ts`
  - `Organization`, `SentimentResponse`, `CapabilityResponse`
  - `FilterState`, `HeatmapData`, `Recommendation`
  - `Session`, `User`, `FileUpload`

### 5. **Design System**

Unified design tokens in `lib/design/tokens.ts`:
- **Colors**: Primary (teal gradient), accent (purple), neutral grays, semantic colors
- **Typography**: Inter font, 8px grid spacing, consistent weights
- **Spacing**: 8px grid system (1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32)
- **Animation**: Defined durations (fast: 150ms, base: 250ms, slow: 350ms) and easing functions
- **Shadows**: Subtle depth levels (sm, base, md, lg, xl, 2xl, glow)

**Import path alias**: Use `@/` for imports (e.g., `@/lib/services/api.service`)

## Data Flow & Business Logic

### Core Data Models

The platform handles two primary data types:

1. **Sentiment Data**: 25-zone heatmap (5 sentiment levels × 5 reason categories)
   - Tracks emotional readiness and resistance blockers
   - Includes demographic metadata (region, department, age, business unit)

2. **Capability Data**: 8-dimension diamond chart with 32 constructs
   - **Dimensions**: Strategy & Vision, Data, Technology, Talent & Skills, Organisation & Processes, Innovation, Adaptation & Adoption, Ethics & Responsibility
   - Each dimension has 4 constructs for granular assessment

### Analysis Flow

1. **Upload**: CSV data ingestion with validation
2. **Visualize**: Generate sentiment heatmap or capability diamond
3. **Filter**: Real-time recalculation with segmentation (region, department, age, business unit)
4. **Explore**: Drill down into specific areas or dimensions
5. **Recommend**: System suggests "spotlight interventions"
6. **Impact**: View directional ROI estimates
7. **Export**: Generate PDF summary report

### Service Layer

**API Service** (`lib/services/api.service.ts`):
- Axios-based HTTP client with interceptors
- Automatic retry logic with exponential backoff
- Request caching and CSRF token handling
- Centralized error handling integration

**Logger Service** (`lib/services/logger.service.ts`):
- Structured logging with multiple levels (debug, info, warn, error, fatal)
- Automatic error capture and performance monitoring
- Remote log aggregation support (production)

## Security Measures

**Input Security** (`lib/utils/security.ts`):
- All inputs validated with Zod schemas
- XSS attack prevention via sanitization
- CSRF token generation and validation
- File upload restrictions and validation
- Password strength validation utilities

**Network Security**:
- HTTPS only in production
- Content Security Policy headers
- CORS configuration
- Rate limiting utilities available

**Components**:
- `SecurityHeaders` component for CSP implementation
- `ErrorBoundary` for graceful error handling
- Error boundaries wrap critical UI sections

## Performance Optimization

### Custom Hooks (`lib/hooks/`)
- `useDebounce`: Optimize rapid input changes
- `useThrottle`: Rate limiting for expensive operations
- `useIntersectionObserver`: Lazy loading support
- `useVirtualScroll`: Large list optimization
- `useWebWorker`: Background processing
- `usePerformanceMonitor`: Track performance metrics

### Bundle Optimization
- Dynamic imports for code splitting
- Tree shaking with ES modules
- Image optimization with Next.js Image component
- React.memo, useMemo, useCallback for component optimization

## Testing Strategy

### Test Organization
- **Unit tests**: `tests/unit/` - Component and service layer testing (80% coverage target)
- **Integration tests**: `tests/integration/` - API and database integration
- **E2E tests**: Playwright for critical user flows

### Testing Commands
```bash
# Run specific test file
npm test -- path/to/test.test.ts

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage
```

## CI/CD Pipeline

The project uses GitHub Actions (`.github/workflows/ci.yml`) with the following stages:

1. **Code Quality**: ESLint, TypeScript check, Prettier
2. **Security Audit**: npm audit, Snyk scanning
3. **Test Suite**: Unit, integration, E2E tests (matrix strategy)
4. **Build**: Production build with bundle size analysis
5. **Performance**: Lighthouse CI for performance metrics
6. **Deploy Preview**: Automatic preview deployments for PRs (Vercel)
7. **Deploy Production**: Production deployment on main branch push

## Development Guidelines

### Code Style
- Follow existing patterns in the codebase
- Use ESLint and Prettier configurations
- All functions should have TypeScript types (no implicit `any`)
- Services and utilities should have JSDoc comments

### Best Practices
- **SOLID principles**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **DRY**: Abstract common functionality
- **KISS**: Prefer simplicity over complexity
- **Error handling**: Always use centralized error service
- **Logging**: Use logger service instead of console.log

### Import Organization
```typescript
// 1. External dependencies
import { create } from 'zustand'
import { useState, useEffect } from 'react'

// 2. Internal lib imports (use @ alias)
import { logger } from '@/lib/services/logger.service'
import { useStore } from '@/lib/store'
import type { User } from '@/lib/types/models'

// 3. Component imports
import { Button } from '@/components/ui/Button'
```

### State Management Patterns
```typescript
// ✅ Correct: Use specific selectors
const { user, isAuthenticated, logout } = useAuth()

// ❌ Wrong: Use full store (causes unnecessary re-renders)
const user = useStore(state => state.user)
const session = useStore(state => state.session)
```

### Error Handling Pattern
```typescript
import { errorService, NetworkError } from '@/lib/services/error.service'

try {
  const data = await fetchData()
} catch (error) {
  throw new NetworkError('Failed to fetch data', {
    endpoint: '/api/data',
    status: error.response?.status
  })
}
```

## Key Files & Locations

- **Store**: `lib/store/index.ts` - Central state management
- **Types**: `lib/types/models.ts` - All TypeScript type definitions
- **Services**: `lib/services/` - API, logger, error handling
- **Design System**: `lib/design/tokens.ts` - Design tokens (colors, spacing, typography)
- **Security**: `lib/utils/security.ts` - Security utilities
- **Validation**: `lib/validation/schemas.ts` - Zod validation schemas
- **Config**: `lib/config/index.ts` - Environment configuration
- **Data Foundation**: `data-foundation/` - CSV schema definitions and data model documentation

## Common Patterns

### Adding a New Feature
1. Define types in `lib/types/models.ts`
2. Create Zod validation schema in `lib/validation/schemas.ts`
3. Add state slice to `lib/store/index.ts` if needed
4. Implement service layer in `lib/services/`
5. Create UI components in `components/`
6. Add page/route in `app/`
7. Write tests in `tests/unit/` and `tests/integration/`

### Creating a New Component
```typescript
// components/ui/NewComponent.tsx
'use client'

import { designTokens } from '@/lib/design/tokens'
import { logger } from '@/lib/services/logger.service'

interface NewComponentProps {
  title: string
  onAction: () => void
}

export function NewComponent({ title, onAction }: NewComponentProps) {
  // Component implementation
}
```

### Adding API Integration
```typescript
// lib/services/api.service.ts
import { apiClient } from '@/lib/services/api.service'
import { ValidationError } from '@/lib/services/error.service'

export async function fetchData(id: string) {
  try {
    const response = await apiClient.get(`/api/data/${id}`)
    return response.data
  } catch (error) {
    throw new NetworkError('Failed to fetch data', { id })
  }
}
```

## Environment Variables

Required environment variables (create `.env.local`):
```bash
# Next.js
NEXT_PUBLIC_ENVIRONMENT=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Notes

- The project is in active MVP development for Web Summit 2025
- Current sprint: Milestone 1 of 4 (Foundation & Data Infrastructure)
- Next.js 16 uses the App Router (not Pages Router)
- React 19.2 is the current version (check for new patterns)
- All dates are managed with `date-fns` library
- CSV parsing uses `papaparse` library
- Charts use `recharts` library
