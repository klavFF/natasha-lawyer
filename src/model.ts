export type View = 'overview' | 'notes' | 'quiz'

export type Week = {
  id: string
  n: number
  title?: string
}

export type NoteSection = {
  id: string
  title: string
  hint: string
}

export const weeks: Week[] = [
  { id: 'week-01', n: 1, title: 'Купля-продажа' },
  { id: 'week-02', n: 2, title: 'Аренда' },
  { id: 'week-03', n: 3 },
  { id: 'week-04', n: 4 },
  { id: 'week-05', n: 5 },
  { id: 'week-06', n: 6 },
]

export const noteSections: NoteSection[] = [
  {
    id: 'definitions',
    title: 'Определения',
    hint: 'Короткие формулировки, к которым проверка возвращается чаще всего.',
  },
  {
    id: 'rules',
    title: 'Основные положения',
    hint: 'Нормы в том порядке, в каком их удобно держать перед тестом.',
  },
  {
    id: 'exceptions',
    title: 'Исключения и оговорки',
    hint: 'Места, где общее правило не срабатывает.',
  },
  {
    id: 'focus',
    title: 'На что смотреть в тесте',
    hint: 'Акценты для тренировки. Сами вопросы живут отдельно.',
  },
]

export function pad(n: number) {
  return String(n).padStart(2, '0')
}
