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

import {
  BookOpen,
  Briefcase,
  Film,
  HeartPulse,
  House,
  Laptop,
  Leaf,
  Link2,
  MapPin,
  MessageCircle,
  Plane,
  ShoppingBag,
  Smile,
  UserRoundCheck,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { Challenge } from "../types"

export const THEME_DATA: Record<
  string,
  { title: string; icon: LucideIcon; color: string; desc: string; words: Challenge[] }
> = {
  "Daily Routines": {
    title: "Rotina & Casa",
    icon: House,
    color: "#fb923c",
    desc: "Objetos do dia a dia, casa e rotina diária",
    words: WORDS_DAILY,
  },
  Verbs: {
    title: "Verbos Essenciais",
    icon: Zap,
    color: "#facc15",
    desc: "Os 50 verbos mais usados da língua inglesa",
    words: WORDS_VERBS,
  },
  Food: {
    title: "Comida & Restaurante",
    icon: Utensils,
    color: "#4ade80",
    desc: "Pratos, bebidas, ingredientes e pedidos",
    words: WORDS_FOOD,
  },
  Travel: {
    title: "Viagens & Turismo",
    icon: Plane,
    color: "#38bdf8",
    desc: "Aeroporto, hotel, transporte e passeios",
    words: WORDS_TRAVEL,
  },
  Work: {
    title: "Trabalho & Negócios",
    icon: Briefcase,
    color: "#a78bfa",
    desc: "Escritório, reuniões, carreira e projetos",
    words: WORDS_WORK,
  },
  Tech: {
    title: "Tecnologia & Internet",
    icon: Laptop,
    color: "#22d3ee",
    desc: "Software, hardware, apps e inovação",
    words: WORDS_TECH,
  },
  Feelings: {
    title: "Sentimentos & Emoções",
    icon: Smile,
    color: "#f472b6",
    desc: "Personalidade, estados de espírito e reações",
    words: WORDS_FEELINGS,
  },
  Shopping: {
    title: "Compras & Roupas",
    icon: ShoppingBag,
    color: "#fb7185",
    desc: "Vestuário, calçados, lojas e pagamentos",
    words: WORDS_SHOPPING,
  },
  Health: {
    title: "Saúde & Bem-Estar",
    icon: HeartPulse,
    color: "#f87171",
    desc: "Corpo humano, sintomas, consultas e remédios",
    words: WORDS_HEALTH,
  },
  Nature: {
    title: "Natureza & Animais",
    icon: Leaf,
    color: "#34d399",
    desc: "Fauna, flora, clima, estações e paisagens",
    words: WORDS_NATURE,
  },
  Bible: {
    title: "Bíblico: Personagens & Lugares",
    icon: BookOpen,
    color: "#fbbf24",
    desc: "Profetas, apóstolos e cidades históricas da Bíblia",
    words: WORDS_BIBLE,
  },
  Connectors: {
    title: "Conectivos & Transições",
    icon: Link2,
    color: "#818cf8",
    desc: "Expressões de ligação para conversação fluente",
    words: WORDS_CONNECTORS,
  },
  Directions: {
    title: "Localização & Direções",
    icon: MapPin,
    color: "#2dd4bf",
    desc: "Pedir direções, trânsito, ruas e mapas",
    words: WORDS_DIRECTIONS,
  },
  Entertainment: {
    title: "Lazer, Música & Cinema",
    icon: Film,
    color: "#c084fc",
    desc: "Filmes, séries, esportes, hobbies e diversão",
    words: WORDS_ENTERTAINMENT,
  },
  Idioms: {
    title: "Expressões & Gírias",
    icon: MessageCircle,
    color: "#60a5fa",
    desc: "Expressões idiomáticas do dia a dia americano",
    words: WORDS_IDIOMS,
  },
  Interview: {
    title: "Entrevistas de Emprego",
    icon: UserRoundCheck,
    color: "#a3e635",
    desc: "Perguntas de recrutamento, soft skills e carreira",
    words: WORDS_INTERVIEW,
  },
}
