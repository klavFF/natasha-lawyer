import { chapterFor } from '../content'
import { noteSections, pad, type Week } from '../model'
import { ModeSwitch } from './ModeSwitch'

type NotesProps = {
  week: Week
  onOverview: () => void
  onQuiz: () => void
}

export function Notes({ week, onOverview, onQuiz }: NotesProps) {
  const chapter = chapterFor(week.id)
  const sections = chapter?.sections ?? noteSections.map((section) => ({
    id: section.id,
    title: section.title,
    points: [] as string[],
    hint: section.hint,
  }))

  return (
    <article className="sheet">
      <header className="sheet-head">
        <button type="button" className="back" onClick={onOverview}>
          Обзор
        </button>
        <span className="sheet-center">Конспект · неделя {pad(week.n)}</span>
        <ModeSwitch mode="notes" tone="paper" onNotes={() => undefined} onQuiz={onQuiz} />
      </header>

      <nav className="toc" aria-label="Содержание конспекта">
        <p className="side-label ink">Содержание</p>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>
                <span>{pad(index + 1)}</span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="article">
        <p className="eyebrow ink">Неделя {pad(week.n)} из 06</p>
        <h1>{chapter?.title ?? 'Тема не назначена'}</h1>
        <p className="deck ink-deck">
          {chapter?.deck ??
            'Структура конспекта уже размечена. Текст, определения и ссылки на документы появятся здесь после того, как файлы этой недели будут добавлены.'}
        </p>

        {chapter
          ? chapter.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="block">
                <div className="block-index">{pad(index + 1)}</div>
                <div>
                  <h2>{section.title}</h2>
                  <ul>
                    {section.points.map((point, pointIndex) => (
                      <li key={`${section.id}-${pointIndex}`}>{point}</li>
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
            Кодексы и остальные документы недели будут перечислены здесь. У блоков конспекта появится
            отсылка к файлу.
          </p>
        )}
      </aside>
    </article>
  )
}

