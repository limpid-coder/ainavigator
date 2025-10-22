import { SentimentResponse, CapabilityResponse } from '@/lib/types'

// Generate demo sentiment data
export function generateDemoSentimentData(): Partial<SentimentResponse>[] {
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America']
  const departments = ['Engineering', 'Sales', 'Marketing', 'Operations', 'HR', 'Finance']
  const roles = ['Manager', 'Senior Staff', 'Junior Staff', 'Executive', 'Analyst']
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+']
  const reasons = ['R1', 'R2', 'R3', 'R4', 'R5'] // Fear, Knowledge, Ethics, Technical, Cultural
  
  const data: Partial<SentimentResponse>[] = []
  
  // Generate 500 responses with realistic distribution
  for (let i = 0; i < 500; i++) {
    // Create realistic sentiment distribution
    let sentimentLevel: 1 | 2 | 3 | 4 | 5
    const rand = Math.random()
    if (rand < 0.15) sentimentLevel = 1 // 15% highly resistant
    else if (rand < 0.35) sentimentLevel = 2 // 20% resistant
    else if (rand < 0.60) sentimentLevel = 3 // 25% neutral
    else if (rand < 0.85) sentimentLevel = 4 // 25% ready
    else sentimentLevel = 5 // 15% highly ready
    
    // Correlate reasons with sentiment levels for realism
    let sentimentReason: string
    if (sentimentLevel <= 2) {
      // Lower sentiment more likely to have fear or knowledge gaps
      sentimentReason = Math.random() < 0.6 ? (Math.random() < 0.5 ? 'R1' : 'R2') : reasons[Math.floor(Math.random() * 5)]
    } else if (sentimentLevel >= 4) {
      // Higher sentiment less likely to have fear issues
      sentimentReason = Math.random() < 0.7 ? (Math.random() < 0.5 ? 'R3' : 'R4') : reasons[Math.floor(Math.random() * 5)]
    } else {
      sentimentReason = reasons[Math.floor(Math.random() * 5)]
    }
    
    data.push({
      responseId: `resp-${i + 1}`,
      sentimentLevel,
      sentimentReason,
      region: regions[Math.floor(Math.random() * regions.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days
    })
  }
  
  return data
}

// Generate demo capability data
export function generateDemoCapabilityData(): Partial<CapabilityResponse>[] {
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America']
  const functions = ['Technology', 'Business', 'Operations', 'Strategy', 'Support']
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+']
  
  const data: Partial<CapabilityResponse>[] = []
  
  // Generate 400 responses
  for (let i = 0; i < 400; i++) {
    // Create correlated capability scores
    const baseMaturity = 2 + Math.random() * 2 // 2-4 base range
    const variation = 0.5 // How much dimensions can vary
    
    // Different dimensions have different maturity levels for realism
    const dimensionBiases = {
      strategyVision: 0.3, // Usually higher
      data: -0.4, // Often a challenge
      technology: -0.2,
      talentSkills: -0.5, // Major gap area
      orgProcesses: 0.1,
      innovation: 0.2,
      adaptation: -0.1,
      ethics: -0.3 // Often overlooked
    }
    
    const generateDimensionScores = (dimension: string) => {
      const bias = dimensionBiases[dimension as keyof typeof dimensionBiases] || 0
      const dimBase = Math.max(1, Math.min(5, baseMaturity + bias + (Math.random() - 0.5) * variation))
      return {
        C1: Math.max(1, Math.min(5, dimBase + (Math.random() - 0.5) * 0.5)),
        C2: Math.max(1, Math.min(5, dimBase + (Math.random() - 0.5) * 0.5)),
        C3: Math.max(1, Math.min(5, dimBase + (Math.random() - 0.5) * 0.5)),
        C4: Math.max(1, Math.min(5, dimBase + (Math.random() - 0.5) * 0.5))
      }
    }
    
    const strategyScores = generateDimensionScores('strategyVision')
    const dataScores = generateDimensionScores('data')
    const techScores = generateDimensionScores('technology')
    const talentScores = generateDimensionScores('talentSkills')
    const orgScores = generateDimensionScores('orgProcesses')
    const innovationScores = generateDimensionScores('innovation')
    const adaptationScores = generateDimensionScores('adaptation')
    const ethicsScores = generateDimensionScores('ethics')
    
    // Generate contextual feedback
    const feedbackTemplates = [
      "We need better AI training programs and clearer implementation roadmaps.",
      "Data quality and governance are major concerns for AI adoption.",
      "Leadership support is strong but technical capabilities are lacking.",
      "Ethical concerns around AI need to be addressed more systematically.",
      "Innovation culture exists but needs more structured approach to AI.",
      "Change management for AI adoption requires significant improvement.",
      "Technical infrastructure needs upgrading before serious AI implementation.",
      "Skills gap in AI/ML expertise is our biggest challenge.",
      "Process optimization should precede AI implementation.",
      "Need clearer AI strategy aligned with business objectives."
    ]
    
    data.push({
      responseId: `cap-${i + 1}`,
      strategyVision_C1: strategyScores.C1,
      strategyVision_C2: strategyScores.C2,
      strategyVision_C3: strategyScores.C3,
      strategyVision_C4: strategyScores.C4,
      data_C1: dataScores.C1,
      data_C2: dataScores.C2,
      data_C3: dataScores.C3,
      data_C4: dataScores.C4,
      technology_C1: techScores.C1,
      technology_C2: techScores.C2,
      technology_C3: techScores.C3,
      technology_C4: techScores.C4,
      talentSkills_C1: talentScores.C1,
      talentSkills_C2: talentScores.C2,
      talentSkills_C3: talentScores.C3,
      talentSkills_C4: talentScores.C4,
      orgProcesses_C1: orgScores.C1,
      orgProcesses_C2: orgScores.C2,
      orgProcesses_C3: orgScores.C3,
      orgProcesses_C4: orgScores.C4,
      innovation_C1: innovationScores.C1,
      innovation_C2: innovationScores.C2,
      innovation_C3: innovationScores.C3,
      innovation_C4: innovationScores.C4,
      adaptation_C1: adaptationScores.C1,
      adaptation_C2: adaptationScores.C2,
      adaptation_C3: adaptationScores.C3,
      adaptation_C4: adaptationScores.C4,
      ethics_C1: ethicsScores.C1,
      ethics_C2: ethicsScores.C2,
      ethics_C3: ethicsScores.C3,
      ethics_C4: ethicsScores.C4,
      openFeedback: feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      function: functions[Math.floor(Math.random() * functions.length)],
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    })
  }
  
  return data
}

// Demo dataset metadata
export const DEMO_DATASETS = [
  {
    id: 'tech-company',
    name: 'Technology Company',
    description: 'Mid-size software company (2,000 employees) exploring AI integration',
    sentimentResponses: 500,
    capabilityResponses: 400,
    industries: ['Technology'],
    regions: ['North America', 'Europe'],
    highlights: [
      'High technical readiness but cultural resistance',
      'Strong in innovation, weak in ethics framework',
      'Engineering ready, other departments hesitant'
    ]
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    description: 'Large bank (10,000 employees) with AI transformation initiative',
    sentimentResponses: 1200,
    capabilityResponses: 950,
    industries: ['Financial Services'],
    regions: ['Global'],
    highlights: [
      'Strong governance but low technical skills',
      'High ethical concerns around AI use',
      'Executive support but middle management resistance'
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Industrial manufacturer (5,000 employees) digitalizing operations',
    sentimentResponses: 750,
    capabilityResponses: 600,
    industries: ['Manufacturing'],
    regions: ['Asia Pacific', 'Europe'],
    highlights: [
      'Operational efficiency focus',
      'Data quality challenges',
      'Strong process orientation, low innovation culture'
    ]
  }
]
