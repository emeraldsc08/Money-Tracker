import type { SerializedTransaction } from './transaction'

export interface SourceBreakdownItem {
  source: string
  amount: number
  percentage: number
}

export interface PieChartItem {
  label: string
  amount: number
  percentage: number
}

export interface RealtimeReportSummary {
  totalIncome: number
  totalOutcome: number
  balance: number
}

export interface RealtimeReportData {
  from: string
  to: string
  summary: RealtimeReportSummary
  incomeBySource: SourceBreakdownItem[]
  outcomeBySource: SourceBreakdownItem[]
  incomeByCategory: CategoryBreakdownItem[]
  outcomeByCategory: CategoryBreakdownItem[]
}

export type ReportPeriodPreset = 'today' | 'week' | 'month' | 'custom'

export interface ReportDateRange {
  from: string
  to: string
}

export interface MonthlyReportSummary {
  totalIncome: number
  totalOutcome: number
  balance: number
}

export interface MonthlySummaryItem {
  year: number
  month: number
  label: string
  summary: MonthlyReportSummary
}

export interface CategoryBreakdownItem {
  category: string
  amount: number
  percentage: number
}

export interface MonthlyDetailReport {
  year: number
  month: number
  label: string
  from: string
  to: string
  summary: MonthlyReportSummary
  transactions: SerializedTransaction[]
  incomeByCategory: CategoryBreakdownItem[]
  outcomeByCategory: CategoryBreakdownItem[]
}
