import { ArrowRight, Layers, Mic, Target, Type, Zap, type LucideIcon } from "lucide-react"
import type { StudyMode } from "../../types"
import styles from "./styles.module.css"

type Props = {
  totalWords: number
  difficultWordsCount: number
  onSelectMode: (mode: StudyMode) => void
}

const STUDY_MODES: {
  id: StudyMode
  title: string
  icon: LucideIcon
  tag: string
  description: string
}[] = [
  {
    id: "hangman",
    title: "Jogo da forca",
    icon: Type,
    tag: "Vocabulário",
    description: "Adivinhe as letras da palavra com o teclado físico ou o virtual, com dicas.",
  },
  {
    id: "flashcards",
    title: "Flashcards",
    icon: Layers,
    tag: "Memorização",
    description: "Vire os cartões para ver fonética, tradução e exemplos com pronúncia nativa.",
  },
  {
    id: "quiz",
    title: "Quiz rápido",
    icon: Zap,
    tag: "4 opções",
    description: "Escolha a tradução certa entre 4 alternativas, contra o relógio.",
  },
  {
    id: "speech",
    title: "Treino de pronúncia",
    icon: Mic,
    tag: "Microfone",
    description: "Ouça a pronúncia americana e fale no microfone para receber uma nota na hora.",
  },
]

export function PracticeHub({ totalWords, difficultWordsCount, onSelectMode }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.spotlight} aria-hidden="true" />
        <h2 className={`title-display ${styles.title}`}>Escolha como estudar</h2>
        <p className={styles.subtitle}>
          {totalWords} palavras disponíveis. Alterne entre os modos para fixar o vocabulário mais rápido.
        </p>
      </div>

      <div className={styles.modesGrid}>
        {STUDY_MODES.map(({ id, title, icon: Icon, tag, description }) => (
          <button
            key={id}
            type="button"
            className={styles.modeCard}
            onClick={() => onSelectMode(id)}
          >
            <div className={styles.cardTop}>
              <span className={styles.modeIcon} aria-hidden="true">
                <Icon size={19} strokeWidth={1.6} />
              </span>
              <span className={styles.modeTag}>{tag}</span>
            </div>

            <h3 className={styles.modeTitle}>{title}</h3>
            <p className={styles.modeDesc}>{description}</p>

            <span className={styles.startBtn}>
              Começar <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      {difficultWordsCount > 0 && (
        <button
          type="button"
          className={styles.reviewBanner}
          onClick={() => onSelectMode("flashcards")}
        >
          <span className={styles.reviewIcon} aria-hidden="true">
            <Target size={19} strokeWidth={1.6} />
          </span>
          <span className={styles.reviewInfo}>
            <strong>
              {difficultWordsCount} {difficultWordsCount === 1 ? "palavra" : "palavras"} para revisar
            </strong>
            <span>Pratique as palavras que você errou recentemente.</span>
          </span>
          <span className={styles.reviewBtn}>Revisar agora</span>
        </button>
      )}
    </div>
  )
}
