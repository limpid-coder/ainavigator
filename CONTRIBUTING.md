# Contributing to AI Navigator

Thank you for your interest in contributing to AI Navigator! This document provides guidelines and instructions for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## Code of Conduct

### Our Standards

- **Professional Communication**: Maintain respectful, constructive dialogue
- **Collaborative Spirit**: Work together toward shared goals
- **Quality Focus**: Prioritize excellence in code and documentation
- **Confidentiality**: Respect proprietary information and data

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development Environment**
   - Node.js 18+ installed
   - Git configured with your credentials
   - Code editor (VS Code recommended)

2. **Project Knowledge**
   - Read the [Product Requirements Document](./documentation/prd.md)
   - Review the [Sprint Plan](./documentation/sprint-plan.md)
   - Understand current milestone objectives

3. **Repository Access**
   - Clone the repository
   - Install dependencies: `npm install`
   - Verify setup: `npm run dev`

---

## Development Workflow

### Branch Strategy

```
main
├── develop (integration branch)
└── feature/milestone-1-data-upload
└── feature/milestone-2-sentiment-heatmap
└── feature/milestone-3-capability-diamond
└── feature/milestone-4-interventions
└── bugfix/issue-description
└── hotfix/critical-fix
```

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
# Commit regularly with meaningful messages
git add .
git commit -m "feat: add sentiment heatmap component"

# Push to remote
git push origin feature/your-feature-name
```

---

## Coding Standards

### TypeScript Guidelines

```typescript
// ✅ DO: Use explicit types
interface SentimentData {
  area: string;
  score: number;
  respondentCount: number;
}

// ✅ DO: Use functional components with TypeScript
const HeatmapCell: React.FC<HeatmapCellProps> = ({ area, score }) => {
  return <div>{area}: {score}</div>;
};

// ❌ DON'T: Use 'any' type
const processData = (data: any) => { ... }; // Avoid this

// ✅ DO: Use specific types
const processData = (data: SentimentData[]) => { ... };
```

### File Naming Conventions

```
components/
├── SentimentHeatmap.tsx        # PascalCase for components
├── HeatmapCell.tsx
└── sentiment-utils.ts          # kebab-case for utilities

lib/
├── data-aggregation.ts         # kebab-case for libraries
└── api-client.ts

types/
├── sentiment.types.ts          # kebab-case with .types suffix
└── capability.types.ts
```

### Code Structure

```typescript
// Order of component structure:
// 1. Imports
import React, { useState, useEffect } from 'react';
import { SentimentData } from '@/types/sentiment.types';

// 2. Types/Interfaces
interface Props {
  data: SentimentData[];
  onCellClick: (area: string) => void;
}

// 3. Component
export const SentimentHeatmap: React.FC<Props> = ({ data, onCellClick }) => {
  // 3a. State
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  
  // 3b. Effects
  useEffect(() => {
    // Effect logic
  }, [data]);
  
  // 3c. Handlers
  const handleCellClick = (area: string) => {
    setSelectedCell(area);
    onCellClick(area);
  };
  
  // 3d. Render helpers
  const renderCell = (area: string, score: number) => {
    return <HeatmapCell area={area} score={score} />;
  };
  
  // 3e. Main render
  return (
    <div className="heatmap-container">
      {data.map((item) => renderCell(item.area, item.score))}
    </div>
  );
};
```

### CSS/Tailwind Standards

```tsx
// ✅ DO: Use semantic class grouping
<div className="
  flex items-center justify-between
  w-full h-16
  bg-white border border-gray-200 rounded-lg
  px-4 py-2
  shadow-sm hover:shadow-md
  transition-all duration-200
">

// ❌ DON'T: Mix random class order
<div className="px-4 hover:shadow-md w-full transition-all bg-white h-16">
```

---

## Commit Guidelines

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
# Feature
git commit -m "feat(sentiment): add 25-zone heatmap visualization"

# Bug fix
git commit -m "fix(filter): resolve duplicate entries in region dropdown"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(api): extract aggregation logic to separate service"

# Multiple lines
git commit -m "feat(capability): add radar chart component

- Implement 8-dimension radar visualization
- Add interactive dimension selection
- Include min/max range display

Resolves #12"
```

---

## Pull Request Process

### Before Submitting

1. **Code Quality**
   - [ ] Run linter: `npm run lint`
   - [ ] Fix all linting errors
   - [ ] Test locally: `npm run dev`
   - [ ] Verify build: `npm run build`

2. **Testing**
   - [ ] Test your feature thoroughly
   - [ ] Test with sample datasets
   - [ ] Test filter combinations
   - [ ] Check responsive behavior

3. **Documentation**
   - [ ] Update relevant documentation
   - [ ] Add code comments for complex logic
   - [ ] Update CHANGELOG.md if applicable

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Milestone
- [ ] Milestone 1: Foundation & Data Infrastructure
- [ ] Milestone 2: Sentiment Flow
- [ ] Milestone 3: Capability Flow
- [ ] Milestone 4: Interventions & ROI

## Testing
Describe testing performed:
- Tested with sample dataset X
- Verified filter recalculation
- Checked responsive layout

## Screenshots (if applicable)
Add screenshots demonstrating the change

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Builds successfully
```

### Review Process

1. Submit PR with descriptive title and template filled
2. Automated checks run (linting, build)
3. Code review by team member
4. Address review comments
5. Approval required before merge
6. Merge to `develop` branch

---

## Testing

### Manual Testing Checklist

For each feature, verify:

#### Data Upload
- [ ] CSV file uploads successfully
- [ ] Invalid format shows error message
- [ ] Large files process without crashing
- [ ] Session data persists during navigation

#### Sentiment Heatmap
- [ ] All 25 cells render correctly
- [ ] Colors reflect data scores accurately
- [ ] Cell click opens detail view
- [ ] Filters recalculate heatmap

#### Capability Diamond
- [ ] 8 dimensions display on radar chart
- [ ] Clicking dimension shows construct view
- [ ] Min/max ranges visible (if implemented)
- [ ] Benchmarks overlay correctly

#### Filters
- [ ] All filter options populate from data
- [ ] Multiple filters work together
- [ ] Reset filters returns to full dataset
- [ ] "No data" state shows for empty results

#### Interventions & ROI
- [ ] Recommendations trigger appropriately
- [ ] Intervention details display fully
- [ ] ROI glimpse shows relevant data
- [ ] PDF export generates correctly

### Browser Testing

Test in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

---

## Code Review Standards

### What Reviewers Look For

1. **Functionality**
   - Does it work as intended?
   - Does it meet PRD requirements?
   - Are edge cases handled?

2. **Code Quality**
   - Is it readable and maintainable?
   - Are there unnecessary complexities?
   - Is it properly typed?

3. **Performance**
   - Are there performance bottlenecks?
   - Is data processing efficient?
   - Are rerenders minimized?

4. **Consistency**
   - Follows project conventions?
   - Matches existing patterns?
   - Uses established utilities?

---

## Questions or Issues?

If you have questions or encounter issues:

1. Check existing documentation
2. Review closed issues/PRs for similar cases
3. Ask in team communication channels
4. Create an issue with detailed description

---

## Recognition

Contributors to AI Navigator are helping build a platform that accelerates AI adoption across organizations. Your work matters!

---

**Last Updated:** October 22, 2025  
**Version:** 1.0


