/**
 * Remove cercas markdown comuns em respostas de LLM (```json ... ``` ou ``` ... ```)
 * e faz o parse seguro do JSON.
 */
export function parseJsonFromModelOutput(rawText: string): unknown {
  const trimmed = rawText.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const cleaned = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(cleaned) as unknown;
}
