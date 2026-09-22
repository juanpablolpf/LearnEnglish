/**
 * Desbloqueio da versão completa (Pro) por código de acesso.
 *
 * Sem servidor: o app guarda apenas o HASH (SHA-256) de cada código válido,
 * nunca o código em texto puro. Os códigos de verdade ficam só na planilha
 * gerada por scripts/gerar-codigos-pro.mjs, fora do repositório.
 *
 * Isso não é inviolável (é tudo client-side), mas evita o pior cenário:
 * ninguém consegue ler os códigos válidos olhando o código-fonte publicado.
 */

// Temas liberados sem comprar a versão completa.
// As chaves são as mesmas usadas em THEME_DATA (src/data/themeData.ts).
export const FREE_THEME_KEYS = ["Daily Routines", "Food", "Travel"]

// Hashes SHA-256 dos códigos válidos, gerados por scripts/gerar-codigos-pro.mjs.
// Lista vazia = nenhum código emitido ainda (ver README do script antes de vender).
export const VALID_CODE_HASHES: string[] = []

// Remove espaços, traços e diferenças de maiúsculas/minúsculas antes de comparar.
// Precisa ser feito do mesmo jeito aqui e no script que gera os códigos.
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function isValidProCode(rawCode: string): Promise<boolean> {
  const normalized = normalizeCode(rawCode)
  if (!normalized) return false
  const hash = await sha256Hex(normalized)
  return VALID_CODE_HASHES.includes(hash)
}
