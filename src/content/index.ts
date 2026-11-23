import { buyerRisks } from './buyerRisks'
import { chapter01 } from './chapter01'
import { lease } from './lease'
import { leaseBasics } from './leaseBasics'
import { plenumLease } from './plenumLease'
import { supplierRisks } from './supplierRisks'
import type { StudyChapter } from './types'

const chapters: StudyChapter[] = [chapter01, buyerRisks, supplierRisks, lease, plenumLease, leaseBasics]

export function materialsFor(weekId: string) {
  return chapters.filter((item) => item.weekId === weekId)
}

export function materialFor(weekId: string, materialId?: string) {
  const list = materialsFor(weekId)
  if (!materialId) return list[0]
  return list.find((item) => item.id === materialId)
}

export function chapterFor(weekId: string) {
  return materialsFor(weekId)[0]
}
