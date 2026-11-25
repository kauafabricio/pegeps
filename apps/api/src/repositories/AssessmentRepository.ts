import {
  AssessmentAttemptModel,
  type AssessmentAttemptDocument,
  type AttemptAnswerDoc,
} from '../models/AssessmentAttempt.js';
import {
  AssessmentBankModel,
  type AssessmentBankDocument,
  type AssessmentVariantDoc,
} from '../models/AssessmentBank.js';

export interface AssessmentBankEntity {
  id: string;
  moduleId: string;
  variants: AssessmentVariantDoc[];
}

export interface AssessmentAttemptEntity {
  id: string;
  userId: string;
  moduleId: string;
  variantId: string;
  answers: AttemptAnswerDoc[];
  correctCount: number;
  passed: boolean;
  createdAt: Date;
}

export interface CreateAttemptInput {
  userId: string;
  moduleId: string;
  variantId: string;
  answers: AttemptAnswerDoc[];
  correctCount: number;
  passed: boolean;
}

function mapBank(doc: AssessmentBankDocument): AssessmentBankEntity {
  return {
    id: doc._id.toString(),
    moduleId: doc.moduleId.toString(),
    variants: doc.variants.map((v) => ({
      variantId: v.variantId,
      questions: v.questions.map((q) => ({
        id: q.id,
        statement: q.statement,
        conceptId: q.conceptId,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
        correctOptionId: q.correctOptionId,
        explanation: q.explanation,
      })),
    })),
  };
}

function mapAttempt(doc: AssessmentAttemptDocument): AssessmentAttemptEntity {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    moduleId: doc.moduleId.toString(),
    variantId: doc.variantId,
    answers: doc.answers.map((a) => ({
      questionId: a.questionId,
      selectedOptionId: a.selectedOptionId,
    })),
    correctCount: doc.correctCount,
    passed: doc.passed,
    createdAt: doc.createdAt,
  };
}

export class AssessmentRepository {
  async findBankByModuleId(moduleId: string): Promise<AssessmentBankEntity | null> {
    const doc = await AssessmentBankModel.findOne({ moduleId }).exec();
    return doc ? mapBank(doc) : null;
  }

  async findAttemptsByUserAndModule(
    userId: string,
    moduleId: string,
  ): Promise<AssessmentAttemptEntity[]> {
    const docs = await AssessmentAttemptModel.find({ userId, moduleId })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map(mapAttempt);
  }

  async createAttempt(input: CreateAttemptInput): Promise<AssessmentAttemptEntity> {
    const doc = await AssessmentAttemptModel.create({
      userId: input.userId,
      moduleId: input.moduleId,
      variantId: input.variantId,
      answers: input.answers,
      correctCount: input.correctCount,
      passed: input.passed,
    });
    return mapAttempt(doc);
  }
}
