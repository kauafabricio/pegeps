import { Schema, model, type Document, type Types } from 'mongoose';

export interface AssessmentOptionDoc {
  id: string;
  text: string;
}

export interface AssessmentQuestionDoc {
  id: string;
  statement: string;
  conceptId: string;
  options: AssessmentOptionDoc[];
  correctOptionId: string;
  explanation: string;
}

export interface AssessmentVariantDoc {
  variantId: string;
  questions: AssessmentQuestionDoc[];
}

export interface AssessmentBankDocument extends Document {
  _id: Types.ObjectId;
  moduleId: Types.ObjectId;
  variants: AssessmentVariantDoc[];
}

const optionSchema = new Schema<AssessmentOptionDoc>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const questionSchema = new Schema<AssessmentQuestionDoc>(
  {
    id: { type: String, required: true },
    statement: { type: String, required: true },
    conceptId: { type: String, required: true },
    options: { type: [optionSchema], required: true },
    correctOptionId: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

const variantSchema = new Schema<AssessmentVariantDoc>(
  {
    variantId: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false },
);

const assessmentBankSchema = new Schema<AssessmentBankDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, unique: true },
    variants: { type: [variantSchema], required: true },
  },
  { collection: 'assessment_banks' },
);

export const AssessmentBankModel = model<AssessmentBankDocument>(
  'AssessmentBank',
  assessmentBankSchema,
);
