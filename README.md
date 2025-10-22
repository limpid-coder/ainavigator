# 🧭 AI Navigator

<div align="center">

**Accelerate AI Adoption Through Data-Driven Insights**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat)](#)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Roadmap](#-roadmap)

</div>

---

## 📋 Overview

**AI Navigator** is an enterprise-grade platform that helps organizations assess, understand, and accelerate their readiness for AI adoption. By combining sentiment analysis with capability maturity assessment, AI Navigator provides actionable insights that drive meaningful transformation.

### The Challenge We Solve

AI adoption often fails due to:
- 🚫 **Emotional resistance** from stakeholders
- 📉 **Unclear capability levels** across the organization
- 🤷 **Uncertainty in decision-making** about where to invest

### Our Solution

AI Navigator reveals both **sentiment-based blockers** (how people feel) and **capability-based maturity levels** (how ready the organization is), then guides you toward high-impact actions.

---

## ✨ Features

### 🎯 Dual Assessment Framework

#### 1. **Sentiment Analysis**
- **25-Zone Heatmap**: Visualize emotional readiness across sentiment levels × reasons
- **Real-time Filtering**: Segment by region, department, role, age group
- **Benchmark Comparisons**: Compare against industry and regional standards
- **Resistance Mapping**: Identify specific emotional blockers to adoption

#### 2. **Capability Maturity Assessment**
- **8-Dimension Diamond**: Comprehensive capability evaluation across:
  - Strategy and Vision
  - Data
  - Technology
  - Talent and Skills
  - Organisation and Processes
  - Innovation
  - Adaptation & Adoption
  - Ethics and Responsibility
- **32-Construct Deep Dive**: Drilldown to granular capability insights (4 constructs per dimension)
- **AI-Powered Insights**: Automated summarization of open-ended responses
- **Gap Analysis**: Visual identification of strengths and weaknesses

### 🎬 Interactive Features

- **Dynamic Data Upload**: CSV-based data ingestion with instant recalculation
- **Smart Filtering**: Multi-dimensional filtering with real-time updates
- **Spotlight Interventions**: Curated, high-impact action recommendations
- **ROI Glimpse**: Directional improvement estimates for recommended actions
- **PDF Export**: Professional summary reports for stakeholders

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ainavigator.git

# Navigate to project directory
cd ainavigator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
ainavigator/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── documentation/           # Product documentation
│   ├── prd.md              # Product Requirements Document
│   ├── sprint-plan.md      # Development Sprint Plan
│   └── Database info/      # Data structure & sample datasets
├── public/                  # Static assets
├── components/              # (Coming soon) React components
├── lib/                     # (Coming soon) Utilities & helpers
└── api/                     # (Coming soon) Backend API routes
```

---

## 📖 Documentation

### Core Documents

| Document | Description | Status |
|----------|-------------|--------|
| [Product Requirements (PRD)](./documentation/prd.md) | Complete product specification for Web Summit MVP | ✅ Complete |
| [Sprint Plan](./documentation/sprint-plan.md) | 4-day development roadmap with milestones | ✅ Complete |
| [Database Info](./documentation/Database%20info/) | Data structures, schemas, and sample datasets | ✅ Complete |

### Key Concepts

#### Data Model
The platform ingests structured CSV data containing:
- **Sentiment Responses**: Mapped to 25 predefined sentiment areas
- **Capability Scores**: 32 numeric fields (4 constructs × 8 dimensions)
- **Open-Ended Feedback**: Qualitative insights for AI summarization
- **Metadata**: Segmentation fields (region, function, age, business unit)

#### Analysis Flow
1. **Upload** → User provides dataset or selects demo data
2. **Visualize** → System generates sentiment heatmap or capability diamond
3. **Filter** → User applies segmentation filters (real-time recalculation)
4. **Explore** → Deep dive into specific areas/dimensions
5. **Recommend** → System suggests spotlight interventions
6. **Impact** → View directional ROI estimates
7. **Export** → Generate PDF summary report

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 16.0](https://nextjs.org/) with App Router
- **UI Library**: [React 19.2](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Visualization**: Recharts / D3.js (for radar & heatmap charts)
- **State Management**: Zustand / React Context
- **Type Safety**: TypeScript 5.0

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Data Processing**: Node.js native + PapaParse (CSV parsing)
- **AI Integration**: OpenAI API (GPT-4 for text summarization)
- **Session Storage**: In-memory caching

### DevOps & Deployment
- **Version Control**: Git + GitHub
- **Deployment**: Vercel (recommended) or Docker
- **CI/CD**: GitHub Actions (coming soon)
- **Environment**: Node.js 18+ runtime

---

## 🎯 Roadmap

### ✅ Phase 1: Web Summit MVP (Current)
**Target: October 26, 2025**

- [x] Project architecture & foundation
- [x] Product Requirements Document
- [x] Sprint planning
- [ ] Sentiment heatmap visualization
- [ ] Capability diamond (2-level radar)
- [ ] Data upload & filtering
- [ ] Spotlight interventions
- [ ] ROI glimpse feature
- [ ] PDF export

### 🔄 Phase 2: Enhanced Analytics (Q4 2025)
- [ ] Advanced ROI simulation with cost modeling
- [ ] Comprehensive benchmark datasets (multi-industry)
- [ ] Credibility case library with success stories
- [ ] Enhanced AI personalization
- [ ] Multi-scenario comparison tool

### 🔮 Phase 3: Enterprise Platform (Q1 2026)
- [ ] Multi-user authentication & RBAC
- [ ] Organization account management
- [ ] Long-term analytics & trend tracking
- [ ] Gamification & engagement mechanics
- [ ] API for third-party integrations
- [ ] White-label capabilities

---

## 🤝 Contributing

This is a private project currently in active development for Web Summit demo. Contributions are managed internally.

For questions or suggestions, please contact the project team.

---

## 📊 Current Status

**Version:** 0.1.0 (MVP Development)  
**Stage:** Pre-Alpha  
**Sprint:** Milestone 1 of 4  
**Target Demo:** Web Summit 2025  

### Development Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Foundation & Data Infrastructure | Oct 22, 2025 | 🔄 In Progress |
| Sentiment Flow & Visualization | Oct 23, 2025 | ⏳ Pending |
| Capability Flow & Advanced Features | Oct 24, 2025 | ⏳ Pending |
| Interventions, ROI & Finalization | Oct 25-26, 2025 | ⏳ Pending |

---

## 📝 License

**Proprietary and Confidential**

Copyright © 2025 AI Navigator. All rights reserved.

This software and associated documentation files are proprietary. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🙋‍♂️ Support & Contact

For technical support or product inquiries:

- **Email**: support@ainavigator.com
- **Documentation**: [View Docs](./documentation/)
- **Issues**: Contact project maintainer

---

## 🏆 Success Metrics

Our Web Summit MVP will demonstrate:

✅ **Speed**: Complete insight journey in < 3 minutes  
✅ **Intelligence**: Dynamic recalculation based on data uploads  
✅ **Clarity**: Visual communication of complex readiness factors  
✅ **Action**: Specific, high-impact intervention recommendations  
✅ **Value**: Directional ROI insights that build confidence  

---

<div align="center">

**Built with ❤️ for organizations ready to lead in the AI era**

[⬆ Back to Top](#-ai-navigator)

</div>
