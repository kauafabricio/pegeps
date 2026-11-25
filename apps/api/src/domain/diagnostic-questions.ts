import type { DiagnosticQuestion } from '@pegeps/domain';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'diag-mvp',
    conceptId: 'mvp',
    statement: 'Qual é o principal objetivo de um MVP em uma startup?',
    options: [
      { id: 'a', text: 'Testar uma hipótese importante com o menor esforço necessário.' },
      { id: 'b', text: 'Lançar todas as funcionalidades para competir com empresas maduras.' },
      { id: 'c', text: 'Eliminar qualquer risco antes de conversar com clientes.' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'diag-validacao',
    conceptId: 'validacao-hipoteses',
    statement:
      'Sua equipe acredita que pequenas empresas pagariam pela solução. Como testar essa hipótese?',
    options: [
      { id: 'a', text: 'Definir um experimento com clientes e um critério de sucesso.' },
      { id: 'b', text: 'Pedir a opinião da equipe e seguir com a ideia mais votada.' },
      { id: 'c', text: 'Aumentar o número de funcionalidades antes de ouvir clientes.' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'diag-priorizacao',
    conceptId: 'rice',
    statement: 'Há muitas ideias e pouco tempo. O que deve orientar a escolha do próximo teste?',
    options: [
      { id: 'a', text: 'Escolher a ideia mais fácil, mesmo sem relação com o objetivo.' },
      { id: 'b', text: 'Construir a funcionalidade pedida pela pessoa mais influente.' },
      { id: 'c', text: 'Comparar impacto, evidências e esforço em relação ao objetivo.' },
    ],
    correctOptionId: 'c',
  },
];
