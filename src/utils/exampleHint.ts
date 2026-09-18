// Esconde a palavra-alvo (e variações simples: plural, -ed, -ing) dentro da
// frase de exemplo em inglês, trocando cada ocorrência por "_ _ _ _".
// Se algum "pedaço" da palavra (em frases/expressões de várias palavras)
// não for encontrado na frase, retorna null — melhor não mostrar a dica
// do que arriscar deixar a resposta visível.
export function ofuscarExemplo(example: string | undefined, word: string): string | null {
  if (!example) return null

  const tokens = word.split(/\s+/).filter(Boolean)
  let resultado = example
  let tokensComMatch = 0

  for (const token of tokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(`\\b${escaped}(e?s|e?d|ing)?\\b`, "gi")
    if (regex.test(resultado)) {
      tokensComMatch += 1
      resultado = resultado.replace(new RegExp(`\\b${escaped}(e?s|e?d|ing)?\\b`, "gi"), (match) =>
        "_ ".repeat(match.length).trim()
      )
    }
  }

  return tokensComMatch === tokens.length ? resultado : null
}
