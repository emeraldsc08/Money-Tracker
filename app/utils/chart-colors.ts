const CHART_PALETTE = [
  '#2563eb',
  '#059669',
  '#d97706',
  '#7c3aed',
  '#db2777',
  '#0891b2',
  '#ea580c',
  '#65a30d',
  '#4f46e5',
  '#0d9488',
  '#dc2626',
  '#9333ea',
  '#ca8a04',
  '#16a34a',
  '#0284c7',
  '#c026d3',
  '#e11d48',
  '#1d4ed8',
  '#047857',
  '#b45309',
] as const

export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, index) => CHART_PALETTE[index % CHART_PALETTE.length])
}
