export interface EducationItem {
  type: 'degree' | 'cert'
  title: string
  issuer: string
  date: string
  detail: string
  isWip: boolean
}

export const education: EducationItem[] = [
  {
    type: 'cert',
    title: 'IBM Data Science Professional Certificate',
    issuer: 'Coursera · IBM',
    date: 'Sep 2025 – Feb 2026',
    detail:
      'End-to-end data science methodology — Excel, Python, SQL, data visualization, machine learning.',
    isWip: false,
  },
  {
    type: 'cert',
    title: 'DeepLearning.AI Machine Learning Specialization',
    issuer: 'Coursera · DeepLearning.AI',
    date: 'Apr 2025 – Jul 2025',
    detail:
      'Supervised & unsupervised learning, neural networks, recommender systems, and reinforcement learning — taught by Andrew Ng.',
    isWip: false,
  },
  {
    type: 'cert',
    title: 'Statistics with Python University of Michigan Specialization',
    issuer: 'Coursera · University of Michigan',
    date: 'Feb 2026 – Present',
    detail:
      'Statistical analysis, hypothesis testing, and data visualization using Python — taught by the University of Michigan faculty.',
    isWip: true,
  },
]
