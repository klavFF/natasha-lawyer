import { chapterFor } from '../content'
import { pad, weeks } from '../model'

type OverviewProps = {
  onNotes: (id: string) => void
  onQuiz: (id: string) => void
}

export function Overview({ onNotes, onQuiz }: OverviewProps) {
  return (
    <div className="overview">
      <section className="cards" aria-label="Темы">
        {weeks.map((week) => {
          const chapter = chapterFor(week.id)
          return (
          <article key={week.id} className="card">
            <button type="button" className="card-open" onClick={() => onNotes(week.id)}>
              <span className="card-num">{pad(week.n)}</span>
              <span className="card-title">{chapter?.title ?? 'Тема не назначена'}</span>
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
      <div className="mascot">
        <img className="mascot-say" src={`${import.meta.env.BASE_URL}oga-say.png`} alt="У тебя всё получится" />
        <img className="mascot-dog" src={`${import.meta.env.BASE_URL}oga-study.png`} alt="" />
      </div>
    </div>
  )
}
