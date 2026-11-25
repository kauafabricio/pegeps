import { Schema, model, type Document, type Types } from 'mongoose';

export interface AttemptAnswerDoc {
  questionId: string;
  selectedOptionId: string;
}

export interface AssessmentAttemptDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  moduleId: Types.ObjectId;
  variantId: string;
  answers: AttemptAnswerDoc[];
  correctCount: number;
  passed: boolean;
  createdAt: Date;
}

const attemptAnswerSchema = new Schema<AttemptAnswerDoc>(
  {
    questionId: { type: String, required: true },
    selectedOptionId: { type: String, required: true },
  },
  { _id: false },
);

const assessmentAttemptSchema = new Schema<AssessmentAttemptDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    variantId: { type: String, required: true },
    answers: { type: [attemptAnswerSchema], required: true },
    correctCount: { type: Number, required: true },
    passed: { type: Boolean, required: true },
  },
  {
    collection: 'assessment_attempts',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

assessmentAttemptSchema.index({ userId: 1, moduleId: 1, createdAt: 1 });

export const AssessmentAttemptModel = model<AssessmentAttemptDocument>(
  'AssessmentAttempt',
  assessmentAttemptSchema,
);
