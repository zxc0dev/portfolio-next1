export interface TenureBand {
  band: string
  customers: number
  churnRate: number
}

export interface KPI {
  label: string
  value: string
  foot: string
}

export interface RiskSignal {
  title: string
  description: string
  rate: string
  uplift: string
}

export interface RetentionCard {
  label: string
  description: string
}

export const tenureData: TenureBand[] = [
  { band: '0–5', customers: 1869, churnRate: 47.5 },
  { band: '6–12', customers: 682, churnRate: 32.9 },
  { band: '13–24', customers: 803, churnRate: 24.6 },
  { band: '25–36', customers: 673, churnRate: 17.0 },
  { band: '37–48', customers: 789, churnRate: 14.6 },
  { band: '49–60', customers: 832, churnRate: 11.9 },
  { band: '61–72', customers: 1395, churnRate: 6.7 },
]

export const kpis: KPI[] = [
  { label: 'Total Customers', value: '7,043', foot: 'Dataset size' },
  { label: 'Overall Churn', value: '26.5%', foot: '1,869 churned' },
  { label: 'Avg Monthly', value: '$64.76', foot: 'Monthly charges' },
  { label: 'M2M Share', value: '55.0%', foot: 'Month-to-month' },
]

export const riskSignals: RiskSignal[] = [
  {
    title: 'New month-to-month',
    description: 'M2M contract with 0–5 months tenure',
    rate: '61.2%',
    uplift: '2.3× avg',
  },
  {
    title: 'No online security',
    description: 'Customers without online security add-on',
    rate: '41.8%',
    uplift: '1.6× avg',
  },
  {
    title: 'Fiber without support',
    description: 'Fiber optic customers lacking tech support',
    rate: '46.3%',
    uplift: '1.7× avg',
  },
  {
    title: 'Electronic check',
    description: 'Electronic check payment method users',
    rate: '45.3%',
    uplift: '1.7× avg',
  },
]

export const retentionPlan: RetentionCard[] = [
  {
    label: 'Proactive Onboarding',
    description:
      'Proactive onboarding campaign (check-in calls at month 1 & 3, welcome bundle), targeting new month-to-month customers, tenure 0–5 months.',
  },
  {
    label: 'Contract Migration',
    description:
      'Time-limited incentive to migrate M2M → annual contract, aiming at high-risk M2M customers.',
  },
  {
    label: 'Bundle Add-ons',
    description:
      'Bundle online security & tech support into mid-tier plans by default for customers without add-ons.',
  },
  {
    label: 'Fiber Support Outreach',
    description:
      'Proactive tech support outreach for new fiber optic customers, using fiber optic × no tech support cohort feature.',
  },
  {
    label: 'Auto-pay Incentive',
    description:
      'Incentivise switch to automatic payment ($5/month discount for auto-pay), transitioning electronic check users.',
  },
]
