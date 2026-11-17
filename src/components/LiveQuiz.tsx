import { useState } from 'react'
import type { StudyChapter, StudyQuestion } from '../content/types'
import { pad, type Week } from '../model'
import { ModeSwitch } from './ModeSwitch'

type LiveQuizProps = {
  week: Week
  chapter: StudyChapter
  onOverview: () => void
  onNotes: () => void
}

type Attempt = {
  id: string
  picked: number
  correct: boolean
}

const letters = ['А', 'Б', 'В', 'Г']

export function LiveQuiz({ week, chapter, onOverview, onNotes }: LiveQuizProps) {
  const [queue, setQueue] = useState<StudyQuestion[]>(chapter.questions)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [log, setLog] = useState<Attempt[]>([])
  const [done, setDone] = useState(false)

  const question = queue[step]
  const correctCount = log.filter((item) => item.correct).length
  const wrong = log.filter((item) => !item.correct)

  function restart(onlyWrong: boolean) {
    const wrongIds = new Set(wrong.map((item) => item.id))
    const nextQueue = onlyWrong
      ? chapter.questions.filter((item) => wrongIds.has(item.id))
      : chapter.questions
    setQueue(nextQueue)
    setStep(0)
    setPicked(null)
    setRevealed(false)
    setLog([])
    setDone(false)
  }

  function reveal() {
    if (picked === null || !question) return
    setRevealed(true)
  }

  function next() {
    if (!question || picked === null) return
    const attempt = { id: question.id, picked, correct: picked === question.answer }
    const nextLog = [...log, attempt]
    if (step + 1 >= queue.length) {
      setLog(nextLog)
      setDone(true)
      return
    }
    setLog(nextLog)
    setStep(step + 1)
    setPicked(null)
    setRevealed(false)
  }

  return (
    <div className="quiz">
      <header className="quiz-top">
        <button type="button" className="back dark" onClick={onOverview}>
          Обзор
        </button>
        <span className="quiz-kicker">
          Неделя {pad(week.n)} · {chapter.title}
        </span>
        <ModeSwitch mode="quiz" tone="dark" onNotes={onNotes} onQuiz={() => undefined} />
      </header>

      <div className="quiz-frame">
        {done ? (
          <Result
            total={log.length}
            correctCount={correctCount}
            wrong={wrong}
            questions={chapter.questions}
            onRetry={() => restart(false)}
            onWrong={() => restart(true)}
          />
        ) : question ? (
          <section className="question-card" aria-label="Вопрос">
            <p className="q-progress">
              <span>Вопрос</span>
              <b>
                {pad(step + 1)} / {pad(queue.length)}
              </b>
            </p>
            <p className="article-chip">{question.article}</p>
            <h1>{question.prompt}</h1>

            <div className="options" role="listbox" aria-label="Варианты ответа">
              {question.choices.map((choice, index) => {
                const isPicked = picked === index
                const isAnswer = index === question.answer
                const className = [
                  'option',
                  !revealed && isPicked ? 'is-selected' : '',
                  revealed && isAnswer ? 'is-correct' : '',
                  revealed && isPicked && !isAnswer ? 'is-wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={choice}
                    type="button"
                    role="option"
                    aria-selected={isPicked}
                    className={className}
                    disabled={revealed}
                    onClick={() => setPicked(index)}
                  >
                    <span className="letter">{letters[index]}</span>
                    <span className="choice">{choice}</span>
                  </button>
                )
              })}
            </div>

            {revealed ? (
              <div className="explain">
                <span>{picked === question.answer ? 'Верно' : 'Неверно'} · {question.article}</span>
                <p>{question.explain}</p>
              </div>
            ) : null}

            <div className="q-actions">
              {revealed ? (
                <button type="button" className="btn" onClick={next}>
                  {step + 1 >= queue.length ? 'К итогу' : 'Дальше'}
                </button>
              ) : (
                <button type="button" className="btn" disabled={picked === null} onClick={reveal}>
                  Проверить
                </button>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function Result({
  total,
  correctCount,
  wrong,
  questions,
  onRetry,
  onWrong,
}: {
  total: number
  correctCount: number
  wrong: Attempt[]
  questions: StudyQuestion[]
  onRetry: () => void
  onWrong: () => void
}) {
  const ratio = total === 0 ? 0 : correctCount / total
  const degrees = Math.round(ratio * 360)

  return (
    <section className="result-card" aria-label="Итог тренировки">
      <div className="result-layout">
        <div
          className="ring"
          aria-hidden="true"
          style={{
            background: `conic-gradient(#8d6a3d ${degrees}deg, rgba(141, 109, 62, 0.18) 0deg)`,
          }}
        >
          <span>
            {correctCount}
            <small>/{total}</small>
          </span>
        </div>
        <div>
          <p className="eyebrow ink">Итог тренировки</p>
          <h1>{correctCount === total ? 'Все ответы верные' : 'Есть что повторить'}</h1>
          <p className="q-lead ink-lead">
            {wrong.length === 0
              ? 'Можно пройти тест еще раз с начала.'
              : 'Ниже вопросы с неверным ответом и отсылка к статье.'}
          </p>
        </div>
      </div>
      <dl className="stats">
        <div>
          <dt>Верно</dt>
          <dd>{correctCount}</dd>
        </div>
        <div>
          <dt>Ошибки</dt>
          <dd>{wrong.length}</dd>
        </div>
        <div>
          <dt>Всего</dt>
          <dd>{total}</dd>
        </div>
      </dl>
      {wrong.length > 0 ? (
        <div className="miss">
          <span>Разбор ошибок</span>
          <ol className="wrong-list">
            {wrong.map((item) => {
              const question = questions.find((entry) => entry.id === item.id)
              if (!question) return null
              return (
                <li key={item.id}>
                  <b>{question.article}</b>
                  <p>{question.prompt}</p>
                  <p className="wrong-line">Ваш ответ: {question.choices[item.picked]}</p>
                  <p>{question.explain}</p>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}
      <div className="q-actions">
        <button type="button" className="btn" onClick={onRetry}>
          Сначала
        </button>
        {wrong.length > 0 ? (
          <button type="button" className="btn ghost" onClick={onWrong}>
            Только ошибки
          </button>
        ) : null}
      </div>
    </section>
  )
}
