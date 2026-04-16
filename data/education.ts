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
    type: 'degree',
    title: "Junior Bachelor's in Computer Engineering",
    issuer: 'EQF Level 5 — Short-cycle Higher Education',
    date: 'Sep 2022 – Jul 2025',
    detail:
      'Foundational coursework in computer systems, programming, networking, and data structures.',
    isWip: false,
  },
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
    title: 'Microsoft Power BI Professional Certificate',
    issuer: 'Coursera · Microsoft',
    date: 'Feb 2026 – Present',
    detail:
      'Advanced Power BI — DAX, data modeling, report design, and enterprise-grade dashboard development.',
    isWip: true,
  },
]
