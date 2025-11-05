// ACTUAL Sentiment Heatmap Structure
// Based on data/Database info/SentimentScan_load_db/connector_csv/

export const SENTIMENT_LEVELS = [
  {
    id: 1,
    name: 'Personal Workflow Preferences',
    description: 'Preferences about AI in personal workflows'
  },
  {
    id: 2,
    name: 'Collaboration & Role Adjustments',
    description: 'Collaboration and team adaptation issues'
  },
  {
    id: 3,
    name: 'Professional Trust & Fairness Issues',
    description: 'Concerns about fairness, trust, and transparency'
  },
  {
    id: 4,
    name: 'Career Security & Job Redefinition Anxiety',
    description: 'Job change and career risk concerns'
  },
  {
    id: 5,
    name: 'Organizational Stability at Risk',
    description: 'Organizational risk and instability due to AI'
  }
] as const

export const SENTIMENT_CATEGORIES = [
  {
    id: 1,
    name: 'AI is too Autonomous',
    shortName: 'Too Autonomous',
    description: 'Concern about AI acting without enough human control'
  },
  {
    id: 2,
    name: 'AI is too Inflexible',
    shortName: 'Too Inflexible',
    description: 'Concern that AI lacks flexibility or adaptability'
  },
  {
    id: 3,
    name: 'AI is Emotionless',
    shortName: 'Emotionless',
    description: 'Perception that AI lacks emotional intelligence'
  },
  {
    id: 4,
    name: 'AI is too Opaque',
    shortName: 'Too Opaque',
    description: 'Concern about transparency of AI decisions'
  },
  {
    id: 5,
    name: 'People Prefer Human Interaction',
    shortName: 'Prefer Human',
    description: 'Preference for human empathy and communication'
  }
] as const

// How sentiment_1 through sentiment_25 map to the 5×5 grid
// Pattern: Row-by-row, left to right
export const SENTIMENT_COLUMN_MAPPING = {
  // Level 1 (Personal Workflow) × 5 categories
  'L1_C1': 'sentiment_1',   // Personal × Too Autonomous
  'L1_C2': 'sentiment_2',   // Personal × Too Inflexible
  'L1_C3': 'sentiment_3',   // Personal × Emotionless
  'L1_C4': 'sentiment_4',   // Personal × Too Opaque
  'L1_C5': 'sentiment_5',   // Personal × Prefer Human

  // Level 2 (Collaboration) × 5 categories
  'L2_C1': 'sentiment_6',
  'L2_C2': 'sentiment_7',
  'L2_C3': 'sentiment_8',
  'L2_C4': 'sentiment_9',
  'L2_C5': 'sentiment_10',

  // Level 3 (Trust & Fairness) × 5 categories
  'L3_C1': 'sentiment_11',
  'L3_C2': 'sentiment_12',
  'L3_C3': 'sentiment_13',
  'L3_C4': 'sentiment_14',
  'L3_C5': 'sentiment_15',

  // Level 4 (Career Security) × 5 categories
  'L4_C1': 'sentiment_16',
  'L4_C2': 'sentiment_17',
  'L4_C3': 'sentiment_18',
  'L4_C4': 'sentiment_19',
  'L4_C5': 'sentiment_20',

  // Level 5 (Org Stability) × 5 categories
  'L5_C1': 'sentiment_21',
  'L5_C2': 'sentiment_22',
  'L5_C3': 'sentiment_23',
  'L5_C4': 'sentiment_24',
  'L5_C5': 'sentiment_25',
} as const

// Detailed cell descriptions (to be enhanced with GPT)
export const CELL_DESCRIPTIONS = {
  'L1_C1': 'Concerns about AI autonomy affecting personal work preferences and control',
  'L1_C2': 'Frustration with AI inflexibility in adapting to individual work styles',
  'L1_C3': 'Discomfort with lack of emotional understanding in personal AI interactions',
  'L1_C4': 'Uncertainty about how AI assists personal workflows due to lack of transparency',
  'L1_C5': 'Preference for human interaction over AI in personal work contexts',
  
  'L2_C1': 'Concerns about autonomous AI disrupting team collaboration and roles',
  'L2_C2': 'Issues with AI rigidity affecting team flexibility and adaptation',
  'L2_C3': 'Missing emotional intelligence in AI-mediated collaboration',
  'L2_C4': 'Lack of clarity about AI impact on team roles and responsibilities',
  'L2_C5': 'Strong preference for human interaction in collaborative settings',
  
  'L3_C1': 'Trust concerns about autonomous AI decisions affecting professional fairness',
  'L3_C2': 'AI inflexibility undermining professional judgment and standards',
  'L3_C3': 'Emotionless AI affecting professional relationships and trust',
  'L3_C4': 'Opacity of AI creating fairness and accountability concerns',
  'L3_C5': 'Need for human judgment in maintaining professional trust',
  
  'L4_C1': 'Career anxiety from AI autonomy in job-redefining decisions',
  'L4_C2': 'Concern that inflexible AI limits career growth and adaptation',
  'L4_C3': 'Job insecurity amplified by emotionless AI replacement',
  'L4_C4': 'Uncertainty about career impact due to opaque AI transformation',
  'L4_C5': 'Desire for human guidance during career transitions with AI',
  
  'L5_C1': 'Organizational risk from uncontrolled autonomous AI systems',
  'L5_C2': 'Organizational vulnerability due to inflexible AI infrastructure',
  'L5_C3': 'Company culture damage from emotionless AI implementation',
  'L5_C4': 'Systemic organizational risk from opaque AI decision-making',
  'L5_C5': 'Organizational stability threatened by loss of human connection'
} as const

// Color coding based on RELATIVE ranking
export const COLOR_RANKING = {
  TOP_3: '#15803d',      // Dark green - highest 3 scores (best/least resistance)
  TOP_8: '#84cc16',      // Light green - top 8 scores
  MIDDLE: '#fcd34d',     // Yellow - middle range
  BOTTOM_8: '#fb923c',   // Light pink/orange - bottom 8 scores
  BOTTOM_3: '#dc2626',   // Dark red - lowest 3 scores (worst/most resistance)
  NO_DATA: '#6b7280'     // Gray - no data
} as const

// Taboos: Things to AVOID when addressing concerns in each sentiment area
export const CELL_TABOOS: Record<string, string[]> = {
  'L1_C1': [
    "Don't remove all human decision points from workflows",
    "Avoid implementing AI without clear opt-out mechanisms",
    "Never deploy AI that can't be paused or overridden by users",
    "Don't hide automation behind opaque systems"
  ],
  'L1_C2': [
    "Don't create rigid AI systems that can't handle exceptions",
    "Avoid one-size-fits-all AI workflows without customization",
    "Never ignore user requests for workflow modifications",
    "Don't lock users into inflexible AI processes"
  ],
  'L1_C3': [
    "Don't eliminate all personal interaction opportunities",
    "Avoid cold, purely transactional AI communications",
    "Never remove empathy cues from AI responses",
    "Don't replace human mentorship with AI entirely"
  ],
  'L1_C4': [
    "Don't deploy black-box AI without explanation",
    "Avoid hiding how AI assists individual work",
    "Never refuse to explain AI recommendations",
    "Don't make AI changes without communicating impact"
  ],
  'L1_C5': [
    "Don't force AI adoption for all personal tasks",
    "Avoid eliminating human support options",
    "Never shame employees for preferring human interaction",
    "Don't make AI the only path for personal productivity"
  ],

  'L2_C1': [
    "Don't let AI dictate team roles without consultation",
    "Avoid autonomous AI that bypasses team input",
    "Never implement AI that undermines team authority",
    "Don't remove team autonomy in favor of AI decisions"
  ],
  'L2_C2': [
    "Don't impose rigid AI workflows on dynamic teams",
    "Avoid AI systems that can't adapt to team needs",
    "Never force standardization that kills team creativity",
    "Don't lock teams into inflexible AI collaboration tools"
  ],
  'L2_C3': [
    "Don't replace all team bonding with AI coordination",
    "Avoid eliminating casual team interactions",
    "Never let AI mediate all team communication",
    "Don't remove emotional support from team dynamics"
  ],
  'L2_C4': [
    "Don't hide how AI affects team responsibilities",
    "Avoid opaque AI changes to collaboration patterns",
    "Never deploy AI that secretly reshapes roles",
    "Don't obscure AI's impact on team structure"
  ],
  'L2_C5': [
    "Don't eliminate human managers for AI supervision",
    "Avoid replacing team leads with AI coordinators",
    "Never force AI-mediated teamwork for all tasks",
    "Don't remove human judgment from team decisions"
  ],

  'L3_C1': [
    "Don't let AI make fairness decisions without oversight",
    "Avoid autonomous AI in performance evaluation",
    "Never allow AI to make irreversible career decisions",
    "Don't remove human judgment from critical professional matters"
  ],
  'L3_C2': [
    "Don't create rigid AI evaluation systems",
    "Avoid inflexible AI that can't consider context",
    "Never use AI that ignores professional nuance",
    "Don't lock professionals into standardized AI assessments"
  ],
  'L3_C3': [
    "Don't remove empathy from professional feedback",
    "Avoid purely metric-driven AI evaluations",
    "Never eliminate human support in difficult situations",
    "Don't let AI deliver sensitive professional news"
  ],
  'L3_C4': [
    "Don't use black-box AI for professional decisions",
    "Avoid unexplained AI in fairness-critical contexts",
    "Never hide how AI affects professional outcomes",
    "Don't make AI decisions non-contestable"
  ],
  'L3_C5': [
    "Don't replace human judgment in ethical dilemmas",
    "Avoid AI-only solutions for trust-critical issues",
    "Never eliminate human accountability for professional standards",
    "Don't let AI override professional expertise"
  ],

  'L4_C1': [
    "Don't let AI autonomously eliminate jobs",
    "Avoid surprise career-impacting AI decisions",
    "Never use AI to secretly plan workforce changes",
    "Don't remove human control over career trajectory"
  ],
  'L4_C2': [
    "Don't create inflexible AI that limits career growth",
    "Avoid rigid AI skill assessments",
    "Never lock employees into narrow AI-defined roles",
    "Don't use AI to restrict career development paths"
  ],
  'L4_C3': [
    "Don't implement AI without addressing job security fears",
    "Avoid cold, impersonal AI job transition support",
    "Never eliminate human career counseling",
    "Don't let AI deliver job change news without empathy"
  ],
  'L4_C4': [
    "Don't hide AI's impact on job security",
    "Avoid opaque AI-driven workforce planning",
    "Never deploy AI that secretly assesses job viability",
    "Don't obscure how AI affects individual career futures"
  ],
  'L4_C5': [
    "Don't replace career counselors with AI chatbots",
    "Avoid removing human mentorship in transitions",
    "Never force AI-only career development",
    "Don't eliminate personal guidance during job changes"
  ],

  'L5_C1': [
    "Don't implement AI that can destabilize the organization",
    "Avoid autonomous AI in strategic decisions",
    "Never deploy AI that threatens organizational control",
    "Don't remove leadership oversight of AI systems"
  ],
  'L5_C2': [
    "Don't create inflexible AI that can't adapt to business changes",
    "Avoid rigid AI infrastructure during organizational change",
    "Never lock the organization into inflexible AI architectures",
    "Don't use AI systems that resist business evolution"
  ],
  'L5_C3': [
    "Don't let AI eliminate organizational culture and values",
    "Avoid cold AI that damages company identity",
    "Never remove human elements from organizational mission",
    "Don't replace cultural touchpoints with AI automation"
  ],
  'L5_C4': [
    "Don't hide AI's systemic organizational impact",
    "Avoid opaque AI driving major organizational changes",
    "Never deploy enterprise AI without transparency",
    "Don't obscure how AI reshapes the organization"
  ],
  'L5_C5': [
    "Don't eliminate human leadership for AI governance",
    "Avoid removing executive oversight in favor of AI",
    "Never let AI make final organizational decisions",
    "Don't replace strategic human judgment with algorithms"
  ]
}

// STANDARD LOGIC: Lower display scores (1-2) = MORE resistance = WORSE (red)
// Higher display scores (3-4) = LESS resistance = BETTER (green)
export function getRankedColor(score: number, allScores: number[]): string {
  if (allScores.length === 0) return COLOR_RANKING.NO_DATA

  // Sort ASCENDING (lowest to highest)
  const sorted = [...allScores].sort((a, b) => a - b)

  // Top 3 = LOWEST 3 scores (best sentiment, least resistance)
  const top3Threshold = sorted[2] || sorted[sorted.length - 1]
  const top8Threshold = sorted[7] || sorted[sorted.length - 1]

  // Bottom 3 = HIGHEST 3 scores (worst sentiment, most resistance)
  const bottom8Threshold = sorted[sorted.length - 8] || sorted[0]
  const bottom3Threshold = sorted[sorted.length - 3] || sorted[0]

  // Lower scores are BETTER (green)
  if (score <= top3Threshold) {
    return COLOR_RANKING.TOP_3 // Dark green - least resistance
  } else if (score <= top8Threshold) {
    return COLOR_RANKING.TOP_8 // Light green
  } else if (score >= bottom3Threshold) {
    return COLOR_RANKING.BOTTOM_3 // Dark red - most resistance
  } else if (score >= bottom8Threshold) {
    return COLOR_RANKING.BOTTOM_8 // Orange - concerning
  } else {
    return COLOR_RANKING.MIDDLE // Yellow - moderate
  }
}


