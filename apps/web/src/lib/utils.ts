/** Junta classes condicionalmente (substitui clsx/cn). */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Formata data para pt-BR. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Extrai mensagem legível de um erro qualquer. */
export function extractErrorMessage(err: unknown, fallback = 'Algo deu errado.'): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}
