import { useState, useEffect, useMemo } from "react"
import type { Challenge } from "../../types"
import { speakWord } from "../../utils/speech"
import { sounds } from "../../utils/soundEffects"
import { ArrowLeft, ArrowRight, Check, Flame, Trophy, Volume2, X } from "lucide-react"
import styles from "./styles.module.css"

type Props = {
  words: Challenge[]
  allWordsPool: Challenge[]
  themeTitle: string
  soundEnabled: boolean
  onWordLearned: (challenge: Challenge, xp: number) => void
  onWordFailed: (challenge: Challenge) => void
  onBack: () => void
}

export function Quiz({
  words,
  allWordsPool,
  themeTitle,
  soundEnabled,
  onWordLearned,
  onWordFailed,
  onBack,
}: Props) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const currentChallenge = words[index]

  // Generate 4 randomized options (1 correct tip + 3 wrong tips from pool)
  const options = useMemo(() => {
    if (!currentChallenge) return []

    const correctTip = currentChallenge.tip
    const otherTips = allWordsPool
      .filter((w) => w.word !== currentChallenge.word)
      .map((w) => w.tip)
      .filter((tip, idx, arr) => arr.indexOf(tip) === idx && tip !== correctTip)

    // Shuffle and pick 3 wrong options
    const shuffledOthers = [...otherTips].sort(() => Math.random() - 0.5).slice(0, 3)
    const combined = [correctTip, ...shuffledOthers].sort(() => Math.random() - 0.5)
    return combined
  }, [currentChallenge, allWordsPool])

  useEffect(() => {
    setSelectedOption(null)
    setIsAnswered(false)
    if (currentChallenge) {
      speakWord(currentChallenge.word)
    }
  }, [currentChallenge])

  if (!currentChallenge) {
    return (
      <div className={styles.endContainer}>
        <span className={styles.endIcon} aria-hidden="true">
          <Trophy size={22} strokeWidth={1.75} />
        </span>
        <h2 className={`title-display ${styles.endTitle}`}>Quiz finalizado</h2>
        <div className={styles.endScoreBox}>
          <span className={styles.scoreVal}>{score} / {words.length}</span>
          <span className={styles.scoreLbl}>Acertos</span>
        </div>
        <p className={styles.endText}>
          Você praticou o vocabulário e ganhou pontos para o ranking.
        </p>
        <button type="button" className={styles.backBtnLarge} onClick={onBack}>
          Voltar ao menu
        </button>
      </div>
    )
  }

  function handleSelectOption(option: string) {
    if (isAnswered) return

    setSelectedOption(option)
    setIsAnswered(true)

    const isCorrect = option === currentChallenge.tip

    if (isCorrect) {
      if (soundEnabled) sounds.playCorrect()
      setScore((prev) => prev + 1)
      setStreak((prev) => prev + 1)
      onWordLearned(currentChallenge, 20)
    } else {
      if (soundEnabled) sounds.playWrong()
      setStreak(0)
      onWordFailed(currentChallenge)
    }
  }

  function handleNextQuestion() {
    setIndex((prev) => prev + 1)
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={1.75} aria-hidden="true" />
          Voltar
        </button>
        <div className={styles.metaRow}>
          <span className={styles.themeName}>{themeTitle}</span>
          <span className={styles.streakPill} title="Acertos seguidos">
            <Flame size={14} strokeWidth={1.75} aria-hidden="true" />
            {streak}
          </span>
          <span className={styles.counter}>
            Questão {index + 1} de {words.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className={styles.questionCard}>
        <span className={styles.questionPrompt}>Qual é o significado correto da palavra?</span>

        <div className={styles.wordBox}>
          <h2 className={styles.targetWord}>{currentChallenge.word}</h2>
          {currentChallenge.phonetic && (
            <span className={styles.phonetic}>{currentChallenge.phonetic}</span>
          )}
          <button
            type="button"
            className={styles.listenBtn}
            onClick={() => speakWord(currentChallenge.word)}
            title="Ouvir novamente"
          >
            <Volume2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Ouvir áudio
          </button>
        </div>

        {/* Options Grid */}
        <div className={styles.optionsGrid}>
          {options.map((option, optIdx) => {
            let stateClass = ""
            if (isAnswered) {
              if (option === currentChallenge.tip) {
                stateClass = styles.correctOpt
              } else if (option === selectedOption) {
                stateClass = styles.wrongOpt
              } else {
                stateClass = styles.dimmedOpt
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                className={`${styles.optionBtn} ${stateClass}`}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
              >
                <span className={styles.optLetter}>
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className={styles.optText}>{option}</span>
              </button>
            )
          })}
        </div>

        {/* Exemplo / Feedback após responder */}
        {isAnswered && (
          <div className={styles.feedbackSection}>
            {selectedOption === currentChallenge.tip ? (
              <div className={styles.correctFeedback}>
                <Check size={16} strokeWidth={2} aria-hidden="true" />
                <span>Resposta certa (+20 XP)</span>
              </div>
            ) : (
              <div className={styles.wrongFeedback}>
                <X size={16} strokeWidth={2} aria-hidden="true" />
                <span>Resposta errada. A certa era <strong>{currentChallenge.tip}</strong></span>
              </div>
            )}

            {currentChallenge.example && (
              <div className={styles.exampleSentence}>
                <p className={styles.exampleEn}>"{currentChallenge.example}"</p>
                {currentChallenge.examplePt && <p className={styles.examplePt}>"{currentChallenge.examplePt}"</p>}
              </div>
            )}

            <button
              type="button"
              className={styles.nextBtn}
              onClick={handleNextQuestion}
              autoFocus
            >
              Próxima questão
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
