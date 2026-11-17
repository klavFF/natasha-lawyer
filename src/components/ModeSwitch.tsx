type ModeSwitchProps = {
  mode: 'notes' | 'quiz'
  tone: 'paper' | 'dark'
  onNotes: () => void
  onQuiz: () => void
}

export function ModeSwitch({ mode, tone, onNotes, onQuiz }: ModeSwitchProps) {
  return (
    <div className={`switch switch-${tone}`} role="tablist" aria-label="Режим недели">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'notes'}
        className={mode === 'notes' ? 'is-on' : ''}
        onClick={onNotes}
      >
        Конспект
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'quiz'}
        className={mode === 'quiz' ? 'is-on' : ''}
        onClick={onQuiz}
      >
        Тест
      </button>
    </div>
  )
}
