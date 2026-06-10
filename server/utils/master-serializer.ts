import type { Category, Source } from '../../generated/prisma/client'
import type { SerializedCategory, SerializedSource } from '../../shared/types/master'

export function serializeSource(source: Source): SerializedSource {
  return {
    id: source.id,
    name: source.name,
    isSystem: source.isSystem,
    sortOrder: source.sortOrder,
  }
}

export function serializeSources(sources: Source[]): SerializedSource[] {
  return sources.map(serializeSource)
}

export function serializeCategory(category: Category): SerializedCategory {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    isSystem: category.isSystem,
  }
}

export function serializeCategories(categories: Category[]): SerializedCategory[] {
  return categories.map(serializeCategory)
}
