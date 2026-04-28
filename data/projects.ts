export interface Project {
  slug: string
  title: string
  githubUrl: string | null
  isWip: boolean
  dateRange?: string
  dataset?: string
  why?: string
  tags: string[]
}

export const projects: Project[] = [
  {
    slug: 'profesia',
    title: 'Data Platform for Job Market Intelligence (Profesia.sk)',
    githubUrl: 'https://github.com/zxc0dev/profesia-job-market-intelligence',
    isWip: false,
    dateRange: 'Apr 2026 – Present',
    why: 'Building on real, continuously-updating data. Profesia.sk provides a live stream of job postings that turns a personal project into a genuine data engineering challenge — handling incremental loads, schema drift, and data quality in production rather than against a static CSV.',
    tags: ['Python', 'dbt', 'Prefect', 'PostgreSQL', 'VPS deployment', 'Great Expectations'],
  },
  {
    slug: 'covid',
    title: 'Covid Global Impact Analysis',
    githubUrl: 'https://github.com/zxc0dev/covid-global-impact-analysis',
    isWip: false,
    dateRange: 'May 2026 – Present',
    why: 'COVID-19 was one of the most data-dense global events in modern history. Combining epidemiological, economic, and policy sources from 10 separate datasets let me practice what actually matters in data work: aligning heterogeneous schemas, resolving conflicting definitions, and surfacing cross-domain patterns invisible in any single feed.',
    dataset: '10 public datasets — epidemiological, economic & policy sources',
    tags: ['Python', 'PostgreSQL', 'dbt'],
  },
  {
    slug: 'rfm',
    title: 'Customer RFM Segmentation',
    githubUrl: 'https://github.com/zxc0dev/customer-rfm-segmentation-dashboard',
    isWip: false,
    dateRange: 'Feb 2026 – Apr 2026',
    why: 'RFM segmentation converts raw purchase history into actionable customer tiers without any additional data. The goal was to build an end-to-end pipeline — from messy transaction logs through feature engineering and K-Means clustering to an interactive dashboard — and to answer a practical question: which customers drive revenue, which are slipping, and how much is at risk?',
    dataset: 'Online Retail II UCI — 1,067,371 transactions, 8 features',
    tags: ['Python', 'PostgreSQL', 'Scikit-learn', 'dbt', 'Prefect'],
  },
  {
    slug: 'churn',
    title: 'Telecom Customer Churn Prediction',
    githubUrl: 'https://github.com/zxc0dev/telecom-customer-churn-prediction',
    isWip: false,
    dateRange: 'Dec 2025 – Mar 2026',
    why: 'The first project I did for a showcase. I used this project as a stepping stone to strengthen my project structuring and further develop my Python skills.',
    dataset: 'Kaggle Telco Churn — 7 043 customers, 21 features',
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
  },
]