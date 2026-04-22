export interface Project {
  slug: string
  title: string
  type?: string
  githubUrl: string | null
  isConfidential: boolean
  isWip: boolean
  dateRange?: string
  dataset?: string
  description?: string
  tags: string[]
}

export const projects: Project[] = [
  {
    slug: 'rfm',
    title: 'Customer RFM Segmentation',
    type: 'Data Analysis',
    githubUrl: 'https://github.com/zxc0dev/customer-rfm-segmentation-dashboard',
    isConfidential: false,
    isWip: false,
    dateRange: 'Sep 2025 \u2013 Nov 2025',
    description:
      'Segmented a 541,910-transaction retail dataset into four actionable customer groups using RFM scoring and K-Means clustering. The resulting Power BI dashboard surfaces each segment\u2019s revenue contribution, churn risk, and recommended marketing action \u2014 giving the business a clear, data-backed playbook for customer lifecycle management.',
    dataset: 'UCI Online Retail II \u2014 541 910 transactions, 8 fields',
    tags: ['Python', 'SQL', 'Scikit-learn', 'Power BI'],
  },
  {
    slug: 'churn',
    title: 'Telecom Customer Churn Prediction',
    type: 'ML Pipeline',
    githubUrl: 'https://github.com/zxc0dev/telecom-customer-churn-prediction',
    isConfidential: false,
    isWip: false,
    dateRange: 'Nov 2025 \u2013 Feb 2026',
    description:
      'Built a full ML pipeline on 7,000+ telecom customer records to predict churn before it happens. After extensive EDA, five engineered features and four classifiers were evaluated; XGBoost achieved 0.84 ROC-AUC with 0.80 recall. Findings were translated into a structured retention plan covering contract migration incentives, onboarding touchpoints, and targeted outreach for high-risk fiber cohorts.',
    dataset: 'Kaggle Telco Churn \u2014 7 043 customers, 21 features',
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
  },
  {
    slug: 'forecasting',
    title: 'Supply Chain Demand Forecasting',
    type: 'Forecasting',
    githubUrl: 'https://github.com/zxc0dev/supply-chain-demand-forecasting',
    isConfidential: false,
    isWip: false,
    dateRange: 'Feb 2026 \u2013 Present',
    description:
      'End-to-end SKU-level demand forecasting pipeline. Pulls historical transaction data via SQL, engineers lag and seasonality features, and trains Python predictive models to reduce overstock and stockout events across the supply chain.',
    dataset: 'Internal warehouse exports \u2014 SKU-level daily sales',
    tags: ['Python', 'SQL', 'Scikit-learn'],
  },
]