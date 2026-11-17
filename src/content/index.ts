import { chapter01 } from './chapter01'
import type { StudyChapter } from './types'

const chapters: StudyChapter[] = [chapter01]

export function chapterFor(weekId: string) {
  return chapters.find((item) => item.weekId === weekId)
}

export function readyChapterCount() {
  return chapters.length
}
