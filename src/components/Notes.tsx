import { useEffect, useRef, useState, type ReactNode } from 'react'
import { chapterFor } from '../content'
import { noteSections, pad, type Week } from '../model'
import { ModeSwitch } from './ModeSwitch'

type NotesProps = {
  week: Week
  onOverview: () => void
  onQuiz: () => void
}

const stackedQuery = '(max-width: 1100px)'
const phoneQuery = '(max-width: 860px)'
const articlePattern =
  /стать(?:я|и|е|ю|ёй|ей)\s+\d+(?:[.,]\d+)?(?:\s*[–—-]\s*\d+(?:[.,]\d+)?)?/gi

function scrollOffset() {
  return Math.max(
    window.scrollY || 0,
    document.scrollingElement?.scrollTop || 0,
    document.body.scrollTop || 0,
    document.documentElement.scrollTop || 0,
  )
}

function pageTop(node: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = node
  while (current) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return top
}

function withArticles(text: string) {
  const pattern = new RegExp(articlePattern.source, articlePattern.flags)
  const nodes: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0
    if (start > last) nodes.push(text.slice(last, start))
    nodes.push(
      <span className="article-no" key={start}>
        {match[0]}
      </span>,
    )
    last = start + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function Notes({ week, onOverview, onQuiz }: NotesProps) {
  const chapter = chapterFor(week.id)
  const sections = chapter?.sections ?? noteSections.map((section) => ({
    id: section.id,
    title: section.title,
    points: [] as string[],
    hint: section.hint,
  }))
  const [stacked, setStacked] = useState(() => window.matchMedia(stackedQuery).matches)
  const [tocOpen, setTocOpen] = useState(false)
  const [barAway, setBarAway] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia(stackedQuery)
    const sync = () => setStacked(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const phone = window.matchMedia(phoneQuery)
    let last = scrollOffset()
    let frame = 0
    let away = false

    const hide = (next: boolean) => {
      if (away === next) return
      away = next
      setBarAway(next)
      if (next) setTocOpen(false)
    }

    const onScroll = (event: Event) => {
      const target = event.target
      if (
        target instanceof Node &&
        stickyRef.current?.contains(target) &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        return
      }
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const y = scrollOffset()
        const delta = y - last
        last = y
        if (!phone.matches) {
          hide(false)
          return
        }
        const sheet = stickyRef.current?.closest('.sheet')
        const origin = sheet instanceof HTMLElement ? pageTop(sheet) : 0
        if (y <= origin + 8) hide(false)
        else if (delta > 8) hide(true)
        else if (delta < -8) hide(false)
      })
    }

    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const jumpTo = (id: string) => {
    if (stacked) setTocOpen(false)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      })
    })
  }

  return (
    <article className="sheet">
      <div ref={stickyRef} className={`sheet-sticky${barAway ? ' is-away' : ''}`}>
      <header className="sheet-head">
        <button type="button" className="back" onClick={onOverview}>
          Главная
        </button>
        <ModeSwitch mode="notes" tone="paper" onNotes={() => undefined} onQuiz={onQuiz} />
      </header>

      <nav
        className={`toc${stacked && !tocOpen ? ' is-collapsed' : ''}`}
        aria-label="Содержание конспекта"
      >
        {stacked ? (
          <button
            type="button"
            className="toc-toggle"
            aria-expanded={tocOpen}
            onClick={() => setTocOpen((open) => !open)}
          >
            Содержание
            <span aria-hidden="true">{tocOpen ? '–' : '+'}</span>
          </button>
        ) : (
          <p className="side-label ink">Содержание</p>
        )}
        {(!stacked || tocOpen) && (
          <ol>
            {sections.map((section, index) => (
              <li key={section.id}>
                <button type="button" className="toc-link" onClick={() => jumpTo(section.id)}>
                  <span>{pad(index + 1)}</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ol>
        )}
      </nav>
      </div>

      <div className="article">
        <h1>{chapter?.title ?? 'Тема не назначена'}</h1>
        <p className="deck ink-deck">
          {chapter?.deck ??
            'Структура конспекта уже размечена. Текст, определения и ссылки на документы появятся здесь после того, как файлы этой темы будут добавлены.'}
        </p>

        {chapter
          ? chapter.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="block">
                <div className="block-index">{pad(index + 1)}</div>
                <div>
                  <h2>{section.title}</h2>
                  <ul>
                    {section.points.map((point, pointIndex) => (
                      <li key={`${section.id}-${pointIndex}`}>{withArticles(point)}</li>
                    ))}
                  </ul>
                </div>
              </section>
            ))
          : noteSections.map((section, index) => (
              <section key={section.id} id={section.id} className="block">
                <div className="block-index">{pad(index + 1)}</div>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.hint}</p>
                  <div className="empty-slot">Материал не загружен</div>
                </div>
              </section>
            ))}
      </div>

      <aside className="sources">
        <p className="side-label ink">Источники</p>
        <div className="source-count">
          <strong>{chapter ? 1 : 0}</strong>
          <span>{chapter ? 'файл' : 'файлов'}</span>
        </div>
        {chapter ? (
          <>
            <p className="source-file">{chapter.sourceFile}</p>
            <p className="source-note">{chapter.sourceLabel}</p>
          </>
        ) : (
          <p className="source-note">
            Кодексы и остальные документы темы будут перечислены здесь. У блоков конспекта появится
            отсылка к файлу.
          </p>
        )}
      </aside>
    </article>
  )
}

