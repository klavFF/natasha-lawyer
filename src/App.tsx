import { useEffect, useState } from 'react'
import { Quiz } from './components/Quiz'
import { Notes } from './components/Notes'
import { Overview } from './components/Overview'
import { Sidebar } from './components/Sidebar'
import { weeks, type View } from './model'

type Route = {
  view: View
  weekId: string
  quizScreen: 'question' | 'result'
}

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')
  const [weekId, mode, extra] = hash.split('/')
  const week = weeks.find((item) => item.id === weekId)
  const quizScreen = extra === 'result' ? 'result' : 'question'

  if (week && (mode === 'notes' || mode === 'quiz')) {
    return { view: mode, weekId: week.id, quizScreen }
  }

  return { view: 'overview', weekId: week?.id ?? weeks[0].id, quizScreen }
}

function writeRoute(view: View, weekId: string) {
  const next = view === 'overview' ? '#/' : `#/${weekId}/${view}`
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
  const openNotes = (id: string) => writeRoute('notes', id)
  const openQuiz = (id: string) => writeRoute('quiz', id)

  return (
    <div className={`shell view-${route.view}`}>
      <Sidebar
        view={route.view}
        weekId={week.id}
        onOverview={openOverview}
        onNotes={openNotes}
        onQuiz={openQuiz}
      />
      <main className="main">
        <div className="stage" key={`${route.view}-${week.id}`}>
          {route.view === 'overview' && <Overview onNotes={openNotes} onQuiz={openQuiz} />}
          {route.view === 'notes' && (
            <Notes week={week} onOverview={openOverview} onQuiz={() => openQuiz(week.id)} />
          )}
          {route.view === 'quiz' && (
            <Quiz
              week={week}
              initialScreen={route.quizScreen}
              onOverview={openOverview}
              onNotes={() => openNotes(week.id)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
