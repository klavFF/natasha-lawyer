import { materialsFor } from '../content'
import { pad, weeks, type View } from '../model'

type SidebarProps = {
  view: View
  weekId: string
  materialId: string
  onOverview: () => void
  onNotes: (id: string, materialId?: string) => void
  onQuiz: (id: string, materialId?: string) => void
}

export function Sidebar({ view, weekId, materialId, onOverview, onNotes, onQuiz }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="side-nav" aria-label="Программа">
        <button
          type="button"
          className={`overview-link ${view === 'overview' ? 'is-active' : ''}`}
          aria-current={view === 'overview' ? 'page' : undefined}
          onClick={onOverview}
        >
          <span>Главная</span>
        </button>

        <p className="side-label">Темы</p>
        <ul className="week-list">
          {weeks.map((week) => {
            const materials = materialsFor(week.id)
            const open = week.id === weekId && view !== 'overview'
            if (materials.length > 1) {
              return (
                <li key={week.id} className="week-group">
                  <div className="week-hit">
                    <span className="week-num">{pad(week.n)}</span>
                    <span className="week-title">{week.title ?? materials[0].title}</span>
                  </div>
                  <ul className="week-materials">
                    {materials.map((material) => {
                      const current = open && material.id === materialId
                      return (
                        <li key={material.id} className={current ? 'is-active' : ''}>
                          <button type="button" className="week-hit" onClick={() => onNotes(week.id, material.id)}>
                            <span className="week-title">{material.title}</span>
                          </button>
                          <button
                            type="button"
                            className={`week-quiz ${current && view === 'quiz' ? 'is-on' : ''}`}
                            onClick={() => onQuiz(week.id, material.id)}
                          >
                            Тест
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            }
            return (
              <li key={week.id} className={open ? 'is-active' : ''}>
                <button type="button" className="week-hit" onClick={() => onNotes(week.id)}>
                  <span className="week-num">{pad(week.n)}</span>
                  <span className="week-title">{week.title ?? 'Тема не назначена'}</span>
                </button>
                <button
                  type="button"
                  className={`week-quiz ${view === 'quiz' && open ? 'is-on' : ''}`}
                  onClick={() => onQuiz(week.id)}
                >
                  Тест
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
