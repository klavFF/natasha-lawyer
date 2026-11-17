import { useState } from 'react'
import { chapterFor } from '../content'
import { pad, type Week } from '../model'
import { LiveQuiz } from './LiveQuiz'
import { ModeSwitch } from './ModeSwitch'

type QuizProps = {
  week: Week
  initialScreen: 'question' | 'result'
  onOverview: () => void
  onNotes: () => void
}

export function Quiz(props: QuizProps) {
  const chapter = chapterFor(props.week.id)
  if (chapter) {
    return (
      <LiveQuiz
        week={props.week}
        chapter={chapter}
        onOverview={props.onOverview}
        onNotes={props.onNotes}
      />
    )
  }
  return <MockQuiz {...props} />
}

const letters = ['А', 'Б', 'В', 'Г']
const widths = ['78%', '52%', '66%', '44%']

function MockQuiz({ week, initialScreen, onOverview, onNotes }: QuizProps) {
  const [screen, setScreen] = useState<'question' | 'result'>(initialScreen)
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="quiz">
      <header className="quiz-top">
        <button type="button" className="back dark" onClick={onOverview}>
          Обзор
        </button>
        <span className="quiz-kicker">Неделя {pad(week.n)} · тема не назначена</span>
        <ModeSwitch mode="quiz" tone="dark" onNotes={onNotes} onQuiz={() => undefined} />
      </header>

      <div className="quiz-frame">
        <div className="specimen-bar">
          <span>Макет экрана</span>
          <div className="switch switch-dark" role="tablist" aria-label="Экран макета">
            <button
              type="button"
              role="tab"
              aria-selected={screen === 'question'}
              className={screen === 'question' ? 'is-on' : ''}
              onClick={() => setScreen('question')}
            >
              Вопрос
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={screen === 'result'}
              className={screen === 'result' ? 'is-on' : ''}
              onClick={() => setScreen('result')}
            >
              Итог
            </button>
          </div>
        </div>

        {screen === 'question' ? (
          <section className="question-card" aria-label="Макет вопроса">
            <div className="ribbon">Вопросов нет</div>
            <p className="q-progress">
              <span>Вопрос</span>
              <b>— / —</b>
            </p>
            <h1>Формулировка</h1>
            <p className="q-lead">
              Текст вопроса, варианты и пояснение со ссылкой на конспект. Оболочка уже на месте,
              набор вопросов появится вместе с темой.
            </p>

            <div className="options" role="listbox" aria-label="Варианты ответа">
              {letters.map((letter, index) => (
                <button
                  key={letter}
                  type="button"
                  role="option"
                  aria-selected={selected === index}
                  className={`option ${selected === index ? 'is-selected' : ''}`}
                  onClick={() => setSelected(index)}
                >
                  <span className="letter">{letter}</span>
                  <span className="blank" style={{ maxWidth: widths[index] }} />
                </button>
              ))}
            </div>

            <div className="explain">
              <span>Пояснение</span>
              <p>После проверки здесь будет короткий разбор и ссылка на фрагмент конспекта.</p>
            </div>

            <div className="q-actions">
              <button type="button" className="btn" disabled>
                Проверить
              </button>
              <p>Проверка включится, когда у недели появятся вопросы.</p>
            </div>
          </section>
        ) : (
          <section className="result-card" aria-label="Макет итога">
            <div className="ribbon">Вопросов нет</div>
            <div className="result-layout">
              <div className="ring" aria-hidden="true">
                <span>—</span>
              </div>
              <div>
                <p className="eyebrow ink">Итог тренировки</p>
                <h1>Результат появится после попытки</h1>
                <p className="q-lead ink-lead">
                  Счёт, список ошибок и повтор только по ним. Сейчас показывать нечего: вопросов по
                  неделе ещё нет.
                </p>
              </div>
            </div>
            <dl className="stats">
              <div>
                <dt>Верно</dt>
                <dd>—</dd>
              </div>
              <div>
                <dt>Ошибки</dt>
                <dd>—</dd>
              </div>
              <div>
                <dt>Всего</dt>
                <dd>—</dd>
              </div>
            </dl>
            <div className="miss">
              <span>Разбор ошибок</span>
              <p>Неверные ответы соберутся списком, каждый со ссылкой на место в конспекте.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
