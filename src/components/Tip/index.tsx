import styles from "./styles.module.css"
import tipIcon from "../../assets/tip.svg"

type Props = {
  tip: string
  themeName?: string
}

export function Tip({ tip, themeName }: Props) {
  return (
    <div className={styles.tip}>
      <img src={tipIcon} alt="Ícone de dica" className={styles.icon} />

      <div className={styles.content}>
        <div className={styles.header}>
          <h3>Significado em Português</h3>
          {themeName && <span className={styles.themeTag}>{themeName}</span>}
        </div>
        <p className={styles.tipText}>"{tip}"</p>
      </div>
    </div>
  )
}