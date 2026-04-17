export interface ExperienceItem {
  title: string
  company: string
  date: string
  details: {
    label: string
    text: string
  }[]
  isCurrent: boolean
}

export const experience: ExperienceItem[] = [
  {
    title: 'Production Data Analysis & Reporting',
    company: 'Foxconn · Hungary',
    date: 'Mar 2023 – Oct 2024',
    isCurrent: false,
    details: [
      {
        label: 'Performance Optimization',
        text: 'Collected and analyzed production defect data using Python to identify critical quality issues, high scrap-rate models, and associated financial losses. Presented findings to the PD Manager, enabling targeted quality controls, directly resulting in a ~3% increase in line pass rate of specific models and a ~5% reduction in scrap storage requirements on the PD area.',
      },
      {
        label: 'Process Automation',
        text: 'Engineered Excel VBA scripts to automate KPI reporting and training matrices, reducing data preparation time by ~80% and sparing time for higher-priority tasks. Prepared technical documentation for the scripts.',
      },
      {
        label: 'Data Governance',
        text: 'Developed standardized templates for production data collection, ensuring integrity for trend analysis.',
      },
      {
        label: 'Inventory Analytics',
        text: 'Managed and analyzed inventory and initiated purchase requisitions to maintain operations.',
      },
    ],
  },
  {
    title: 'Quality Operator',
    company: 'Foxconn · Hungary',
    date: 'Jan 2023 – Mar 2023',
    isCurrent: false,
    details: [
      {
        label: 'Root Cause Analysis',
        text: 'Managed supplier complaints by performing deep analysis on hundreds of defective units; documented findings in Excel and coordinated RMAs with the warehouse to recover financial losses.',
      },
      {
        label: 'KPI Tracking',
        text: 'Generated daily First Pass Yield (FPY) reports from testing logs to monitor production line performance.',
      },
      {
        label: 'SOP Standardization',
        text: 'Translated several SOPs (English → Russian).',
      },
    ],
  },
]
