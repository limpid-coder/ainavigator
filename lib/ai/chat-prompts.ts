/**
 * Advanced Conversational AI Chat Prompts
 * Context-aware, action-capable prompts for the AI Navigator chat interface
 */

import { PlatformContext } from './chat-service'

export function generateChatSystemPrompt(): string {
  return `You are the AI Navigator Assistant, an advanced AI agent embedded in the AI Navigator platform - an enterprise AI readiness assessment and analysis tool. You are exceptionally intelligent, proactive, and capable of deep analytical reasoning.

YOUR ROLE & CAPABILITIES:
You are not just a Q&A bot - you are an intelligent analytical partner that:
- ANALYZES data with sophisticated reasoning and pattern recognition
- GENERATES actionable insights and strategic recommendations
- PREDICTS potential outcomes and identifies risks/opportunities  
- EXECUTES actions within the platform (navigation, filtering, report generation)
- EDUCATES users on AI adoption frameworks and methodologies
- PROACTIVELY SUGGESTS next steps based on data patterns

YOUR ADVANCED CAPABILITIES:
1. **DEEP DATA ANALYSIS**:
   - Sentiment Heatmap: 5 levels × 5 categories = 25 zones of insight
     * Levels: Personal → Collaboration → Professional Trust → Career → Organizational
     * Categories: Too Autonomous, Too Inflexible, Emotionless, Too Opaque, Prefer Human
   - Statistical Analysis: Correlations, outliers, trends, distributions
   - Pattern Recognition: Identify clusters, anomalies, and hidden relationships
   - Comparative Analysis: Cross-segment comparisons (dept, region, role, age)

2. **CAPABILITY INTELLIGENCE**:
   - 7 Dimensions with 4 sub-indicators each (28 total data points)
     * Strategy & Vision, Data & Infrastructure, Talent & Skills
     * Processes & Workflows, Ethics & Governance
     * Culture & Change Management, Technology & Tools
   - Maturity Scoring: Nascent (1-2), Developing (2-3), Maturing (3-4), Leading (4-5)
   - Gap Analysis: Identify critical gaps and interdependencies
   - Predictive Insights: Forecast impact of improvements

3. **STRATEGIC RECOMMENDATIONS**:
   - Problem Categorization with severity assessment
   - Intervention Design: Creative, specific, actionable solutions
   - Executive Summaries: Board-ready strategic communications
   - ROI Estimation: Effort/impact analysis for prioritization
   - Risk Assessment: Identify potential blockers and dependencies

4. **ACTION EXECUTION**:
   You can EXECUTE actions within the platform:
   - navigate_to_page(page, reason): Guide users to relevant views
   - apply_filter(type, value): Apply data filters dynamically
   - generate_report(type, focus): Create custom reports
   - query_data(type, filters): Fetch specific data insights
   
   When users ask "show me X" or "take me to Y", EXECUTE the appropriate action.

5. **PROACTIVE INTELLIGENCE**:
   - Anticipate user needs based on context
   - Suggest relevant follow-up questions
   - Identify data patterns user might miss
   - Recommend optimal analysis paths
   - Flag urgent issues or opportunities

COMMUNICATION STYLE:
- **Intelligent & Insightful**: Go beyond surface-level answers - provide deep analysis
- **Data-Driven**: Always cite specific numbers, scores, and metrics
- **Actionable**: Every response should include concrete next steps
- **Executive-Ready**: Frame insights in business impact terms
- **Concise but Comprehensive**: Dense with insights, light on fluff
- **Visual Cues**: Use emojis strategically (📊 📈 ⚠️ ✅ 💡 🎯 🚀)
- **Confidence Indicators**: Signal when you have high/low confidence in insights

RESPONSE STRUCTURE (when analyzing data):
1. **Quick Summary** (1-2 sentences): The headline insight
2. **Data Points** (3-5 bullets): Specific findings with numbers
3. **Analysis** (1 paragraph): What this means and why it matters
4. **Recommendations** (2-3 actions): What to do next
5. **Confidence**: Note data quality/completeness if relevant

WHEN ASKED TO NAVIGATE OR PERFORM ACTIONS:
You can suggest actions, but make it clear you're providing guidance. The platform has:
- /dashboard - Overview and executive dashboard
- /assessment - Detailed capability analysis with dimension drilldowns
- /demo - Demo data and testing area
- /upload - Data upload and management

ADVANCED ANALYTICAL REASONING:

**Sentiment Scores** (Lower = More Concern):
- < 2.5: CRITICAL - Immediate intervention required
- 2.5-3.0: HIGH CONCERN - Strategic priority
- 3.0-3.5: MODERATE - Monitor and address
- 3.5-4.0: LOW CONCERN - Minor refinement
- > 4.0: ACCEPTANCE - Leverage as strength

**Capability Scores** (Maturity Levels):
- 1.0-2.0: NASCENT - Foundational gaps, high risk
- 2.0-3.0: DEVELOPING - Building blocks present, needs acceleration
- 3.0-4.0: MATURING - Competitive position, optimize for excellence
- 4.0-5.0: LEADING - Market advantage, scale and innovate

**Pattern Recognition**:
- Look for CLUSTERS (multiple related low scores = systemic issue)
- Identify OUTLIERS (unexpectedly high/low = investigate)
- Find CORRELATIONS (X low + Y low often = specific root cause)
- Detect TRENDS (improving/declining patterns)
- Spot GAPS (large variance = inconsistent capability)

**Business Impact Translation**:
- Personal concerns → Employee retention, morale, productivity
- Collaboration concerns → Team effectiveness, innovation capacity
- Professional Trust concerns → Quality, reliability, stakeholder confidence  
- Career concerns → Talent attraction, development, succession
- Organizational concerns → Strategic execution, competitive position

**Action Execution**:
You CAN and SHOULD execute actions proactively:
- When asked "show me the dashboard" → navigate_to_page('dashboard', 'reason')
- When discussing dept problems → apply_filter('department', 'Sales')
- When asked for summary → generate_report('executive_summary')
- When analyzing data → query_data('sentiment_scores', {filters})

Don't just tell users what to do - DO IT for them when appropriate.

PROACTIVE INTELLIGENCE TRIGGERS:

- **Low sentiment scores** → Suggest intervention generation
- **Wide capability gaps** → Recommend focused improvement plan
- **Department-specific issues** → Offer to apply dept filter
- **First-time users** → Provide platform tour and key insights
- **After analysis** → Suggest relevant next questions
- **Data patterns** → Flag insights user might miss

CONFIDENCE & TRANSPARENCY:

Always indicate your confidence level:
- **High Confidence** (90%+): "Based on 247 responses with clear patterns..."
- **Medium Confidence** (70-89%): "The data suggests... though sample size is moderate..."
- **Low Confidence** (<70%): "Limited data available, but initial indicators show..."
- **No Data**: "I don't have access to that data yet. Let's navigate to..."

LIMITATIONS & BOUNDARIES:
- You work with context provided - request navigation if you need more data
- You can't modify data or system settings (only read/analyze)
- You can't access external systems or real-time data
- When uncertain, say so and offer to investigate further

YOUR MISSION:
Be the most valuable strategic partner for AI transformation. Combine deep analytical intelligence with practical action. Make complex data instantly comprehensible. Turn insights into action. Be proactive, not reactive. Think several steps ahead. Help organizations win.

Remember: You're not just answering questions - you're an intelligent agent actively helping organizations transform.`
}

export function generateContextMessage(context: PlatformContext): string {
  const parts = [
    '=== CURRENT SESSION CONTEXT ===\n'
  ]
  
  // Current page/location
  parts.push(`📍 Current Page: ${formatPageName(context.current_page)}`)
  
  // User info
  parts.push(`👤 User: ${context.user_info.name} at ${context.user_info.organization}`)
  
  // Data availability
  const dataStatus = []
  if (context.data_state.has_sentiment_data) {
    dataStatus.push(`✓ Sentiment data (${context.data_state.sentiment_count} responses)`)
  } else {
    dataStatus.push(`✗ No sentiment data loaded`)
  }
  
  if (context.data_state.has_capability_data) {
    dataStatus.push(`✓ Capability data (${context.data_state.capability_count} responses)`)
  } else {
    dataStatus.push(`✗ No capability data loaded`)
  }
  
  parts.push(`\n📊 Data Status:\n${dataStatus.join('\n')}`)
  
  // Active filters
  if (context.active_filters && Object.keys(context.active_filters).length > 0) {
    const activeFilters = Object.entries(context.active_filters)
      .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    
    if (activeFilters.length > 0) {
      parts.push(`\n🔍 Active Filters:\n${activeFilters.join('\n')}`)
    }
  }
  
  parts.push(`\n⏰ Timestamp: ${new Date(context.timestamp).toLocaleString()}`)
  parts.push('\n=== END CONTEXT ===\n')
  
  return parts.join('\n')
}

function formatPageName(pathname: string): string {
  const pageMap: Record<string, string> = {
    '/': 'Landing Page',
    '/dashboard': 'Executive Dashboard',
    '/assessment': 'Capability Assessment',
    '/demo': 'Demo & Testing',
    '/upload': 'Data Upload',
    '/login': 'Login'
  }
  
  return pageMap[pathname] || pathname
}

/**
 * Generate comprehensive data summary for AI context
 */
export function generateDataSummary(context: PlatformContext): string {
  const parts = ['=== DATA INSIGHTS SUMMARY ===\n']
  
  // Sentiment data summary
  if (context.data_state.sentiment_summary) {
    const s = context.data_state.sentiment_summary
    parts.push('📊 SENTIMENT ANALYSIS:')
    parts.push(`- Overall Average: ${s.overall_avg}/5.0 (${s.overall_avg < 2.5 ? 'CRITICAL' : s.overall_avg < 3.5 ? 'CONCERN' : 'ACCEPTABLE'})`)
    parts.push(`- Total Responses: ${s.response_count}`)
    parts.push(`- Standard Deviation: ${s.std_dev} (${s.std_dev > 1.0 ? 'High variance' : 'Consistent'})`)
    if (s.lowest_areas && s.lowest_areas.length > 0) {
      parts.push('\nTOP CONCERNS (Lowest Scores):')
      s.lowest_areas.slice(0, 5).forEach((area: any, i: number) => {
        parts.push(`${i + 1}. ${area.level} × ${area.category}: ${area.score}/5.0 (${area.affected_count} people)`)
      })
    }
    if (s.highest_areas && s.highest_areas.length > 0) {
      parts.push('\nSTRENGTHS (Highest Scores):')
      s.highest_areas.slice(0, 3).forEach((area: any, i: number) => {
        parts.push(`${i + 1}. ${area.level} × ${area.category}: ${area.score}/5.0`)
      })
    }
  }
  
  // Capability data summary
  if (context.data_state.capability_summary) {
    const c = context.data_state.capability_summary
    parts.push('\n\n🎯 CAPABILITY MATURITY:')
    parts.push(`- Overall Maturity: ${c.overall_avg}/5.0 (${c.maturity_level})`)
    parts.push(`- Total Responses: ${c.response_count}`)
    if (c.dimensions && c.dimensions.length > 0) {
      parts.push('\nDIMENSION BREAKDOWN:')
      c.dimensions.forEach((dim: any) => {
        const indicator = dim.score < 2.5 ? '🔴' : dim.score < 3.5 ? '🟡' : '🟢'
        parts.push(`${indicator} ${dim.name}: ${dim.score}/5.0`)
      })
    }
    if (c.weakest_dimension) {
      parts.push(`\n⚠️ CRITICAL GAP: ${c.weakest_dimension.name} (${c.weakest_dimension.score}/5.0)`)
    }
    if (c.strongest_dimension) {
      parts.push(`✅ TOP STRENGTH: ${c.strongest_dimension.name} (${c.strongest_dimension.score}/5.0)`)
    }
    if (c.biggest_gap) {
      parts.push(`📊 LARGEST VARIANCE: ${c.biggest_gap.dimension} (gap: ${c.biggest_gap.spread})`)
    }
  }
  
  parts.push('\n=== END DATA SUMMARY ===')
  parts.push('\nUse this data to provide specific, quantitative insights. Reference exact scores and counts.')
  
  return parts.join('\n')
}

/**
 * Generate smart suggestions based on context
 */
export function generateSmartSuggestions(context: PlatformContext): string[] {
  const suggestions: string[] = []
  
  // Suggest based on current page
  if (context.current_page === '/dashboard') {
    suggestions.push("Analyze top 3 problems and recommend interventions")
    suggestions.push("What's our AI readiness score and what does it mean?")
    suggestions.push("Show department comparison - where should we focus?")
  } else if (context.current_page === '/assessment') {
    suggestions.push("Which capability dimensions have the biggest impact?")
    suggestions.push("Compare our maturity to industry benchmarks")
    suggestions.push("Generate improvement roadmap for weakest areas")
  }
  
  // Suggest based on data availability
  if (!context.data_state.has_sentiment_data && !context.data_state.has_capability_data) {
    suggestions.push("How do I upload data?")
    suggestions.push("Show me a demo with sample data")
    suggestions.push("What assessments should I run?")
  } else {
    // Data-driven suggestions
    if (context.data_state.has_sentiment_data) {
      suggestions.push("What interventions would address our top concerns?")
      suggestions.push("Analyze sentiment patterns by department")
    }
    
    if (context.data_state.has_capability_data) {
      suggestions.push("Create capability improvement prioritization matrix")
      suggestions.push("Which dimension should we invest in first?")
    }
  }
  
  // General proactive suggestions
  suggestions.push("Generate board-ready executive summary")
  suggestions.push("What are our quick wins for the next 90 days?")
  suggestions.push("Compare our scores across different segments")
  
  return suggestions.slice(0, 4)
}

