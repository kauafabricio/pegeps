'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adaptService } from '@/features/adapt/services/adapt.service';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DialogModal } from '@/components/ui/Dialog';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { extractErrorMessage, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const MIN_CONTEXT = 20;
const MAX_CONTEXT = 800;

export default function AdaptarTrilhaPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [context, setContext] = useState('');
  const [specialistDialogOpen, setSpecialistDialogOpen] = useState(false);
  const [specialistInfo, setSpecialistInfo] = useState<{ email: string; message: string } | null>(null);
  const [aiError, setAiError] = useState('');

  const { data: status, isLoading } = useQuery({
    queryKey: ['adapt-status'],
    queryFn: () => adaptService.getStatus(),
  });

  const aiMutation = useMutation({
    mutationFn: (ctx: string) => adaptService.adaptWithAi(ctx),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['active-trail'] });
      queryClient.invalidateQueries({ queryKey: ['adapt-status'] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success(`Trilha "${res.trail.title}" criada com sucesso!`);
      router.push('/trilha');
    },
    onError: (err) => setAiError(extractErrorMessage(err)),
  });

  const specialistMutation = useMutation({
    mutationFn: () => adaptService.requestSpecialist(),
    onSuccess: (res) => {
      setSpecialistInfo({ email: res.email, message: res.message });
      setSpecialistDialogOpen(true);
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const canAdapt = status?.canAdapt ?? true;
  const nextDate = status?.nextAvailableAt ? formatDate(status.nextAvailableAt) : null;
  const trimmedLength = context.trim().length;

  function handleAdaptAi() {
    setAiError('');
    if (trimmedLength < MIN_CONTEXT) {
      setAiError(`Descreva sua realidade e objetivos com pelo menos ${MIN_CONTEXT} caracteres.`);
      return;
    }
    aiMutation.mutate(context.trim());
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <Link href="/trilha">
          <Button variant="ghost" size="sm">← Voltar à trilha</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text mb-1">
          Adapte sua trilha
        </h1>
        <p className="text-sm text-gray-600">
          Escolha como quer personalizar seu aprendizado: gere uma trilha com IA agora, ou conte com um especialista para desenhar o seu roadmap.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <SkeletonCard lines={5} />
          <SkeletonCard lines={5} />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 items-stretch">
          {/* Specialist Card (orange, PDF page 10) */}
          <Card className="bg-brand-500 text-white border-0 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-6 right-6 w-28 h-28 rounded-full border-4 border-brand-yellow/60 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute top-2 -left-8 w-24 h-24 rounded-full bg-brand-700/35 pointer-events-none"
            />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-white text-brand-700 px-3 py-1 text-xs font-bold mb-4">
                <span aria-hidden>★</span> Consulta com especialista
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug mb-3">
                Consulta exclusiva com um especialista na área de gestão de projetos
              </h2>

              <p className="text-sm text-white/95 leading-relaxed mb-5">
                Um consultor especialista em gestão de projetos analisa o seu contexto e cria, com você, um plano de estudo e prática para a sua startup.
              </p>

              <ul className="flex flex-col gap-2.5 text-sm text-white mb-6">
                <li className="flex items-start gap-2">
                  <span aria-hidden className="font-bold">✓</span>
                  <span>Conversa inicial para entender seus objetivos e desafios</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="font-bold">✓</span>
                  <span>Roadmap personalizado com módulos, prazos e prioridades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span aria-hidden className="font-bold">✓</span>
                  <span>Revisão humana do seu avanço e ajustes ao longo do caminho</span>
                </li>
              </ul>
            </div>

            <Button
              type="button"
              className="relative z-10 bg-white text-brand-700 hover:bg-peach w-full font-bold"
              onClick={() => specialistMutation.mutate()}
              isLoading={specialistMutation.isPending}
              size="md"
            >
              Contratar especialista →
            </Button>
          </Card>

          {/* AI Card (white, PDF page 10) */}
          <Card className="p-6 sm:p-8 border border-brand-100 flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <Badge variant="orange">✨ Gratuito com IA</Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-brand-text leading-snug mb-2">
                Conte sua realidade e a IA monta a trilha
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                Descreva o contexto da sua realidade, o que tem dificultado a gestão de projetos e aonde quer chegar. O Tom reorganiza os módulos para o seu momento.
              </p>

              {!canAdapt && (
                <div
                  role="status"
                  aria-live="polite"
                  className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 text-sm text-brand-accent mb-4"
                >
                  ⏳ Você já adaptou sua trilha gratuitamente nos últimos {status?.cooldownDays ?? 15} dias.
                  {nextDate ? (
                    <>
                      {' '}
                      Nova adaptação disponível em <strong>{nextDate}</strong>.
                    </>
                  ) : (
                    <>
                      {' '}
                      Faltam <strong>{status?.daysRemaining} dia(s)</strong> para liberar.
                    </>
                  )}
                </div>
              )}

              <label
                htmlFor="adapt-context"
                className="block text-sm font-bold text-brand-text mb-2"
              >
                Sua realidade, dores e objetivos
              </label>

              <textarea
                id="adapt-context"
                className="w-full rounded-2xl border-2 border-gray-200 bg-cream p-4 text-sm text-brand-text placeholder:text-gray-500 resize-none focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                rows={5}
                placeholder="Ex.: Somos um time de 6 pessoas, lançando o primeiro produto. Temos muitas ideias, pouca evidência e dificuldade de priorizar. Quero aprender a validar hipóteses e organizar um roadmap."
                maxLength={MAX_CONTEXT}
                value={context}
                onChange={(e) => {
                  setContext(e.target.value);
                  if (aiError) setAiError('');
                }}
                disabled={!canAdapt || aiMutation.isPending}
                aria-describedby="prompt-hint prompt-counter adapt-ai-error"
                aria-invalid={aiError ? true : undefined}
              />

              <div className="flex items-center justify-between gap-2 mt-2 mb-4">
                <p id="prompt-hint" className="text-xs text-gray-600">
                  Dica: cite tamanho do time, estágio e prazo.
                </p>
                <span
                  id="prompt-counter"
                  className={`text-xs font-semibold ${
                    context.length > MAX_CONTEXT * 0.9 ? 'text-brand-700' : 'text-gray-600'
                  }`}
                >
                  {context.length}/{MAX_CONTEXT}
                </span>
              </div>

              {aiError && (
                <p
                  id="adapt-ai-error"
                  role="alert"
                  aria-live="polite"
                  className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 mb-4"
                >
                  {aiError}
                </p>
              )}
            </div>

            <Button
              type="button"
              size="md"
              className="w-full"
              disabled={!canAdapt || trimmedLength === 0 || context.length > MAX_CONTEXT}
              isLoading={aiMutation.isPending}
              onClick={handleAdaptAi}
            >
              {aiMutation.isPending ? 'Gerando trilha com IA…' : 'Adaptar trilha →'}
            </Button>
          </Card>
        </div>
      )}

      {/* Specialist confirmation Dialog (Radix UI with focus trap + Esc) */}
      <DialogModal
        open={specialistDialogOpen}
        onClose={() => setSpecialistDialogOpen(false)}
        title="Solicitação enviada! 🎉"
        description="Recebemos seu pedido de consultoria com especialista."
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {specialistInfo?.message ??
              'Em breve você receberá instruções detalhadas por e-mail.'}
          </p>
          {specialistInfo?.email && (
            <div className="bg-peach border border-brand-200 rounded-2xl px-4 py-3">
              <p className="text-xs text-brand-accent font-semibold mb-0.5">
                E-mail de contato cadastrado
              </p>
              <p className="text-sm font-bold text-brand-700">{specialistInfo.email}</p>
            </div>
          )}
          <Button
            type="button"
            size="md"
            className="w-full"
            onClick={() => setSpecialistDialogOpen(false)}
          >
            Entendido
          </Button>
        </div>
      </DialogModal>
    </div>
  );
}
