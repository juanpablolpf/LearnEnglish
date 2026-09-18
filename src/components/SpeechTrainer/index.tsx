import { useState, useEffect } from "react"
import type { Challenge } from "../../types"
import { speakWord } from "../../utils/speech"
import {
  listenToUserSpeech,
  isSpeechRecognitionSupported,
} from "../../utils/speechRecognition"
import { sounds } from "../../utils/soundEffects"
import styles from "./styles.module.css"

type Props = {
  words: Challenge[]
  themeTitle: string
  soundEnabled: boolean
  onWordMastered: (challenge: Challenge, xp: number) => void
  onBack: () => void
}

export function SpeechTrainer({
  words,
  themeTitle,
  soundEnabled,
  onWordMastered,
  onBack,
}: Props) {
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle")
  const [result, setResult] = useState<{
    transcript: string
    isMatch: boolean
    scorePercent: number
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const currentChallenge = words[index]
  const isSupported = isSpeechRecognitionSupported()

  useEffect(() => {
    setResult(null)
    setErrorMsg(null)
    setStatus("idle")
    if (currentChallenge) {
      speakWord(currentChallenge.word)
    }
  }, [currentChallenge])

  if (!currentChallenge) {
    return (
      <div className={styles.endContainer}>
        <span className={styles.endIcon}>🎙️</span>
        <h2 className={styles.endTitle}>Treino de Pronúncia Concluído!</h2>
        <p className={styles.endText}>
          Você treinou a fala de {words.length} palavras com o microfone e aprimorou seu sotaque!
        </p>
        <button type="button" className={styles.backBtnLarge} onClick={onBack}>
          Voltar ao Menu
        </button>
      </div>
    )
  }

  async function handleStartListening() {
    if (status !== "idle") return
    setErrorMsg(null)
    setResult(null)

    try {
      const res = await listenToUserSpeech(currentChallenge.word, (newStatus) => {
        setStatus(newStatus)
      })

      setResult(res)

      if (res.isMatch) {
        if (soundEnabled) sounds.playWin()
        onWordMastered(currentChallenge, 25)
      } else {
        if (soundEnabled) sounds.playWrong()
      }
    } catch (err: unknown) {
      setStatus("idle")
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erro ao acessar o microfone. Verifique as permissões do navegador."
      )
    }
  }

  function handleNext() {
    setIndex((prev) => prev + 1)
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Voltar
        </button>
        <div className={styles.metaRow}>
          <span className={styles.themeName}>{themeTitle}</span>
          <span className={styles.counter}>
            Palavra {index + 1} de {words.length}
          </span>
        </div>
      </div>

      {/* Main Practice Card */}
      <div className={styles.card}>
        <span className={styles.prompt}>
          1. Ouça a pronúncia nativa • 2. Clique no microfone e fale em voz alta
        </span>

        <div className={styles.wordBox}>
          <h2 className={styles.targetWord}>{currentChallenge.word}</h2>
          {currentChallenge.phonetic && (
            <span className={styles.phonetic}>{currentChallenge.phonetic}</span>
          )}
          <span className={styles.tip}>{currentChallenge.tip}</span>

          <button
            type="button"
            className={styles.listenBtn}
            onClick={() => speakWord(currentChallenge.word)}
          >
            🔊 Ouvir Pronúncia
          </button>
        </div>

        {/* Microphone Button */}
        <div className={styles.micSection}>
          {!isSupported ? (
            <div className={styles.unsupportedAlert}>
              ⚠️ O reconhecimento de voz não é suportado pelo seu navegador atual. Recomendamos usar o Google Chrome, Edge ou Safari para treinar com o microfone.
            </div>
          ) : (
            <div className={styles.micControls}>
              <button
                type="button"
                className={`${styles.micButton} ${
                  status === "listening"
                    ? styles.listening
                    : status === "processing"
                    ? styles.processing
                    : ""
                }`}
                onClick={handleStartListening}
                disabled={status !== "idle"}
              >
                <span className={styles.micIcon}>
                  {status === "listening" ? "🔴" : "🎙️"}
                </span>
                <span className={styles.micLabel}>
                  {status === "listening"
                    ? "Ouvindo você... Fale agora!"
                    : status === "processing"
                    ? "Analisando pronúncia..."
                    : "Pressione para Falar"}
                </span>
              </button>

              {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
            </div>
          )}
        </div>

        {/* Result & Feedback */}
        {result && (
          <div className={styles.resultBox}>
            <div className={styles.scoreRow}>
              <span className={styles.scoreTitle}>
                {result.isMatch ? "🎉 Excelente Pronúncia!" : "🔄 Vamos tentar de novo?"}
              </span>
              <span
                className={`${styles.scoreTag} ${
                  result.scorePercent >= 70 ? styles.scoreGood : styles.scoreNeedsWork
                }`}
              >
                {result.scorePercent}% de Precisão
              </span>
            </div>

            <div className={styles.transcriptBox}>
              <span className={styles.transcriptLabel}>O que foi detectado:</span>
              <span className={styles.transcriptText}>"{result.transcript}"</span>
            </div>

            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.retryBtn}
                onClick={handleStartListening}
              >
                Tentar Falar Novamente 🎙️
              </button>

              <button
                type="button"
                className={styles.nextBtn}
                onClick={handleNext}
              >
                Próxima Palavra →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
