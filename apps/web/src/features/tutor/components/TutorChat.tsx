'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MATERIAL_TYPE_ICONS } from '@/lib/constants';
import { tutorService, type TutorStepResponse } from '../services/tutor.service';
import { extractErrorMessage } from '@/lib/utils';
import type { TutorOptionButton } from '../types';

interface TutorChatProps {
  onGoToAssessment: () => void;
}

export function TutorChat({ onGoToAssessment }: TutorChatProps) {
  const [step, setStep] = useState<TutorStepResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    tutorService
      .start()
      .then((res) => {
        if (active) setStep(res);
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
  }, []);

  async function handleButton(btn: TutorOptionButton) {
    if (btn.action === 'go_to_assessment') {
      onGoToAssessment();
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const next = await tutorService.step({
        action: btn.action,
        learningStyle: btn.payload?.learningStyle,
        conceptId: btn.payload?.conceptId,
      });
      setStep(next);
    } catch (e) {
      setError(extractErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !step) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400" aria-live="polite">
        <span className="animate-spin text-2xl mr-2" aria-hidden>
          ⏳
        </span>
        Carregando Tutor Tom…
      </div>
    );
  }

  if (error && !step) {
    return (
      <Card>
        <p className="text-red-600" role="alert">
          {error}
        </p>
      </Card>
    );
  }

  if (!step) return null;

  return (
    <div
      className="flex flex-col gap-4 max-w-2xl mx-auto"
      aria-live="polite"
      aria-label="Tutor Tom"
    >
      <Card>
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-xl flex-shrink-0"
            aria-hidden
          >
            🤖
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-600 mb-1">Tutor Tom</p>
            <p className="text-gray-800 text-sm leading-relaxed">{step.message}</p>
          </div>
        </div>

        {step.materials && step.materials.length > 0 && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Materiais sugeridos
            </p>
            <ul className="flex flex-col gap-2">
              {step.materials.map((mat, i) => (
                <li key={mat.id ?? i}>
                  <a
                    href={mat.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-brand-700 hover:underline group"
                  >
                    <span aria-hidden>{MATERIAL_TYPE_ICONS[mat.type] ?? '📌'}</span>
                    <span className="group-hover:underline">
                      {mat.title}
                      {mat.author && <span className="text-gray-400 ml-1">— {mat.author}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {step.options.length > 0 && (
        <div className="flex flex-col gap-2">
          {step.options.map((btn) => (
            <Button
              key={btn.id}
              type="button"
              variant={btn.recommended ? 'primary' : 'secondary'}
              onClick={() => handleButton(btn)}
              isLoading={isLoading}
              className="w-full justify-start"
            >
              {btn.recommended && (
                <span aria-hidden className="mr-1">
                  ⭐
                </span>
              )}
              {btn.label}
            </Button>
          ))}
        </div>
      )}

      {step.nodeId === 'trail_completed' && (
        <div className="flex gap-3 flex-wrap">
          <Link href="/adaptar">
            <Button size="sm">Adaptar trilha</Button>
          </Link>
          <Link href="/trilha">
            <Button variant="secondary" size="sm">
              Voltar para a trilha
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
