// Constants for AI Navigator

export const SENTIMENT_LEVELS = {
  1: 'Highly Resistant',
  2: 'Resistant', 
  3: 'Neutral',
  4: 'Ready',
  5: 'Highly Ready'
} as const

export const SENTIMENT_REASONS = [
  'Fear of Job Loss',
  'Lack of Understanding',
  'Ethical Concerns',
  'Technical Barriers',
  'Cultural Resistance'
] as const

export const CAPABILITY_DIMENSIONS = [
  { id: 'strategyVision', name: 'Strategy & Vision', color: '#3B82F6' },
  { id: 'data', name: 'Data', color: '#8B5CF6' },
  { id: 'technology', name: 'Technology', color: '#EC4899' },
  { id: 'talentSkills', name: 'Talent & Skills', color: '#F59E0B' },
  { id: 'orgProcesses', name: 'Organisation & Processes', color: '#10B981' },
  { id: 'innovation', name: 'Innovation', color: '#06B6D4' },
  { id: 'adaptation', name: 'Adaptation & Adoption', color: '#F97316' },
  { id: 'ethics', name: 'Ethics & Responsibility', color: '#6366F1' }
] as const

export const CONSTRUCT_LABELS = {
  strategyVision: [
    'AI Vision Clarity',
    'Strategic Alignment',
    'Leadership Commitment',
    'Investment Planning'
  ],
  data: [
    'Data Quality',
    'Data Governance',
    'Data Infrastructure',
    'Data Literacy'
  ],
  technology: [
    'AI Tools & Platforms',
    'Technical Infrastructure',
    'Integration Capabilities',
    'Security & Compliance'
  ],
  talentSkills: [
    'AI Skills Availability',
    'Training Programs',
    'Talent Acquisition',
    'Knowledge Sharing'
  ],
  orgProcesses: [
    'Process Optimization',
    'Change Management',
    'Cross-functional Collaboration',
    'Performance Measurement'
  ],
  innovation: [
    'Innovation Culture',
    'Experimentation Approach',
    'R&D Investment',
    'External Partnerships'
  ],
  adaptation: [
    'User Adoption',
    'Change Readiness',
    'Pilot Programs',
    'Scaling Capabilities'
  ],
  ethics: [
    'Ethical Guidelines',
    'Bias Prevention',
    'Transparency Practices',
    'Accountability Framework'
  ]
} as const

export const SENTIMENT_COLORS = {
  1: '#DC2626', // red-600
  2: '#F97316', // orange-500
  3: '#FCD34D', // amber-300
  4: '#84CC16', // lime-500
  5: '#10B981', // emerald-500
} as const

export const HEATMAP_DESCRIPTIONS = {
  'L1_R1': {
    label: 'Fear-Driven Resistance',
    description: 'Strong resistance due to job security concerns. Requires immediate leadership intervention and clear communication about AI augmentation vs replacement.'
  },
  'L1_R2': {
    label: 'Knowledge Gap Crisis',
    description: 'Severe lack of understanding creating paralysis. Needs comprehensive education program starting with basics.'
  },
  'L1_R3': {
    label: 'Ethical Blockers',
    description: 'Deep ethical concerns preventing progress. Requires transparent AI ethics framework and governance.'
  },
  'L1_R4': {
    label: 'Technical Overwhelm',
    description: 'Technical complexity causing complete disengagement. Needs simplified tools and gradual introduction.'
  },
  'L1_R5': {
    label: 'Cultural Rejection',
    description: 'Organizational culture actively rejecting AI. Requires cultural transformation initiative.'
  },
  'L2_R1': {
    label: 'Job Insecurity',
    description: 'Moderate resistance from job concerns. Address through reskilling programs and role evolution plans.'
  },
  'L2_R2': {
    label: 'Understanding Gaps',
    description: 'Limited AI knowledge creating hesitation. Implement targeted training and awareness campaigns.'
  },
  'L2_R3': {
    label: 'Ethical Uncertainty',
    description: 'Unresolved ethical questions causing delays. Develop clear ethical guidelines and use cases.'
  },
  'L2_R4': {
    label: 'Technical Challenges',
    description: 'Technical hurdles slowing adoption. Provide better support and simplified interfaces.'
  },
  'L2_R5': {
    label: 'Cultural Friction',
    description: 'Cultural misalignment with AI adoption. Need change management and success stories.'
  },
  'L3_R1': {
    label: 'Cautious Observation',
    description: 'Neutral stance with job-related concerns. Opportunity to shift perspective through engagement.'
  },
  'L3_R2': {
    label: 'Learning Mode',
    description: 'Open to learning but needs guidance. Perfect timing for structured education programs.'
  },
  'L3_R3': {
    label: 'Ethical Evaluation',
    description: 'Weighing ethical implications carefully. Engage in open dialogue about responsible AI.'
  },
  'L3_R4': {
    label: 'Technical Assessment',
    description: 'Evaluating technical readiness. Provide proof of concepts and pilot opportunities.'
  },
  'L3_R5': {
    label: 'Cultural Transition',
    description: 'Culture in transition toward AI. Support with change champions and quick wins.'
  },
  'L4_R1': {
    label: 'Confident Evolution',
    description: 'Ready to evolve roles with AI. Leverage as change ambassadors and early adopters.'
  },
  'L4_R2': {
    label: 'Knowledge Seekers',
    description: 'Actively seeking AI knowledge. Provide advanced training and hands-on opportunities.'
  },
  'L4_R3': {
    label: 'Ethical Champions',
    description: 'Promoting responsible AI use. Engage in developing ethical frameworks and policies.'
  },
  'L4_R4': {
    label: 'Technical Enablers',
    description: 'Building technical capabilities. Support with resources and platform access.'
  },
  'L4_R5': {
    label: 'Cultural Advocates',
    description: 'Driving cultural change for AI. Empower as change agents and success story creators.'
  },
  'L5_R1': {
    label: 'Transformation Leaders',
    description: 'Leading AI-driven transformation. Position as mentors and program leaders.'
  },
  'L5_R2': {
    label: 'AI Experts',
    description: 'Deep AI understanding and advocacy. Utilize for training others and strategic planning.'
  },
  'L5_R3': {
    label: 'Ethics Pioneers',
    description: 'Setting ethical AI standards. Lead governance committees and policy development.'
  },
  'L5_R4': {
    label: 'Technical Innovators',
    description: 'Pushing technical boundaries. Drive innovation labs and advanced implementations.'
  },
  'L5_R5': {
    label: 'Cultural Transformers',
    description: 'Fully embracing AI culture. Model the future state and inspire organization-wide change.'
  }
} as const

export const DEMO_INTERVENTIONS = [
  {
    id: 'intervention-1',
    title: 'AI Literacy Bootcamp',
    description: 'Comprehensive 3-week program to build foundational AI understanding',
    fullDescription: `Launch a structured AI literacy program designed to address knowledge gaps across all organizational levels. This bootcamp combines online modules, hands-on workshops, and real-world case studies to demystify AI and its applications.

The program covers AI basics, practical use cases specific to your industry, hands-on experience with AI tools, and ethical considerations. Participants will work on mini-projects relevant to their roles, ensuring immediate applicability.

Expected outcomes include increased confidence in AI discussions, ability to identify AI opportunities in daily work, and reduced fear-based resistance. The program includes post-training support and community building for continued learning.`,
    impactArea: 'both' as const,
    targetDimensions: ['talentSkills'],
    targetSentimentAreas: ['L1_R2', 'L2_R2', 'L3_R2'],
    roiEstimate: {
      min: 15,
      max: 25,
      unit: 'percent',
      description: 'Reduction in AI project delays due to knowledge gaps'
    },
    priority: 'high' as const,
    implementation: {
      duration: '3 weeks',
      difficulty: 'easy' as const,
      resources: ['Training materials', 'AI platform access', 'Expert facilitators']
    }
  },
  {
    id: 'intervention-2',
    title: 'AI Ethics Framework Development',
    description: 'Create comprehensive ethical guidelines for responsible AI deployment',
    fullDescription: `Establish a robust AI ethics framework that addresses key concerns around bias, transparency, accountability, and fairness. This intervention involves cross-functional collaboration to develop guidelines that align with organizational values and regulatory requirements.

The framework development process includes stakeholder workshops, ethical risk assessment, policy documentation, and implementation roadmap. It creates clear decision-making criteria for AI projects and establishes governance structures.

This intervention directly addresses ethical concerns that may be blocking AI adoption, while positioning the organization as a responsible AI leader. It includes training on ethical AI principles and regular review mechanisms.`,
    impactArea: 'sentiment' as const,
    targetDimensions: ['ethics'],
    targetSentimentAreas: ['L1_R3', 'L2_R3', 'L3_R3'],
    roiEstimate: {
      min: 20,
      max: 35,
      unit: 'percent',
      description: 'Increase in stakeholder trust and AI project approval rates'
    },
    priority: 'high' as const,
    implementation: {
      duration: '6 weeks',
      difficulty: 'medium' as const,
      resources: ['Ethics experts', 'Legal consultation', 'Stakeholder time']
    }
  },
  {
    id: 'intervention-3',
    title: 'Quick Win AI Pilot Program',
    description: 'Launch targeted pilots to demonstrate immediate AI value',
    fullDescription: `Implement a series of quick-win AI pilots in high-impact, low-risk areas to build confidence and demonstrate tangible value. These pilots focus on automating repetitive tasks, enhancing decision-making, and improving customer experience.

Each pilot runs for 4-6 weeks with clear success metrics, involving teams directly in the implementation process. This hands-on approach helps overcome technical barriers and cultural resistance by showing real benefits.

The program includes pilot selection criteria, success measurement framework, scaling playbook, and change management support. Successful pilots become showcase examples that inspire broader adoption across the organization.`,
    impactArea: 'capability' as const,
    targetDimensions: ['innovation', 'adaptation'],
    targetSentimentAreas: ['L2_R4', 'L3_R4', 'L3_R5'],
    roiEstimate: {
      min: 10,
      max: 20,
      unit: 'efficiency',
      description: 'Immediate efficiency gains in pilot areas'
    },
    priority: 'medium' as const,
    implementation: {
      duration: '4-6 weeks per pilot',
      difficulty: 'easy' as const,
      resources: ['AI tools', 'Technical support', 'Project management']
    }
  },
  {
    id: 'intervention-4',
    title: 'AI Change Champions Network',
    description: 'Build a network of AI advocates across the organization',
    fullDescription: `Create and empower a network of AI change champions who will drive grassroots adoption and cultural transformation. These champions act as bridges between technical teams and business units, translating AI potential into practical applications.

The network includes representatives from each department, trained in both AI fundamentals and change management techniques. They lead by example, share success stories, and provide peer-to-peer support for AI initiatives.

Champions receive special training, resources, and recognition. They participate in regular forums to share experiences and best practices. This intervention creates sustainable change momentum and addresses cultural resistance from within.`,
    impactArea: 'both' as const,
    targetDimensions: ['orgProcesses', 'adaptation'],
    targetSentimentAreas: ['L2_R5', 'L3_R5', 'L4_R5'],
    roiEstimate: {
      min: 25,
      max: 40,
      unit: 'percent',
      description: 'Acceleration in AI adoption rate across departments'
    },
    priority: 'high' as const,
    implementation: {
      duration: '8 weeks to establish',
      difficulty: 'medium' as const,
      resources: ['Champion training', 'Communication platform', 'Recognition program']
    }
  },
  {
    id: 'intervention-5',
    title: 'Data Readiness Assessment & Upgrade',
    description: 'Comprehensive data infrastructure and governance improvement',
    fullDescription: `Conduct a thorough assessment of current data capabilities and implement targeted improvements to create a solid foundation for AI initiatives. This intervention addresses data quality, accessibility, governance, and infrastructure gaps that limit AI potential.

The program includes data audit, quality improvement initiatives, governance framework establishment, and infrastructure upgrades where needed. It ensures data is AI-ready while maintaining security and compliance.

By improving data readiness, organizations can accelerate AI implementation, improve model accuracy, and reduce project failures. This intervention includes training on data best practices and establishes ongoing data quality monitoring.`,
    impactArea: 'capability' as const,
    targetDimensions: ['data', 'technology'],
    targetConstructs: ['data_C1', 'data_C2', 'data_C3'],
    roiEstimate: {
      min: 30,
      max: 50,
      unit: 'percent',
      description: 'Reduction in AI project failures due to data issues'
    },
    priority: 'high' as const,
    implementation: {
      duration: '12 weeks',
      difficulty: 'hard' as const,
      resources: ['Data engineers', 'Infrastructure investment', 'Governance tools']
    }
  }
]
