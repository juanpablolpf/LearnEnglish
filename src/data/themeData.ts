// 16 Categorias Temáticas (800+ Palavras com fonética e exemplos práticos)
import { WORDS_DAILY } from "../utils/words-daily"
import { WORDS_TRAVEL } from "../utils/words-travel"
import { WORDS_VERBS } from "../utils/words-verbs"
import { WORDS_WORK } from "../utils/words-work"
import { WORDS_FOOD } from "../utils/words-food"
import { WORDS_TECH } from "../utils/words-tech"
import { WORDS_FEELINGS } from "../utils/words-feelings"
import { WORDS_SHOPPING } from "../utils/words-shopping"
import { WORDS_HEALTH } from "../utils/words-health"
import { WORDS_NATURE } from "../utils/words-nature"
import { WORDS_BIBLE } from "../utils/words-bible"
import { WORDS_CONNECTORS } from "../utils/words-connectors"
import { WORDS_DIRECTIONS } from "../utils/words-directions"
import { WORDS_ENTERTAINMENT } from "../utils/words-entertainment"
import { WORDS_IDIOMS } from "../utils/words-idioms"
import { WORDS_INTERVIEW } from "../utils/words-interview"

import type { Challenge } from "../types"

export const THEME_DATA: Record<
  string,
  { title: string; icon: string; desc: string; words: Challenge[] }
> = {
  "Daily Routines": {
    title: "Rotina & Casa",
    icon: "🏠",
    desc: "Objetos do dia a dia, casa e rotina diária",
    words: WORDS_DAILY,
  },
  Verbs: {
    title: "Verbos Essenciais",
    icon: "⚡",
    desc: "Os 50 verbos mais usados da língua inglesa",
    words: WORDS_VERBS,
  },
  Food: {
    title: "Comida & Restaurante",
    icon: "🍕",
    desc: "Pratos, bebidas, ingredientes e pedidos",
    words: WORDS_FOOD,
  },
  Travel: {
    title: "Viagens & Turismo",
    icon: "✈️",
    desc: "Aeroporto, hotel, transporte e passeios",
    words: WORDS_TRAVEL,
  },
  Work: {
    title: "Trabalho & Negócios",
    icon: "💼",
    desc: "Escritório, reuniões, carreira e projetos",
    words: WORDS_WORK,
  },
  Tech: {
    title: "Tecnologia & Internet",
    icon: "💻",
    desc: "Software, hardware, apps e inovação",
    words: WORDS_TECH,
  },
  Feelings: {
    title: "Sentimentos & Emoções",
    icon: "💬",
    desc: "Personalidade, estados de espírito e reações",
    words: WORDS_FEELINGS,
  },
  Shopping: {
    title: "Compras & Roupas",
    icon: "🛍️",
    desc: "Vestuário, calçados, lojas e pagamentos",
    words: WORDS_SHOPPING,
  },
  Health: {
    title: "Saúde & Bem-Estar",
    icon: "🏥",
    desc: "Corpo humano, sintomas, consultas e remédios",
    words: WORDS_HEALTH,
  },
  Nature: {
    title: "Natureza & Animais",
    icon: "🌍",
    desc: "Fauna, flora, clima, estações e paisagens",
    words: WORDS_NATURE,
  },
  Bible: {
    title: "Bíblico: Personagens & Lugares",
    icon: "📖",
    desc: "Profetas, apóstolos e cidades históricas da Bíblia",
    words: WORDS_BIBLE,
  },
  Connectors: {
    title: "Conectivos & Transições",
    icon: "🔗",
    desc: "Expressões de ligação para conversação fluente",
    words: WORDS_CONNECTORS,
  },
  Directions: {
    title: "Localização & Direções",
    icon: "🧭",
    desc: "Pedir direções, trânsito, ruas e mapas",
    words: WORDS_DIRECTIONS,
  },
  Entertainment: {
    title: "Lazer, Música & Cinema",
    icon: "🎬",
    desc: "Filmes, séries, esportes, hobbies e diversão",
    words: WORDS_ENTERTAINMENT,
  },
  Idioms: {
    title: "Expressões & Gírias",
    icon: "💡",
    desc: "Expressões idiomáticas do dia a dia americano",
    words: WORDS_IDIOMS,
  },
  Interview: {
    title: "Entrevistas de Emprego",
    icon: "🎯",
    desc: "Perguntas de recrutamento, soft skills e carreira",
    words: WORDS_INTERVIEW,
  },
}
