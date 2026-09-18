import styles from "./app.module.css"
import { useEffect, useState, useRef, useCallback } from "react"

import { THEME_DATA } from "./data/themeData"

import type { Challenge, GameStatus, LettersUsedProps, UserProfile, MainTab, StudyMode } from "./types"

// Componentes da Interface
import { Navbar } from "./components/Navbar"
import { LoginModal } from "./components/LoginModal"
import { AchievementToast, type ToastMessage } from "./components/AchievementToast"
import { Ranking } from "./components/Ranking"
import { Achievements } from "./components/Achievements"
import { Profile } from "./components/Profile"
import { PracticeHub } from "./components/PracticeHub"
import { Flashcards } from "./components/Flashcards"
import { Quiz } from "./components/Quiz"
import { SpeechTrainer } from "./components/SpeechTrainer"

// Componentes do Jogo da Forca
import { Header } from "./components/Header"
import { Tip } from "./components/Tip"
import { Letter } from "./components/Letter"
import { Input } from "./components/Input"
import { Button } from "./components/Button"
import { LettersUsed } from "./components/LettersUsed"
import { VirtualKeyboard } from "./components/VirtualKeyboard"
import { ThemeCard } from "./components/ThemeCard"
import { ResultModal } from "./components/ResultModal"

import { sounds } from "./utils/soundEffects"
import {
  getCurrentUser,
  saveCurrentUser,
  recordLearnedWord,
  recordFailedWord,
} from "./utils/auth"
import logo from "./assets/logo.png"

const MAX_LIVES = 6

export default function App() {
  // Estado do Usuário e Gamificação
  const [user, setUser] = useState<UserProfile>(getCurrentUser)
  const [mainTab, setMainTab] = useState<MainTab>("learn")
  const [activeStudyMode, setActiveStudyMode] = useState<StudyMode>("hangman")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Estado da Sessão de Estudo Ativa
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [themeDisplayName, setThemeDisplayName] = useState<string>("")
  const [shuffledWords, setShuffledWords] = useState<Challenge[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  // Estado do Jogo da Forca
  const [letter, setLetter] = useState("")
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Sincroniza tema dark/light
  useEffect(() => {
    const loadedUser = getCurrentUser()
    setUser(loadedUser)
    document.documentElement.setAttribute("data-theme", loadedUser.darkMode ? "dark" : "light")
  }, [])

  // Vidas restantes
  const wrongCount = lettersUsed.filter((item) => !item.correct).length
  const livesLeft = Math.max(0, MAX_LIVES - wrongCount)

  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5)
  }

  // Notificações / Toasts
  const triggerToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = "toast_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Alternar Modo Escuro / Claro
  function handleToggleTheme() {
    setUser((prev) => {
      const updated = { ...prev, darkMode: !prev.darkMode }
      saveCurrentUser(updated)
      document.documentElement.setAttribute("data-theme", updated.darkMode ? "dark" : "light")
      return updated
    })
  }

  function handleToggleSound() {
    setUser((prev) => {
      const updated = { ...prev, soundEnabled: !prev.soundEnabled }
      saveCurrentUser(updated)
      return updated
    })
  }

  // Todas as palavras reunidas para o modo misto e geração do quiz
  const allAvailableWords = Object.values(THEME_DATA).flatMap((t) => t.words)

  // Iniciar tema comum com um modo específico
  function handleStartTheme(themeKey: string, mode: StudyMode = "hangman") {
    const theme = THEME_DATA[themeKey]
    if (!theme) return

    setSelectedTheme(themeKey)
    setThemeDisplayName(theme.title)
    setActiveStudyMode(mode)
    const shuffled = shuffleArray(theme.words)
    startNewThemeSession(shuffled)
  }

  // Iniciar modo misto (todas as 800+ palavras)
  function handleSelectMixMode(mode: StudyMode = "hangman") {
    setSelectedTheme("MIX")
    setThemeDisplayName("Todas as Palavras 🎲")
    setActiveStudyMode(mode)
    const shuffled = shuffleArray(allAvailableWords)
    startNewThemeSession(shuffled)
  }

  // Iniciar modo de revisão de palavras difíceis
  function handleSelectReviewMode(mode: StudyMode = "hangman") {
    if (user.difficultWords.length === 0) return
    setSelectedTheme("REVIEW")
    setThemeDisplayName("Revisão de Dificuldades 🎯")
    setActiveStudyMode(mode)
    const shuffled = shuffleArray(user.difficultWords)
    startNewThemeSession(shuffled)
  }

  function startNewThemeSession(words: Challenge[]) {
    setShuffledWords(words)
    setCurrentIndex(0)
    setChallenge(words[0] || null)
    setLettersUsed([])
    setLetter("")
    setGameStatus("playing")
    setIsModalOpen(false)
  }

  function startNextWord() {
    const nextIndex = currentIndex + 1
    if (nextIndex < shuffledWords.length) {
      setCurrentIndex(nextIndex)
      setChallenge(shuffledWords[nextIndex])
      setLettersUsed([])
      setLetter("")
      setGameStatus("playing")
      setIsModalOpen(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    } else {
      // Concluiu todas as palavras do tema
      setIsModalOpen(false)
      setSelectedTheme(null)
      setChallenge(null)
    }
  }

  function handleRestartGame() {
    if (!selectedTheme) return
    if (selectedTheme === "MIX") {
      handleSelectMixMode(activeStudyMode)
    } else if (selectedTheme === "REVIEW") {
      handleSelectReviewMode(activeStudyMode)
    } else {
      handleStartTheme(selectedTheme, activeStudyMode)
    }
  }

  // Registrar acerto em qualquer modo de estudo
  const handleWordSuccess = useCallback((challengeItem: Challenge, xpGain = 15) => {
    const themeKey = selectedTheme || "General"
    const { user: updatedUser, leveledUp, newAchievements } = recordLearnedWord(
      themeKey,
      challengeItem,
      xpGain
    )
    setUser(updatedUser)

    if (leveledUp) {
      triggerToast({
        type: "levelup",
        title: `Parabéns! Você alcançou o Nível ${updatedUser.level}!`,
        subtitle: "Continue estudando para desbloquear novos títulos e liderar o ranking.",
        icon: "🚀",
      })
    }

    if (newAchievements.length > 0) {
      newAchievements.forEach((achTitle) => {
        triggerToast({
          type: "achievement",
          title: achTitle,
          subtitle: "Você desbloqueou uma nova conquista e ganhou XP bônus!",
          icon: "🏆",
        })
      })
    }
  }, [selectedTheme, triggerToast])

  // Registrar erro em qualquer modo de estudo
  const handleWordFailure = useCallback((challengeItem: Challenge) => {
    const updatedUser = recordFailedWord(challengeItem)
    setUser(updatedUser)
  }, [])

  // Palpite de uma letra na Forca
  const handleGuessLetter = useCallback(
    (charToGuess: string) => {
      if (!challenge || gameStatus !== "playing" || isModalOpen) return

      const cleanChar = charToGuess.trim().toUpperCase()
      if (!cleanChar || cleanChar.length !== 1 || !/^[A-Z]$/.test(cleanChar)) {
        return
      }

      // Já utilizou a letra?
      const alreadyUsed = lettersUsed.some(
        (used) => used.value.toUpperCase() === cleanChar
      )
      if (alreadyUsed) {
        setLetter("")
        return
      }

      const isHit = challenge.word
        .toUpperCase()
        .split("")
        .includes(cleanChar)

      const updatedUsed = [...lettersUsed, { value: cleanChar, correct: isHit }]
      setLettersUsed(updatedUsed)
      setLetter("")

      if (isHit) {
        if (user.soundEnabled) sounds.playCorrect()

        // Verificar se ganhou
        const alphaCharsInWord = challenge.word
          .toUpperCase()
          .split("")
          .filter((ch) => /^[A-Z]$/.test(ch))

        const allGuessed = alphaCharsInWord.every((ch) =>
          updatedUsed.some((u) => u.value === ch && u.correct)
        )

        if (allGuessed) {
          setGameStatus("won")
          if (user.soundEnabled) sounds.playWin()
          handleWordSuccess(challenge, 20)
          setTimeout(() => setIsModalOpen(true), 400)
        }
      } else {
        if (user.soundEnabled) sounds.playWrong()

        const newWrongCount = updatedUsed.filter((item) => !item.correct).length
        if (newWrongCount >= MAX_LIVES) {
          setGameStatus("lost")
          if (user.soundEnabled) sounds.playLose()
          handleWordFailure(challenge)
          setTimeout(() => setIsModalOpen(true), 400)
        }
      }

      setTimeout(() => inputRef.current?.focus(), 50)
    },
    [challenge, gameStatus, isModalOpen, lettersUsed, user.soundEnabled, handleWordSuccess, handleWordFailure]
  )

  const handleConfirmInput = useCallback(() => {
    if (!letter.trim()) return
    handleGuessLetter(letter)
  }, [letter, handleGuessLetter])

  // Listener global de teclado físico para a Forca
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isModalOpen || !selectedTheme || !challenge || activeStudyMode !== "hangman") return

      if (e.key === "Enter") {
        handleConfirmInput()
        return
      }

      if (/^[a-zA-Z]$/.test(e.key)) {
        handleGuessLetter(e.key)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isModalOpen, selectedTheme, challenge, activeStudyMode, handleGuessLetter, handleConfirmInput])

  // Manter foco no input na Forca
  useEffect(() => {
    if (selectedTheme && challenge && !isModalOpen && activeStudyMode === "hangman") {
      inputRef.current?.focus()
    }
  }, [selectedTheme, challenge, isModalOpen, activeStudyMode])

  // Total de palavras aprendidas
  const totalLearned = Object.values(user.completedWordIds).reduce(
    (acc, list) => acc + list.length,
    0
  )

  // Filtragem dos 16 temas pela barra de busca
  const filteredThemes = Object.entries(THEME_DATA).filter(([key, data]) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      data.title.toLowerCase().includes(q) ||
      data.desc.toLowerCase().includes(q) ||
      key.toLowerCase().includes(q)
    )
  })

  // -------------------------------------------------------------
  // RENDERIZAÇÃO: SESSÃO DE ESTUDO ATIVA (JOGO/FLASHCARDS/QUIZ/VOZ)
  // -------------------------------------------------------------
  if (selectedTheme && challenge) {
    return (
      <div className={styles.container}>
        <Navbar
          user={user}
          currentTab={mainTab}
          onSelectTab={(tab) => {
            setSelectedTheme(null)
            setMainTab(tab)
          }}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onToggleTheme={handleToggleTheme}
          onToggleSound={handleToggleSound}
        />

        <main className={styles.card}>
          {/* Modo 1: Flashcards 3D */}
          {activeStudyMode === "flashcards" && (
            <Flashcards
              words={shuffledWords}
              themeTitle={themeDisplayName}
              soundEnabled={user.soundEnabled}
              onWordMastered={(item) => handleWordSuccess(item, 15)}
              onWordFailed={handleWordFailure}
              onBack={() => setSelectedTheme(null)}
            />
          )}

          {/* Modo 2: Quiz de Múltipla Escolha */}
          {activeStudyMode === "quiz" && (
            <Quiz
              words={shuffledWords}
              allWordsPool={allAvailableWords}
              themeTitle={themeDisplayName}
              soundEnabled={user.soundEnabled}
              onWordLearned={(item, xp) => handleWordSuccess(item, xp)}
              onWordFailed={handleWordFailure}
              onBack={() => setSelectedTheme(null)}
            />
          )}

          {/* Modo 3: Treinador de Voz e Pronúncia */}
          {activeStudyMode === "speech" && (
            <SpeechTrainer
              words={shuffledWords}
              themeTitle={themeDisplayName}
              soundEnabled={user.soundEnabled}
              onWordMastered={(item, xp) => handleWordSuccess(item, xp)}
              onBack={() => setSelectedTheme(null)}
            />
          )}

          {/* Modo 4: Jogo da Forca Clássico */}
          {activeStudyMode === "hangman" && (
            <>
              <div className={styles.gameHeader}>
                <button
                  type="button"
                  className={styles.backBtn}
                  onClick={() => setSelectedTheme(null)}
                >
                  ← Voltar aos Temas
                </button>

                <span className={styles.themeBadge}>{themeDisplayName}</span>
              </div>

              <Header
                lives={livesLeft}
                maxLives={MAX_LIVES}
                streak={user.streak}
                soundEnabled={user.soundEnabled}
                isDark={user.darkMode}
                onToggleSound={handleToggleSound}
                onToggleTheme={handleToggleTheme}
                onRestart={handleRestartGame}
              />

              <Tip tip={challenge.tip} themeName={themeDisplayName} />

              {/* Exibição da Palavra */}
              <div className={styles.wordArea}>
                <div className={styles.wordRow}>
                  {challenge.word.split(" ").map((wordPart, wordIdx) => (
                    <div key={wordIdx} className={styles.wordGroup}>
                      {wordPart.split("").map((char, charIdx) => {
                        const upperChar = char.toUpperCase()
                        const isSpecial = !/^[A-Z]$/.test(upperChar)

                        if (isSpecial) {
                          return (
                            <Letter
                              key={charIdx}
                              value={char}
                              isSpecial
                            />
                          )
                        }

                        const letterUsed = lettersUsed.find(
                          (used) => used.value.toUpperCase() === upperChar
                        )

                        const isRevealed = letterUsed?.correct || gameStatus === "lost"

                        return (
                          <Letter
                            key={charIdx}
                            value={isRevealed ? upperChar : ""}
                            color={
                              letterUsed?.correct
                                ? "correct"
                                : gameStatus === "lost"
                                ? "revealed"
                                : "default"
                            }
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Campo de Palpite & Teclado Virtual */}
              <div className={styles.guessSection}>
                <div className={styles.guessLabel}>
                  <span>Seu Palpite</span>
                  <span className={styles.keyboardHint}>💡 Digite no teclado físico ou virtual</span>
                </div>

                <div className={styles.guessControls}>
                  <Input
                    ref={inputRef}
                    autoFocus
                    maxLength={1}
                    placeholder="?"
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleConfirmInput()
                    }}
                    disabled={gameStatus !== "playing"}
                  />
                  <Button
                    title="Confirmar"
                    onClick={handleConfirmInput}
                    disabled={!letter.trim() || gameStatus !== "playing"}
                  />
                </div>

                <VirtualKeyboard
                  lettersUsed={lettersUsed}
                  onSelectLetter={handleGuessLetter}
                  disabled={gameStatus !== "playing"}
                />
              </div>

              <LettersUsed data={lettersUsed} />

              <ResultModal
                isOpen={isModalOpen}
                status={gameStatus}
                challenge={challenge}
                streak={user.streak}
                onNext={startNextWord}
                onRetry={() => {
                  setLettersUsed([])
                  setLetter("")
                  setGameStatus("playing")
                  setIsModalOpen(false)
                  setTimeout(() => inputRef.current?.focus(), 100)
                }}
                onBackToThemes={() => {
                  setIsModalOpen(false)
                  setSelectedTheme(null)
                }}
              />
            </>
          )}
        </main>

        <LoginModal
          isOpen={isLoginModalOpen}
          currentUser={user}
          onClose={() => setIsLoginModalOpen(false)}
          onUserChanged={(updated) => {
            setUser(updated)
            document.documentElement.setAttribute("data-theme", updated.darkMode ? "dark" : "light")
          }}
        />

        <AchievementToast toasts={toasts} onDismiss={dismissToast} />
      </div>
    )
  }

  // -------------------------------------------------------------
  // RENDERIZAÇÃO: TELA PRINCIPAL COM NAVEGAÇÃO POR ABAS
  // -------------------------------------------------------------
  return (
    <div className={styles.container}>
      <Navbar
        user={user}
        currentTab={mainTab}
        onSelectTab={setMainTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onToggleTheme={handleToggleTheme}
        onToggleSound={handleToggleSound}
      />

      <main className={styles.card}>
        {/* ABA 1: APRENDER (16 TEMAS & VOCABULÁRIO) */}
        {mainTab === "learn" && (
          <>
            <div className={styles.themeHeader}>
              <img src={logo} alt="Learn English Logo" className={styles.themeHeroLogo} />
              <h1 className={styles.themeTitle}>Aprenda Inglês por Temas</h1>
              <p className={styles.themeSubtitle}>
                {allAvailableWords.length} palavras em 16 categorias com fonética nativa e frases
              </p>
            </div>

            {/* Estatísticas Rápidas */}
            <div className={styles.statsSummary}>
              <div className={styles.statBox}>
                <span className={styles.statValue}>🔥 {user.streak}</span>
                <span className={styles.statLabel}>Ofensiva Atual</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statValue}>⚡ {user.xp}</span>
                <span className={styles.statLabel}>XP Total</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statValue}>📚 {totalLearned}</span>
                <span className={styles.statLabel}>Palavras Dominadas</span>
              </div>
            </div>

            {/* Barra de Pesquisa de Temas */}
            <div className={styles.searchFilterBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Pesquisar tema ou palavra (ex: Verbos, Viagens, Compras...)"
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Grade dos 16 Temas */}
            <div className={styles.themesList}>
              {filteredThemes.map(([key, data]) => {
                const completedCount = (user.completedWordIds[key] || []).length
                return (
                  <ThemeCard
                    key={key}
                    title={data.title}
                    icon={data.icon}
                    description={data.desc}
                    totalWords={data.words.length}
                    completedWords={completedCount}
                    onClick={() => handleStartTheme(key, "hangman")}
                  />
                )
              })}

              {/* Modo de Revisão se houver palavras difíceis */}
              {user.difficultWords.length > 0 && !searchQuery && (
                <ThemeCard
                  title="Revisar Palavras Difíceis"
                  icon="🎯"
                  description="Treine novamente as palavras que você errou"
                  totalWords={user.difficultWords.length}
                  completedWords={0}
                  isReview
                  onClick={() => handleSelectReviewMode("hangman")}
                />
              )}
            </div>

            {/* Ações Rápidas */}
            <div className={styles.quickActions}>
              <Button
                title={`🎲 Modo Misto (Misturar Todas as ${allAvailableWords.length} Palavras)`}
                variant="outline"
                onClick={() => handleSelectMixMode("hangman")}
              />
            </div>
          </>
        )}

        {/* ABA 2: PRATICAR (HUB DE MODOS DE ESTUDO) */}
        {mainTab === "practice" && (
          <PracticeHub
            totalWords={allAvailableWords.length}
            difficultWordsCount={user.difficultWords.length}
            onSelectMode={(mode) => {
              handleSelectMixMode(mode)
            }}
          />
        )}

        {/* ABA 3: RANKING DE DESTAQUES */}
        {mainTab === "ranking" && (
          <Ranking
            currentUser={user}
            onStartStudy={() => {
              setMainTab("learn")
            }}
          />
        )}

        {/* ABA 4: CONQUISTAS */}
        {mainTab === "achievements" && (
          <Achievements
            user={user}
            onStartStudy={() => {
              setMainTab("learn")
            }}
          />
        )}

        {/* ABA 5: PERFIL DO ALUNO */}
        {mainTab === "profile" && (
          <Profile
            user={user}
            onUserUpdated={setUser}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Modal de Login / Troca de Aluno */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={user}
        onClose={() => setIsLoginModalOpen(false)}
        onUserChanged={(updated) => {
          setUser(updated)
          document.documentElement.setAttribute("data-theme", updated.darkMode ? "dark" : "light")
        }}
      />

      {/* Toasts Flutuantes */}
      <AchievementToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
