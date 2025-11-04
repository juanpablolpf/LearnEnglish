import styles from "./app.module.css"
import { useEffect, useState, useRef } from "react"
import { WORDS_DAILY } from "./utils/words-daily"
import { WORDS_TRAVEL } from "./utils/words-travel"
import { WORDS_VERBS } from "./utils/words-verbs"
import { WORDS_WORK } from "./utils/words-work"
import type { Challenge } from "./utils/words-daily"

import { Header } from "./components/Header"
import { Tip } from "./components/Tip"
import { Letter } from "./components/Letter"
import { Input } from "./components/Input"
import { Button } from "./components/Button"
import { LettersUsed } from "./components/LettersUsed"
import type { LettersUsedProps } from "./components/LettersUsed"

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLetterUsed] = useState<LettersUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [shuffledWords, setShuffledWords] = useState<Challenge[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const ATTEMPTS_MARGIN = 2

  const THEMES: Record<string, Challenge[]> = {
    Verbs: WORDS_VERBS,
    Work: WORDS_WORK,
    "Daily Routines": WORDS_DAILY,
    Travel: WORDS_TRAVEL,
  }

  function shuffleArray(array: Challenge[]) {
    return [...array].sort(() => Math.random() - 0.5)
  }

  function handleSelectTheme(theme: string) {
    setSelectedTheme(theme)
    const shuffled = shuffleArray(THEMES[theme])
    setShuffledWords(shuffled)
    setCurrentIndex(0)
    setChallenge(shuffled[0])
    setScore(0)
    setLetter("")
    setLetterUsed([])
  }

  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")
    if (isConfirmed && selectedTheme) {
      handleSelectTheme(selectedTheme)
    }
  }

  function handleConfirm() {
    if (!challenge) return

    if (!letter.trim()) {
      return alert("Digite uma letra!")
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find((used) => used.value.toUpperCase() === value)
    if (exists) {
      setLetter("")
      return alert("Você já utilizou a letra " + value)
    }

    const hits = challenge.word.toUpperCase().split("").filter((char) => char === value).length
    const correct = hits > 0
    const currentScore = score + hits

    setLetterUsed((prev) => [...prev, { value, correct }])
    setScore(currentScore)
    setLetter("")
  }

  function endGame(message: string) {
    alert(message)
    const nextIndex = currentIndex + 1
    if (nextIndex < shuffledWords.length) {
      setCurrentIndex(nextIndex)
      setChallenge(shuffledWords[nextIndex])
      setScore(0)
      setLetterUsed([])
    } else {
      alert("Você completou todas as palavras deste tema! 🎉")
      setSelectedTheme(null)
      setChallenge(null)
    }
  }

  useEffect(() => {
    if (!challenge) return

    setTimeout(() => {
      if (score === challenge.word.length) {
        endGame("Parabéns, você descobriu a palavra!")
      }

      const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN
      if (lettersUsed.length === attemptLimit) {
        endGame("Que pena, você usou todas as tentativas!")
      }
    }, 200)
  }, [score, lettersUsed.length])

  // 🔹 TELA DE SELEÇÃO DE TEMA
  if (!selectedTheme) {
    return (
      <div className={styles.container}>
        <main style={{ textAlign: "center" }}>
          <h1>Selecione um Tema 🎯</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {Object.keys(THEMES).map((theme) => (
              <Button key={theme} title={theme} onClick={() => handleSelectTheme(theme)} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!challenge) return null

  // 🔹 JOGO NORMAL
  return (
    <div className={styles.container}>
      <main>
        {selectedTheme && (
        <button
          className={styles.backButton}
          onClick={() => setSelectedTheme(null)}>Voltar ao Tema
        </button>
        )}

        <Header
          current={lettersUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame}
        />
        <h2>{selectedTheme}</h2>
        <Tip tip={challenge.tip} />

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            )
            return (
              <Letter
                key={index}
                value={letterUsed?.value}
                color={letterUsed?.correct ? "correct" : "default"}
              />
            )
          })}
        </div>

        <h4>Palpite</h4>
        <div className={styles.guess}>
          <Input
            ref={inputRef}
            autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm()
            }}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  )
}
