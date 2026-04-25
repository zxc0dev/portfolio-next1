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
    dateRange: 'Mar 2026 – Present',
    why: 'Slovakia has limited public labour-market data. I wanted hands-on experience building a full data platform — ingestion to modelling — while producing something genuinely useful for understanding local hiring dynamics.',
    description:
      'Designed and built an end-to-end data platform ingesting structured job listings from Profesia.sk — Slovakia\'s largest job board. The pipeline extracts, normalises, and loads postings into a modelled warehouse layer, enabling labour-market trend analysis across regions, industries, and skill categories. Insights surface demand shifts, salary bands, and emerging role patterns across the Slovak job market.',
    tags: ['Python', 'SQL', 'dbt', 'Power BI'],
  },
  {
    slug: 'covid',
    title: 'Covid Global Impact Analysis',
    githubUrl: 'https://github.com/zxc0dev/covid-global-impact-analysis',
    isConfidential: false,
    isWip: false,
    dateRange: 'Feb 2026 – Present',
    why: 'Covid was the defining global event of the decade. I wanted to go beyond the headline numbers and understand whether policy responses, healthcare capacity, and demographics actually explained differences in outcomes — or whether the narrative was messier.',
    description:
      'Multi-dimensional analysis of the Covid-19 pandemic\'s global footprint across 10 datasets covering cases, deaths, vaccinations, mobility, economic indicators, healthcare capacity, policy responses, and demographic factors. SQL-driven data integration and Python modelling surface cross-country patterns in outbreak severity, intervention timing, and recovery trajectories — translating raw epidemiological and socioeconomic signals into a coherent, evidence-backed narrative.',
    dataset: '10 public datasets — epidemiological, economic & policy sources',
    tags: ['Python', 'SQL', 'Pandas', 'Power BI'],
  },
  {
    slug: 'rfm',
    title: 'Customer RFM Segmentation',
    githubUrl: 'https://github.com/zxc0dev/customer-rfm-segmentation-dashboard',
    isConfidential: false,
    isWip: false,
    dateRange: 'Sep 2025 – Nov 2025',
    why: 'RFM is a foundational technique in customer analytics. I wanted to go past the theory, apply it on a real transaction dataset, layer in clustering, and turn the segments into something a marketing team could actually act on.',
    description:
      'Segmented a 541,910-transaction retail dataset into four actionable customer groups using RFM scoring and K-Means clustering. The resulting Power BI dashboard surfaces each segment\'s revenue contribution, churn risk, and recommended marketing action — giving the business a clear, data-backed playbook for customer lifecycle management.',
    dataset: 'UCI Online Retail II — 541 910 transactions, 8 fields',
    tags: ['Python', 'SQL', 'Scikit-learn', 'Power BI'],
  },
  {
    slug: 'churn',
    title: 'Telecom Customer Churn Prediction',
    githubUrl: 'https://github.com/zxc0dev/telecom-customer-churn-prediction',
    isConfidential: false,
    isWip: false,
    dateRange: 'Nov 2025 – Feb 2026',
    why: 'Churn prediction sits at the intersection of EDA, feature engineering, and ML evaluation. I chose this dataset to build a complete pipeline from scratch — not just a model, but a retention strategy grounded in what the data actually shows.',
    description:
      'Built a full ML pipeline on 7,000+ telecom customer records to predict churn before it happens. After extensive EDA, five engineered features and four classifiers were evaluated; XGBoost achieved 0.84 ROC-AUC with 0.80 recall. Findings were translated into a structured retention plan covering contract migration incentives, onboarding touchpoints, and targeted outreach for high-risk fiber cohorts.',
    dataset: 'Kaggle Telco Churn — 7 043 customers, 21 features',
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
  },
]