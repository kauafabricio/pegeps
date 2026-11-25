'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { AssessmentQuestion } from '../services/assessment.service';

interface AssessmentQuizProps {
  questions: AssessmentQuestion[];
  moduleTitle: string;
  onComplete: (answers: Array<{ questionId: string; selectedOptionId: string }>) => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function AssessmentQuiz({
  questions,
  moduleTitle,
  onComplete,
  onBack,
  isSubmitting,
  submitError,
}: AssessmentQuizProps) {
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
      {/* Left context column (PDF page 13) */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-bold text-brand-700 uppercase tracking-widest mb-1">
            Avaliação do módulo
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-text leading-tight mb-2">
            Transforme estudo em prática.
          </h1>
          <p className="text-sm font-semibold text-brand-text mb-1">{moduleTitle}</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Use o que aprendeu com o Tutor Tom para responder às perguntas deste módulo.
          </p>
        </div>

        <div className="bg-peach border border-brand-200 rounded-2xl p-4 text-xs">
          <p className="font-bold text-brand-text mb-1">ⓘ Seu progresso está preservado.</p>
          <p className="text-brand-accent leading-relaxed">
            Só a aprovação nesta avaliação libera o próximo módulo.
          </p>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 border border-brand-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-600">
            Avaliação • {moduleTitle}
          </span>
          <span className="text-xs font-semibold text-gray-600">
            {currentIndex + 1} de {questions.length}
          </span>
        </div>

        <ProgressBar
          value={progress}
          segmented
          segments={questions.length}
          aria-label={`Questão ${currentIndex + 1} de ${questions.length}`}
          className="mb-6"
        />

        <p className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">
          {moduleTitle} • {question.conceptName ?? question.conceptId.replace(/-/g, ' ')}
        </p>

        <h2
          id="question-heading"
          className="text-lg font-bold text-brand-text mb-6 leading-snug"
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
          Uma resposta por pergunta. Você pode voltar e revisar antes de finalizar.
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
            {isLast ? 'Finalizar avaliação →' : 'Próxima pergunta →'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
