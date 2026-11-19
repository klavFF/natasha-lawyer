import { materialsFor } from '../content'
import { pad, weeks } from '../model'

type OverviewProps = {
  onNotes: (id: string, materialId?: string) => void
  onQuiz: (id: string, materialId?: string) => void
}

export function Overview({ onNotes, onQuiz }: OverviewProps) {
  return (
    <div className="overview">
      <section className="cards" aria-label="Темы">
        {weeks.map((week) => {
          const materials = materialsFor(week.id)
          const title = week.title ?? materials[0]?.title ?? 'Тема не назначена'
          if (materials.length > 1) {
            return (
              <article key={week.id} className="card card-stack">
                <div className="card-open">
                  <span className="card-num">{pad(week.n)}</span>
                  <span className="card-title">{title}</span>
                </div>
                <ul className="card-materials">
                  {materials.map((material) => (
                    <li key={material.id} className="card-material">
                      <span>{material.title}</span>
                      <button type="button" onClick={() => onNotes(week.id, material.id)}>
                        Конспект
                      </button>
                      <button type="button" onClick={() => onQuiz(week.id, material.id)}>
                        Тест
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            )
          }
          return (
            <article key={week.id} className="card">
              <button type="button" className="card-open" onClick={() => onNotes(week.id)}>
                <span className="card-num">{pad(week.n)}</span>
                <span className="card-title">{title}</span>
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
