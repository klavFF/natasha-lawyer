export type StudySection = {
  id: string
  title: string
  points: string[]
}

export type StudyQuestion = {
  id: string
  prompt: string
  choices: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  explain: string
  article: string
}

export type StudyChapter = {
  weekId: string
  title: string
  deck: string
  sourceFile: string
  sourceLabel: string
  sections: StudySection[]
  questions: StudyQuestion[]
}
