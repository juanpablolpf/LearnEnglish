/**
 * Utilitário de pronúncia em inglês nativo usando Web Speech API
 */
export function speakWord(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech Synthesis não é suportado neste navegador.")
      resolve()
      return
    }

    // Cancela qualquer fala anterior em andamento
    window.speechSynthesis.cancel()

    const cleanText = text.trim()
    if (!cleanText) {
      resolve()
      return
    }

    // Palavras curtas e em maiúsculas (ex: "CAR", "BUS") são interpretadas por
    // várias vozes como siglas, e soletradas letra a letra em vez de faladas
    // como palavra. Falar em minúsculas evita esse comportamento.
    const spokenText = cleanText.toLowerCase()

    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.lang = "en-US"
    utterance.rate = rate
    utterance.pitch = 1.0

    // Tentar encontrar uma voz natural em inglês
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(
      (v) => (v.lang.startsWith("en-US") || v.lang.startsWith("en_US") || v.lang.startsWith("en-GB")) &&
             (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Siri") || v.name.includes("Samantha"))
    ) || voices.find((v) => v.lang.startsWith("en"))

    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()

    window.speechSynthesis.speak(utterance)
  })
}
