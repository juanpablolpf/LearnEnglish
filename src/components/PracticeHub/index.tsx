import type { StudyMode } from "../../types"
import styles from "./styles.module.css"

type Props = {
  totalWords: number
  difficultWordsCount: number
  onSelectMode: (mode: StudyMode) => void
}

export function PracticeHub({ totalWords, difficultWordsCount, onSelectMode }: Props) {
  const studyModes: {
    id: StudyMode
    title: string
    icon: string
    tag: string
    description: string
    color: string
  }[] = [
    {
      id: "hangman",
      title: "Jogo da Forca",
      icon: "🔤",
      tag: "Clássico & Vocabulário",
      description: "Adivinhe as letras da palavra com teclado físico ou virtual e dicas práticas.",
      color: "var(--primary)",
    },
    {
      id: "flashcards",
      title: "Flashcards 3D",
      icon: "📇",
      tag: "Memorização Ativa",
      description: "Vire os cartões para ver fonética, tradução e exemplos com pronúncia nativa.",
      color: "#10b981",
    },
    {
      id: "quiz",
      title: "Quiz Rápido",
      icon: "⚡",
      tag: "Desafio de 4 Opções",
      description: "Teste seu reflexo escolhendo a tradução correta entre 4 alternativas cronometradas.",
      color: "#f59e0b",
    },
    {
      id: "speech",
      title: "Treino de Voz & Pronúncia",
      icon: "🎙️",
      tag: "Fale no Microfone",
      description: "Ouça a pronúncia americana e fale pelo microfone para receber nota em tempo real!",
      color: "#ec4899",
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerBadge}>
          🎮 Central de Treinamento • {totalWords} Palavras Disponíveis
        </span>
        <h2 className={styles.title}>Escolha seu Modo de Estudo</h2>
        <p className={styles.subtitle}>
          Alterne entre diferentes métodos de aprendizagem para acelerar sua fluência no inglês.
        </p>
      </div>

      <div className={styles.modesGrid}>
        {studyModes.map((mode) => (
          <div
            key={mode.id}
            className={styles.modeCard}
            onClick={() => onSelectMode(mode.id)}
          >
            <div className={styles.cardTop}>
              <span className={styles.modeIcon}>{mode.icon}</span>
              <span className={styles.modeTag}>{mode.tag}</span>
            </div>

            <h3 className={styles.modeTitle}>{mode.title}</h3>
            <p className={styles.modeDesc}>{mode.description}</p>

            <button type="button" className={styles.startBtn}>
              Iniciar Treino →
            </button>
          </div>
        ))}
      </div>

      {difficultWordsCount > 0 && (
        <div className={styles.reviewBanner} onClick={() => onSelectMode("flashcards")}>
          <div className={styles.reviewIcon}>🎯</div>
          <div className={styles.reviewInfo}>
            <strong>Você tem {difficultWordsCount} palavras para revisar</strong>
            <p>Pratique as palavras que você errou recentemente para fixar no vocabulário.</p>
          </div>
          <button type="button" className={styles.reviewBtn}>
            Revisar Agora ⚡
          </button>
        </div>
      )}
    </div>
  )
}
