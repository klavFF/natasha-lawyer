import { chapterFor } from '../content'
import { pad, weeks } from '../model'

type OverviewProps = {
  onNotes: (id: string) => void
  onQuiz: (id: string) => void
}

export function Overview({ onNotes, onQuiz }: OverviewProps) {
  return (
    <div className="overview">
      <section className="cards" aria-label="Недели программы">
        {weeks.map((week) => {
          const chapter = chapterFor(week.id)
          return (
          <article key={week.id} className="card">
            <button type="button" className="card-open" onClick={() => onNotes(week.id)}>
              <span className="card-num">{pad(week.n)}</span>
              <span className="card-title">{chapter?.title ?? 'Тема не назначена'}</span>
              <span className="card-status">{chapter ? 'Конспект готов' : 'Ожидает материалы'}</span>
            </button>
            <div className="card-actions">
              <button type="button" onClick={() => onNotes(week.id)}>
                Конспект
              </button>
              <button type="button" onClick={() => onQuiz(week.id)}>
                Тест
              </button>
            </div>
          </article>
          )
        })}
      </section>

      <footer className="colophon">
        <span>
          <i>01</i> Конспект
        </span>
        <span>
          <i>02</i> Тренировка
        </span>
        <span>
          <i>03</i> Проверка
        </span>
      </footer>
    </div>
  )
}
