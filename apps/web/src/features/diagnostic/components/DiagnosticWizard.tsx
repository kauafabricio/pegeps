'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { PublicDiagnosticQuestion } from '../services/diagnostic.service';

interface DiagnosticWizardProps {
  questions: PublicDiagnosticQuestion[];
  onComplete: (answers: Array<{ questionId: string; selectedOptionId: string }>) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

const CONCEPT_BADGE_LABELS: Record<string, string> = {
  mvp: 'CONCEITO • MVP',
  'validacao-hipoteses': 'CONCEITO • VALIDAÇÃO DE HIPÓTESES',
  rice: 'CONCEITO • PRIORIZAÇÃO',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function DiagnosticWizard({
  questions,
  onComplete,
  onBack,
  isSubmitting,
  submitError,
}: DiagnosticWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());

  const question = questions[currentIndex];
  const selected = answers.get(question.id) ?? null;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionId: string) {
    const updated = new Map(answers);
    updated.set(question.id, optionId);
    setAnswers(updated);
  }

  function handleNext() {
    if (!selected) return;
    if (isLast) {
      const result = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers.get(q.id) ?? '',
      }));
      onComplete(result);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
      {/* Left context column */}
      <div className="pt-2">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-text leading-tight mb-3">
          Vamos encontrar seu ponto de partida.
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          São três situações do dia a dia de uma startup. Responda com o que você sabe hoje.
        </p>
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 border border-brand-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-600">
            Diagnóstico • Seu conhecimento hoje
          </span>
          <span className="text-xs font-semibold text-gray-600">
            {currentIndex + 1} de {questions.length}
          </span>
        </div>

        <ProgressBar
          value={progress}
          segmented
          segments={questions.length}
          aria-label={`Pergunta ${currentIndex + 1} de ${questions.length}`}
          className="mb-6"
        />

        <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          {CONCEPT_BADGE_LABELS[question.conceptId] ?? 'CONCEITO'}
        </p>

        <h2
          id="question-heading"
          className="text-lg sm:text-xl font-bold text-brand-text mb-6 leading-snug"
        >
          {question.statement}
        </h2>

        <div
          role="radiogroup"
          aria-labelledby="question-heading"
          className="flex flex-col gap-3"
        >
          {question.options.map((opt, idx) => {
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 text-sm font-medium transition-all duration-150 min-h-[48px] flex items-center gap-3
                  ${
                    isSelected
                      ? 'border-brand-700 bg-peach text-brand-text'
                      : 'border-gray-200 bg-white hover:border-brand-300 text-brand-text'
                  }`}
              >
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0
                    ${
                      isSelected
                        ? 'bg-brand-700 text-white'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  aria-hidden
                >
                  {isSelected ? '✓' : OPTION_LETTERS[idx] ?? idx + 1}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-gray-600" aria-live="polite">
          {selected
            ? 'Sua resposta foi selecionada. O resumo aparece ao final.'
            : 'Selecione uma alternativa para continuar.'}
        </p>

        {submitError && (
          <p role="alert" aria-live="polite" className="mt-3 text-sm text-red-700 bg-red-50 rounded-2xl px-4 py-2">
            {submitError}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleBack} size="md">
            ← Voltar
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selected}
            isLoading={isLast && isSubmitting}
            size="md"
          >
            {isLast ? 'Ver resultado →' : 'Próxima pergunta →'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
