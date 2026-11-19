import { useEffect, useState } from 'react'
import { Quiz } from './components/Quiz'
import { Notes } from './components/Notes'
import { Overview } from './components/Overview'
import { Sidebar } from './components/Sidebar'
import { materialsFor } from './content'
import { weeks, type View } from './model'

type Route = {
  view: View
  weekId: string
  materialId: string
  quizScreen: 'question' | 'result'
}

function readRoute(): Route {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const week = weeks.find((item) => item.id === parts[0])
  const fallback = { view: 'overview' as const, weekId: week?.id ?? weeks[0].id, materialId: '', quizScreen: 'question' as const }
  if (!week) return fallback

  const materials = materialsFor(week.id)
  const known = new Set(materials.map((item) => item.id))
  const screen = (value: string | undefined) => (value === 'result' ? 'result' : 'question') as Route['quizScreen']

  if (known.has(parts[1]) && (parts[2] === 'notes' || parts[2] === 'quiz')) {
    return { view: parts[2], weekId: week.id, materialId: parts[1], quizScreen: screen(parts[3]) }
  }

  if (parts[1] === 'notes' || parts[1] === 'quiz') {
    return {
      view: parts[1],
      weekId: week.id,
      materialId: materials[0]?.id ?? '',
      quizScreen: screen(parts[2]),
    }
  }

  return fallback
}

function writeRoute(view: View, weekId: string, materialId?: string) {
  if (view === 'overview') {
    if (window.location.hash !== '#/' && window.location.hash !== '#' && window.location.hash !== '') {
      window.location.hash = '#/'
    }
    return
  }
  const id = materialId || materialsFor(weekId)[0]?.id
  const next = id ? `#/${weekId}/${id}/${view}` : `#/${weekId}/${view}`
  if (window.location.hash !== next) {
    window.location.hash = next
  }
}

export function App() {
  const [route, setRoute] = useState<Route>(readRoute)
  const week = weeks.find((item) => item.id === route.weekId) ?? weeks[0]

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const openOverview = () => writeRoute('overview', week.id)
  const openNotes = (id: string, materialId?: string) => writeRoute('notes', id, materialId)
  const openQuiz = (id: string, materialId?: string) => writeRoute('quiz', id, materialId)

  return (
    <div className={`shell view-${route.view}`}>
      <Sidebar
        view={route.view}
        weekId={week.id}
        materialId={route.materialId}
        onOverview={openOverview}
        onNotes={openNotes}
        onQuiz={openQuiz}
      />
      <main className="main">
        <div className="stage" key={`${route.view}-${week.id}-${route.materialId}`}>
          {route.view === 'overview' && <Overview onNotes={openNotes} onQuiz={openQuiz} />}
          {route.view === 'notes' && (
            <Notes
              week={week}
              materialId={route.materialId}
              onOverview={openOverview}
              onQuiz={() => openQuiz(week.id, route.materialId)}
            />
          )}
          {route.view === 'quiz' && (
            <Quiz
              week={week}
              materialId={route.materialId}
              initialScreen={route.quizScreen}
              onOverview={openOverview}
              onNotes={() => openNotes(week.id, route.materialId)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
