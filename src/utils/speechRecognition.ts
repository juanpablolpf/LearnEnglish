/**
 * Utilitário de reconhecimento de fala (Speech Recognition) via Web Speech API
 */

// Interface para o WebkitSpeechRecognition do navegador
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
        confidence: number
      }
    }
  }
}

interface SpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onstart: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: { error: string }) => void
  onend: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

function cleanString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function listenToUserSpeech(
  expectedWord: string,
  onStatusChange: (status: "listening" | "processing" | "idle") => void
): Promise<{ transcript: string; isMatch: boolean; scorePercent: number }> {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      reject(new Error("Reconhecimento de voz não é suportado neste navegador."))
      return
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRec) {
      reject(new Error("API de voz indisponível."))
      return
    }

    const recognition = new SpeechRec()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.continuous = false

    onStatusChange("listening")

    let hasResult = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      hasResult = true
      onStatusChange("processing")
      const transcript = event.results[0][0].transcript

      const cleanedSpoken = cleanString(transcript)
      const cleanedExpected = cleanString(expectedWord)

      // Comparação direta ou parcial
      const isExact = cleanedSpoken === cleanedExpected
      const isContained = cleanedSpoken.includes(cleanedExpected) || cleanedExpected.includes(cleanedSpoken)

      let scorePercent = 0
      if (isExact) scorePercent = 100
      else if (isContained) scorePercent = 85
      else {
        // Cálculo básico de similaridade por letras
        let matches = 0
        const minLen = Math.min(cleanedSpoken.length, cleanedExpected.length)
        for (let i = 0; i < minLen; i++) {
          if (cleanedSpoken[i] === cleanedExpected[i]) matches++
        }
        scorePercent = Math.round((matches / Math.max(cleanedExpected.length, 1)) * 100)
      }

      const isMatch = isExact || scorePercent >= 70

      resolve({
        transcript,
        isMatch,
        scorePercent,
      })
    }

    recognition.onerror = () => {
      onStatusChange("idle")
      if (!hasResult) {
        resolve({
          transcript: "Nenhuma fala detectada.",
          isMatch: false,
          scorePercent: 0,
        })
      }
    }

    recognition.onend = () => {
      onStatusChange("idle")
      if (!hasResult) {
        resolve({
          transcript: "Tempo esgotado.",
          isMatch: false,
          scorePercent: 0,
        })
      }
    }

    try {
      recognition.start()
    } catch (e) {
      reject(e)
    }
  })
}
