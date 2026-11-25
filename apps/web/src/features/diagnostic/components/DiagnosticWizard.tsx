'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { PublicDiagnosticQuestion } from '../services/diagnostic.service';

interface DiagnosticWizardProps {
  questions: PublicDiagnosticQuestion[];
  onComplete: (answers: Array<{ questionId: string; selectedOptionId: string }>) => void;
  isSubmitting: boolean;
}

export function DiagnosticWizard({ questions, onComplete, isSubmitting }: DiagnosticWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [selected, setSelected] = useState<string | null>(null);

  const question = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionId: string) {
    setSelected(optionId);
  }

  function handleNext() {
    if (!selected) return;
    const updated = new Map(answers);
    updated.set(question.id, selected);
    setAnswers(updated);

    if (isLast) {
      const result = questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: updated.get(q.id) ?? '',
      }));
      onComplete(result);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <ProgressBar
        value={progress}
        label={`Pergunta ${currentIndex + 1} de ${questions.length}`}
      />

      <Card>
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Diagnóstico inicial</p>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{question.statement}</h2>

        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Opções de resposta">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected === opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors
                ${
                  selected === opt.id
                    ? 'border-brand-600 bg-brand-50 text-brand-800'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext} disabled={!selected} isLoading={isLast && isSubmitting}>
            {isLast ? 'Ver resultado' : 'Próxima pergunta'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
