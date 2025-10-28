// ACTUAL Capability Assessment Structure
// Based on data/Database info/AICapability_load_db/AI_CapScan_Questions_csv/

export const CAPABILITY_DIMENSIONS = [
  {
    id: 1,
    name: 'Strategy and Vision',
    description: 'An organization that scores high on Strategy and Vision drives AI initiatives aligned with core business objectives, supported by strong leadership commitment, clear long-term vision for sustainable AI transformation, and well-defined resource allocation strategies.',
    constructs: [1, 2, 3, 4]
  },
  {
    id: 2,
    name: 'Data',
    description: 'An organization that scores high on Data ensures exceptional data quality, making reliable, trustworthy data accessible for all functions. It has robust governance framework that guarantees realtime insights, advanced analyses, and strategic, data-driven decisions.',
    constructs: [5, 6, 7, 8]
  },
  {
    id: 3,
    name: 'Technology',
    description: 'An organization that scores high on Technology makes use of advanced AI tools and platforms, ensures scalability for future growth, and is well-prepared. It makes use of optimized cloud and on-premises solutions tailored to business needs. Seamless integration between systems and processes ensures efficient, innovative, and sustainable AI-driven improvements.',
    constructs: [9, 10, 11, 12]
  },
  {
    id: 4,
    name: 'Talent and Skills',
    description: 'An organization that scores high on Talent and Skills ensures advanced AI expertise and invests heavily in ongoing training. It promotes a culture ready for AI integration and stimulates cross-functional collaboration on AI initiatives, driving innovation and organizational transformation.',
    constructs: [13, 14, 15, 16]
  },
  {
    id: 5,
    name: 'Organisation and Processes',
    description: 'An organization that scores high on Organisation and Processes has AI deeply embedded in its organizational structure, supported by robust decision-making framework and strategic alignment. Processes are seamlessly integrated and optimized with AI, AI-enabled decision-making drives continuous improvement and data-driven strategies.',
    constructs: [17, 18, 19, 20]
  },
  {
    id: 6,
    name: 'Innovation',
    description: 'An organization that scores high on Innovation promotes a culture of experimentation, active prototyping and testing of AI solutions. It invests significantly in R&D, accelerates implementation of AI, and empowers leadership to stimulate innovation. This drives rapid acceptance of advanced technologies and a lasting competitive advantage through AI-based, customer-centric products and services.',
    constructs: [21, 22, 23, 24]
  },
  {
    id: 7,
    name: 'Adaptation & Adoption',
    description: 'An organization that scores high on Adaptation & Adoption is acutely aware that effective use of AI requires systematic updating of tools and processes to ensure employees can use them as intended. It also adapts to the situation by training employees on best practices and experimenting with AI work methods among teams.',
    constructs: [25, 26, 27, 28]
  },
  {
    id: 8,
    name: 'Ethics and Responsibility',
    description: 'An organization that scores high on Ethics and Responsibility implements robust ethical AI framework that ensures fairness, transparency, and accountability in AI systems. It prioritizes preventing biases, maintains strict standards for data privacy and security, and complies with privacy regulations. It ensures transparency and accountability and manages legal compliance, organizes ethical review processes and legally verifiable actions around AI-powered processes and decisions.',
    constructs: [29, 30, 31, 32]
  }
] as const

export const CAPABILITY_CONSTRUCTS = [
  { id: 1, dimensionId: 1, name: 'Alignment with Business Goals', module: 1 },
  { id: 2, dimensionId: 1, name: 'Leadership Commitment', module: 2 },
  { id: 3, dimensionId: 1, name: 'Long-Term Vision', module: 3 },
  { id: 4, dimensionId: 1, name: 'Resource Allocation', module: 4 },
  
  { id: 5, dimensionId: 2, name: 'Data Quality', module: 1 },
  { id: 6, dimensionId: 2, name: 'Data Accessibility', module: 2 },
  { id: 7, dimensionId: 2, name: 'Data Governance Framework', module: 3 },
  { id: 8, dimensionId: 2, name: 'Data Integration', module: 4 },
  
  { id: 9, dimensionId: 3, name: 'AI Tools and Platforms', module: 1 },
  { id: 10, dimensionId: 3, name: 'Scalability', module: 2 },
  { id: 11, dimensionId: 3, name: 'Cloud vs. On-Premises Solutions', module: 3 },
  { id: 12, dimensionId: 3, name: 'Integration and Optimization', module: 4 },
  
  { id: 13, dimensionId: 4, name: 'AI Skills and Expertise', module: 1 },
  { id: 14, dimensionId: 4, name: 'Training and Development', module: 2 },
  { id: 15, dimensionId: 4, name: 'Recruitment and Team Formation', module: 3 },
  { id: 16, dimensionId: 4, name: 'Cross-Functional Collaboration', module: 4 },
  
  { id: 17, dimensionId: 5, name: 'AI Governance and Structure', module: 1 },
  { id: 18, dimensionId: 5, name: 'Process Integration and Optimization', module: 2 },
  { id: 19, dimensionId: 5, name: 'Change Management', module: 3 },
  { id: 20, dimensionId: 5, name: 'AI-Driven Decision Optimization', module: 4 },
  
  { id: 21, dimensionId: 6, name: 'Prototyping and Experimentation', module: 1 },
  { id: 22, dimensionId: 6, name: 'Products and Services', module: 2 },
  { id: 23, dimensionId: 6, name: 'Speed of Implementation', module: 3 },
  { id: 24, dimensionId: 6, name: 'Innovation Culture and Leadership', module: 4 },
  
  { id: 25, dimensionId: 7, name: 'Tool Adoption', module: 1 },
  { id: 26, dimensionId: 7, name: 'Job Redesign', module: 2 },
  { id: 27, dimensionId: 7, name: 'Employee Engagement', module: 3 },
  { id: 28, dimensionId: 7, name: 'Confidence/Authority', module: 4 },
  
  { id: 29, dimensionId: 8, name: 'Ethical AI Framework', module: 1 },
  { id: 30, dimensionId: 8, name: 'Bias and Fairness', module: 2 },
  { id: 31, dimensionId: 8, name: 'Transparency and Explainability', module: 3 },
  { id: 32, dimensionId: 8, name: 'Data Privacy and Security', module: 4 }
] as const

// Helper to get construct by dimension
export function getConstructsForDimension(dimensionId: number) {
  return CAPABILITY_CONSTRUCTS.filter(c => c.dimensionId === dimensionId)
}

// Helper to get dimension by id
export function getDimensionById(id: number) {
  return CAPABILITY_DIMENSIONS.find(d => d.id === id)
}


