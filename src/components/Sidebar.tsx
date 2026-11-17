import { chapterFor, readyChapterCount } from '../content'
import { pad, weeks, type View } from '../model'

type SidebarProps = {
  view: View
  weekId: string
  onOverview: () => void
  onNotes: (id: string) => void
  onQuiz: (id: string) => void
}

export function Sidebar({ view, weekId, onOverview, onNotes, onQuiz }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="side-nav" aria-label="Программа">
        <button
          type="button"
          className={`overview-link ${view === 'overview' ? 'is-active' : ''}`}
          aria-current={view === 'overview' ? 'page' : undefined}
          onClick={onOverview}
        >
          <span>Обзор</span>
          <span className="overview-count">6 недель</span>
        </button>

        <p className="side-label">Недели</p>
        <ul className="week-list">
          {weeks.map((week) => {
            const active = week.id === weekId && view !== 'overview'
            return (
              <li key={week.id} className={active ? 'is-active' : ''}>
                <button type="button" className="week-hit" onClick={() => onNotes(week.id)}>
                  <span className="week-num">{pad(week.n)}</span>
                  <span className="week-title">{chapterFor(week.id)?.title ?? 'Тема не назначена'}</span>
                </button>
                <button
                  type="button"
                  className={`week-quiz ${view === 'quiz' && week.id === weekId ? 'is-on' : ''}`}
                  onClick={() => onQuiz(week.id)}
                >
                  Тест
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="side-spine" aria-hidden="true">
        <span>01</span>
        <i />
        <span>06</span>
      </div>

      <footer className="side-foot">
        <span className="side-foot-num">{readyChapterCount()}</span>
        <span>
          {readyChapterCount() === 1 ? 'тема с конспектом' : 'тем с конспектом'}
          <small>кодексы Беларуси — по неделям</small>
        </span>
      </footer>
    </aside>
  )
}
