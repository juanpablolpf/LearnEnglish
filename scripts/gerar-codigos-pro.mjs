#!/usr/bin/env node
/**
 * Gera códigos de acesso para a versão completa (Pro) do Learn English.
 *
 * COMO USAR
 *   node scripts/gerar-codigos-pro.mjs [quantidade]
 *   (padrão: 100 códigos)
 *
 * O QUE ELE FAZ
 *   1. Gera N códigos únicos, no formato LEP-XXXX-XXXX-XXXX.
 *   2. Salva os códigos em texto puro num arquivo na sua Área de Trabalho
 *      (NUNCA dentro do repositório - esse arquivo é o que você sobe na
 *      Hotmart/Kiwify como "chave de licença" entregue automaticamente).
 *   3. Imprime a lista de HASHES (não os códigos) para você colar em
 *      src/utils/license.ts, em VALID_CODE_HASHES.
 *
 * IMPORTANTE
 *   - O repositório do Learn English é PÚBLICO. Só os hashes podem ir para
 *     lá. O arquivo com os códigos em texto puro fica de fora (o .gitignore
 *     já bloqueia arquivos "codigos-pro*.csv", mas ele nem é gerado dentro
 *     do repositório, para não ter risco de escapar num "git add .").
 *   - Rodar o script de novo NÃO invalida os códigos já vendidos: sempre
 *     ADICIONE os hashes novos à lista existente em license.ts, nunca troque
 *     a lista inteira.
 *   - Se algum código vazar (por exemplo, alguém postar publicamente), a
 *     única forma de bloqueá-lo é remover o hash dele de VALID_CODE_HASHES
 *     e publicar de novo - não tem como revogar em tempo real sem um servidor.
 */
import { createHash, randomInt } from "node:crypto"
import { writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

// Sem caracteres parecidos entre si (0/O, 1/I/L) para evitar erro de digitação.
const CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

function randomBlock(length) {
  let out = ""
  for (let i = 0; i < length; i++) {
    out += CHARSET[randomInt(CHARSET.length)]
  }
  return out
}

function generateCode() {
  return `LEP-${randomBlock(4)}-${randomBlock(4)}-${randomBlock(4)}`
}

// Mesma normalização usada em src/utils/license.ts: precisa ficar igual dos dois lados.
function normalizeCode(raw) {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "")
}

function sha256Hex(text) {
  return createHash("sha256").update(text).digest("hex")
}

const quantidade = Number(process.argv[2]) || 100

const codigos = new Set()
while (codigos.size < quantidade) {
  codigos.add(generateCode())
}
const lista = Array.from(codigos)

const hashes = lista.map((c) => sha256Hex(normalizeCode(c)))

const dataStr = new Date().toISOString().slice(0, 10)
const csvPath = join(homedir(), "Desktop", `codigos-pro-${dataStr}.csv`)
writeFileSync(csvPath, "codigo\n" + lista.join("\n") + "\n", "utf-8")

console.log(`✅ ${quantidade} códigos gerados.`)
console.log(`📄 Códigos em texto puro salvos em: ${csvPath}`)
console.log(`   (suba esse arquivo na Hotmart/Kiwify como chave de licença; NÃO o coloque no repositório)`)
console.log()
console.log("📋 Cole estes hashes em src/utils/license.ts, dentro de VALID_CODE_HASHES")
console.log("   (adicione aos que já existem, não troque a lista inteira):")
console.log()
console.log(hashes.map((h) => `  "${h}",`).join("\n"))
