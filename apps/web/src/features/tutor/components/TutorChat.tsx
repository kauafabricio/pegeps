'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MATERIAL_TYPE_ICONS } from '@/lib/constants';
import {
  tutorService,
  type TutorMaterial,
  type TutorOptionButton,
  type TutorStepResponse,
} from '../services/tutor.service';
import { extractErrorMessage } from '@/lib/utils';

interface ChatMessage {
  id: string;
  sender: 'tom' | 'user';
  text: string;
  materials?: TutorMaterial[];
}

interface TutorChatProps {
  onGoToAssessment: (moduleId?: string) => void;
  onActiveModuleChange?: (mod: TutorStepResponse['activeModule']) => void;
}

const MATERIAL_TYPE_LABELS: Record<string, string> = {
  video: 'Vídeo',
  article: 'Artigo',
  book: 'Livro',
  reading: 'Leitura',
  platform: 'Ferramenta',
  podcast: 'Podcast',
};

export function TutorChat({ onGoToAssessment, onActiveModuleChange }: TutorChatProps) {
  const [step, setStep] = useState<TutorStepResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    tutorService
      .start()
      .then((res) => {
        if (!active) return;
        setStep(res);
        onActiveModuleChange?.(res.activeModule);
        setMessages([
          {
            id: `tom-start-${Date.now()}`,
            sender: 'tom',
            text: res.message,
            materials: res.materials,
          },
        ]);
      })
      .catch((e) => {
        if (active) setError(extractErrorMessage(e));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [onActiveModuleChange]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length]);

  async function handleButton(btn: TutorOptionButton) {
    if (btn.action === 'go_to_assessment') {
      onGoToAssessment(step?.activeModule?.id);
      return;
    }

    setError('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: btn.label },
    ]);
    setIsLoading(true);
    try {
      const next = await tutorService.step({
        action: btn.action,
        learningStyle: btn.payload?.learningStyle,
        conceptId: btn.payload?.conceptId,
      });
      setStep(next);
      onActiveModuleChange?.(next.activeModule);
      setMessages((prev) => [
        ...prev,
        {
          id: `tom-${Date.now()}`,
          sender: 'tom',
          text: next.message,
          materials: next.materials,
        },
      ]);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !step) {
    return (
      <Card className="p-8 text-center" aria-live="polite">
        <p className="text-sm text-brand-accent animate-pulse">
          Iniciando sessão com o Tutor Tom…
        </p>
      </Card>
    );
  }

  if (error && !step) {
    return (
      <Card>
        <p className="text-red-700" role="alert">
          {error}
        </p>
      </Card>
    );
  }

  if (!step) return null;

  const responseButtons = step.options.filter((o) => o.action !== 'go_to_assessment');

  return (
    <Card className="p-0 overflow-hidden border border-brand-100 flex flex-col">
      {/* Chat Context Header */}
      <div className="px-6 py-4 border-b border-brand-100 flex items-center justify-between gap-4 bg-white">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
          Tutor Tom
        </span>
        {step.activeModule && (
          <span className="text-xs font-semibold text-gray-600">
            Módulo {step.activeModule.order}/{step.activeModule.totalModules} • {step.activeModule.title}
          </span>
        )}
      </div>

      {/* Message Thread */}
      <div
        className="p-6 flex flex-col gap-5 min-h-[300px] max-h-[520px] overflow-y-auto bg-white"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversa com o Tutor Tom"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === 'user' ? 'flex justify-end' : 'flex items-start gap-3'}
          >
            {msg.sender === 'tom' ? (
              <>
                <div
                  className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-black flex-shrink-0"
                  aria-hidden="true"
                >
                  <span className="w-5 h-5 rounded-full bg-white/30 block" />
                </div>
                <div className="flex-1 max-w-2xl">
                  <p className="text-xs font-bold text-brand-700 mb-1">Tom</p>
                  <div className="bg-cream border border-brand-100 rounded-2xl px-4 py-3 text-sm text-brand-text leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Material Cards */}
                  {msg.materials && msg.materials.length > 0 && (
                    <ul
                      className="mt-3 grid gap-2.5 sm:grid-cols-2"
                      aria-label="Materiais recomendados"
                    >
                      {msg.materials.map((mat, i) => (
                        <li key={mat.id ?? i}>
                          <a
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-2xl border border-brand-200 bg-peach/60 hover:bg-peach p-3.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
                            aria-label={`${MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}: ${mat.title}${mat.author ? `, por ${mat.author}` : ''} (abre em nova aba)`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-700 uppercase mb-1">
                              <span aria-hidden>{MATERIAL_TYPE_ICONS[mat.type] ?? '📌'}</span>
                              <span>{MATERIAL_TYPE_LABELS[mat.type] ?? mat.type}</span>
                              <span className="ml-auto" aria-hidden>↗</span>
                            </div>
                            <p className="text-sm font-bold text-brand-text leading-snug">
                              {mat.title}
                            </p>
                            {mat.author && (
                              <p className="text-xs text-gray-600 mt-0.5">{mat.author}</p>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-peach border border-brand-200 text-brand-text rounded-2xl px-4 py-3 text-sm font-medium max-w-md">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="px-6 pb-2 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {/* Interactive response buttons */}
      <div className="px-6 py-4 bg-cream/60 border-t border-brand-100 flex flex-col gap-3">
        {responseButtons.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Opções de resposta para o Tom">
            {responseButtons.map((btn) => (
              <Button
                key={btn.id}
                type="button"
                variant={btn.recommended ? 'primary' : 'secondary'}
                size="sm"
                isLoading={isLoading}
                onClick={() => handleButton(btn)}
              >
                {btn.recommended && <span aria-hidden>⭐</span>}
                {btn.label}
              </Button>
            ))}
          </div>
        )}

        {step.nodeId === 'trail_completed' && (
          <div className="flex gap-3 flex-wrap">
            <Link href="/adaptar-trilha">
              <Button size="sm">Adaptar trilha</Button>
            </Link>
            <Link href="/trilha">
              <Button variant="secondary" size="sm">
                Voltar para a trilha
              </Button>
            </Link>
          </div>
        )}

        {/* Área de texto desabilitada conforme decisão do projeto (interação por botões) */}
        <div
          aria-hidden="true"
          className="rounded-full border border-gray-200 bg-white/70 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500 select-none"
        >
          <span>Selecione uma das opções acima para conversar com o Tom</span>
          <span className="w-7 h-7 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center font-bold">
            ↑
          </span>
        </div>
      </div>
    </Card>
  );
}
