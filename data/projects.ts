export interface Project {
  slug: string
  title: string
  githubUrl: string | null
  isConfidential: boolean
  isWip: boolean
  dateRange?: string
  dataset?: string
  description?: string
  why?: string
  tags: string[]
}

export const projects: Project[] = [
  {
    slug: 'profesia',
    title: 'Data Platform for Job Market Intelligence (Profesia.sk)',
    githubUrl: 'https://github.com/zxc0dev/profesia-job-market-intelligence',
    isConfidential: false,
    isWip: false,
    dateRange: 'Apr 2026 – Present',
    why: '',
    description:
      '',
    tags: ['Python', 'dbt', 'Prefect', 'PostgreSQL', 'VPS deployment', 'Great Expectations'],
  },
  {
    slug: 'covid',
    title: 'Covid Global Impact Analysis',
    githubUrl: 'https://github.com/zxc0dev/covid-global-impact-analysis',
    isConfidential: false,
    isWip: false,
    dateRange: 'May 2026 – Present',
    why: '',
    description:
      '',
    dataset: '10 public datasets — epidemiological, economic & policy sources',
    tags: ['Python', 'PostgreSQL', 'dbt'],
  },
  {
    slug: 'rfm',
    title: 'Customer RFM Segmentation',
    githubUrl: 'https://github.com/zxc0dev/customer-rfm-segmentation-dashboard',
    isConfidential: false,
    isWip: false,
    dateRange: 'Feb 2026 – Apr 2026',
    why: '',
    description:
      'An end-to-end RFM segmentation project using the Online Retail II UCI dataset. The pipeline includes data cleaning, RFM metric calculation, K-means clustering for segment discovery.',
    dataset: 'Online Retail II UCI — 1,067,371 transactions, 8 features',
    tags: ['Python', 'PostgreSQL', 'Scikit-learn', 'dbt', 'Prefect'],
  },
  {
    slug: 'churn',
    title: 'Telecom Customer Churn Prediction',
    githubUrl: 'https://github.com/zxc0dev/telecom-customer-churn-prediction',
    isConfidential: false,
    isWip: false,
    dateRange: 'Dec 2025 – Mar 2026',
    why: 'The first project I did for a showcase. I used this project as a stepping stone to strengthen my project structuring and further develop my Python skills.',
    description:
      '',
    dataset: 'Kaggle Telco Churn — 7 043 customers, 21 features',
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
  },
]