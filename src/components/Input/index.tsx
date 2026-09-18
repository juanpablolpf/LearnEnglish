import React from "react"
import styles from "./styles.module.css"

type Props = React.ComponentProps<"input"> & {
  ref?: React.Ref<HTMLInputElement>
}

export function Input({ ref, ...rest }: Props) {
  return <input ref={ref} type="text" className={styles.input} {...rest} />
}