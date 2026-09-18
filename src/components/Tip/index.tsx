import { useEffect, useState } from "react"
import styles from "./styles.module.css"
import tipIcon from "../../assets/tip.svg"
import { DICAS_INICIAIS } from "../../utils/auth"

type Props = {
  tip: string
  themeName?: string
  exampleHint?: string | null
  dicasRestantes: number
  onUsarDica: () => void
}

export function Tip({ tip, themeName, exampleHint, dicasRestantes, onUsarDica }: Props) {
  const [revelado, setRevelado] = useState(false)

  // Sempre que a frase de exemplo mudar (nova palavra), esconde a dica de novo
  useEffect(() => {
    setRevelado(false)
  }, [exampleHint])

  function handleRevelar() {
    if (dicasRestantes <= 0) return
    onUsarDica()
    setRevelado(true)
  }

  return (
    <div className={styles.tip}>
      <img src={tipIcon} alt="Ícone de dica" className={styles.icon} />

      <div className={styles.content}>
        <div className={styles.header}>
          <h3>Significado em Português</h3>
          {themeName && <span className={styles.themeTag}>{themeName}</span>}
        </div>
        <p className={styles.tipText}>"{tip}"</p>

        {exampleHint && revelado && (
          <p className={styles.exampleHint}>
            <span className={styles.exampleHintLabel}>Frase em inglês:</span> <em>"{exampleHint}"</em>
          </p>
        )}

        {exampleHint && !revelado && (
          <button
            type="button"
            className={styles.revealBtn}
            onClick={handleRevelar}
            disabled={dicasRestantes <= 0}
            title={dicasRestantes <= 0 ? "Você usou todas as suas dicas" : "Ver uma frase em inglês com a palavra escondida"}
          >
            <span className={styles.lampadas}>
              {Array.from({ length: DICAS_INICIAIS }).map((_, i) => (
                <span
                  key={i}
                  className={`${styles.lampada} ${i < dicasRestantes ? styles.lampadaAcesa : styles.lampadaApagada}`}
                >
                  💡
                </span>
              ))}
            </span>
            {dicasRestantes > 0 ? "Ver frase em inglês" : "Sem dicas restantes"}
          </button>
        )}
      </div>
    </div>
  )
}
