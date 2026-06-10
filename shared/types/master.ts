export interface SerializedSource {
  id: string
  name: string
  isSystem: boolean
  sortOrder: number
}

export interface SerializedCategory {
  id: string
  name: string
  type: 'INCOME' | 'OUTCOME'
  isSystem: boolean
}
