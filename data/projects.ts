export interface Project {
  slug: string
  title: string
  image: string
  imageAlt: string
  githubUrl: string | null
  isConfidential: boolean
  isWip: boolean
  dateRange?: string
  description?: string
  steps: {
    label: string
    text: string
    metric?: string
  }[]
  tags: string[]
  summary: {
    heading: string
    text: string
  }[]
}

export const projects: Project[] = [
  {
    slug: 'rfm',
    title: 'Customer RFM Segmentation',
    image: '/images/rfm_project.webp',
    imageAlt: 'Customer RFM Segmentation Dashboard preview',
    githubUrl: 'https://github.com/zxrc0dev/customer-rfm-segmentation-dashboard',
    isConfidential: false,
    isWip: false,
    dateRange: 'Sep 2025 – Nov 2025',
    description:
      'Segmented a 541,910-transaction retail dataset into four actionable customer groups using RFM scoring and K-Means clustering. The resulting Power BI dashboard surfaces each segment’s revenue contribution, churn risk, and recommended marketing action — giving the business a clear, data-backed playbook for customer lifecycle management.',
    steps: [
      {
        label: 'Problem',
        text: 'Needed to segment a large customer base to identify high-value and at-risk groups for targeted marketing — no existing segmentation framework in place.',
      },
      {
        label: 'Action',
        text: 'Computed Recency, Frequency & Monetary scores in SQL, performed EDA with Pandas, applied K-Means clustering, and built an interactive Power BI dashboard.',
      },
      {
        label: 'Result',
        text: 'Identified 4 distinct customer segments, enabling targeted retention strategies for at-risk customers and upsell campaigns for high-value groups.',
        metric: '4 distinct customer segments',
      },
    ],
    tags: ['Python', 'SQL', 'Scikit-learn', 'Power BI'],
    summary: [
      {
        heading: 'Business Objective',
        text: 'This project addressed the need to segment a customer base using data-driven methods. The objective was to identify distinct customer groups based on purchasing behavior to enable targeted marketing and retention strategies.',
      },
      {
        heading: 'Methodology',
        text: 'Computed Recency, Frequency, and Monetary scores in SQL, performed exploratory data analysis with Pandas, applied K-Means clustering, and built an interactive Power BI dashboard.',
      },
      {
        heading: 'Key Outcomes',
        text: 'Identified four distinct customer segments, enabling targeted retention strategies for at-risk customers and upsell campaigns for high-value groups.',
      },
    ],
  },
  {
    slug: 'churn',
    title: 'Telecom Customer Churn Prediction',
    image: '/images/churn_project.webp',
    imageAlt: 'Telecom Customer Churn Prediction dashboard preview',
    githubUrl: 'https://github.com/zxrc0dev/telecom-customer-churn-prediction',
    isConfidential: false,
    isWip: false,
    dateRange: 'Nov 2025 – Feb 2026',
    description:
      'Built a full ML pipeline on 7,000+ telecom customer records to predict churn before it happens. After extensive EDA, five engineered features and four classifiers were evaluated; XGBoost achieved 0.84 ROC-AUC with 0.80 recall. Findings were translated into a structured retention plan covering contract migration incentives, onboarding touchpoints, and targeted outreach for high-risk fiber cohorts.',
    steps: [
      {
        label: 'Problem',
        text: 'A telecom company had no proactive way to identify customers at risk of churning, leading to preventable revenue loss.',
      },
      {
        label: 'Action',
        text: 'Built an end-to-end ML pipeline — data ingestion, EDA, feature engineering, and trained 4 classifiers (Logistic Regression, Random Forest, SVM, XGBoost). Visualized key churn drivers in Power BI.',
      },
      {
        label: 'Result',
        text: 'Delivered actionable retention recommendations distilled from the EDA. The top model reached 0.84 ROC-AUC with 0.80 recall, providing automated identification of at-risk customers.',
        metric: '0.84 ROC-AUC',
      },
    ],
    tags: ['Python', 'Scikit-learn', 'XGBoost', 'Power BI'],
    summary: [
      {
        heading: 'Business Objective',
        text: 'This project addresses a core telecom retention problem: customer loss is expensive, and churn needs to be identified before it happens. The goal was to analyze churn behavior, engineer predictive signals, and build a model workflow that helps teams target the right customers with timely retention actions.',
      },
      {
        heading: 'Dataset Context',
        text: 'The analysis used the Telco Customer Churn dataset from Kaggle, with 7,043 customer records and 21 features covering demographics, subscribed services, contract setup, and billing behavior.',
      },
      {
        heading: 'Key EDA Insights',
        text: 'Churn risk is concentrated early in the lifecycle, especially for month-to-month customers. Additional high-risk signals included lack of online security, fiber optic service in specific cohorts, and electronic check payment behavior.',
      },
      {
        heading: 'Feature Engineering and Modeling',
        text: 'Five engineered features were added after significance checks. Four classifiers were trained on an 80/20 stratified split with 5-fold cross-validation. XGBoost was selected as the recommended model.',
      },
      {
        heading: 'Retention Plan',
        text: 'Recommendations focused on early-lifecycle intervention, including structured onboarding touchpoints, contract migration incentives, default bundling of support add-ons, targeted outreach for fiber cohorts, and auto-pay migration.',
      },
    ],
  },
  {
    slug: 'forecasting',
    title: 'Supply Chain Demand Forecasting',
    image: '/images/forecast_project.webp',
    imageAlt: 'Supply Chain Demand Forecasting dashboard preview',
    githubUrl: 'https://github.com/zxrc0dev/supply-chain-demand-forecasting',
    isConfidential: false,
    isWip: true,
    dateRange: 'Feb 2026 – Present',
    description:
      'End-to-end SKU-level demand forecasting pipeline currently in development. Pulling historical transaction data via SQL, engineering lag and seasonality features, and training Python predictive models to reduce overstock and stockout events across the supply chain.',
    steps: [
      {
        label: 'Problem',
        text: 'Inaccurate SKU-level demand planning led to overstock and stockouts across the supply chain.',
      },
      {
        label: 'Action',
        text: 'Building an end-to-end forecasting pipeline — SQL data extraction, feature engineering, and Python predictive modeling at the SKU level.',
      },
      {
        label: 'Result',
        text: 'In progress — targeting improved forecast accuracy and reduced inventory waste.',
      },
    ],
    tags: ['Python', 'SQL', 'Scikit-learn'],
    summary: [
      {
        heading: 'Objective',
        text: 'Building an end-to-end demand forecasting pipeline to improve SKU-level planning accuracy and reduce overstock/stockout across the supply chain.',
      },
    ],
  },
]
