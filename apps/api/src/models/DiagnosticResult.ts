import { Schema, model, type Document, type Types } from 'mongoose';
import type { DiagnosticAnswer } from '../domain/index.js';

export interface CorrectByConceptDoc {
  mvp: boolean;
  validacao: boolean;
  priorizacao: boolean;
}

export interface DiagnosticResultDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  answers: DiagnosticAnswer[];
  correctByConcept: CorrectByConceptDoc;
  recommendedTrailId: Types.ObjectId;
  createdAt: Date;
}

const diagnosticAnswerSchema = new Schema<DiagnosticAnswer>(
  {
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, required: true },
  },
  { _id: false },
);

const correctByConceptSchema = new Schema<CorrectByConceptDoc>(
  {
    mvp: { type: Boolean, required: true },
    validacao: { type: Boolean, required: true },
    priorizacao: { type: Boolean, required: true },
  },
  { _id: false },
);

const diagnosticResultSchema = new Schema<DiagnosticResultDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answers: { type: [diagnosticAnswerSchema], required: true },
    correctByConcept: { type: correctByConceptSchema, required: true },
    recommendedTrailId: { type: Schema.Types.ObjectId, ref: 'Trail', required: true },
  },
  {
    collection: 'diagnostic_results',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const DiagnosticResultModel = model<DiagnosticResultDocument>(
  'DiagnosticResult',
  diagnosticResultSchema,
);
