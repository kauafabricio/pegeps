import type { DiagnosticAnswer } from '../domain/index.js';
import {
  DiagnosticResultModel,
  type CorrectByConceptDoc,
  type DiagnosticResultDocument,
} from '../models/DiagnosticResult.js';

export interface DiagnosticResultEntity {
  id: string;
  userId: string;
  answers: DiagnosticAnswer[];
  correctByConcept: CorrectByConceptDoc;
  recommendedTrailId: string;
  createdAt: Date;
}

export interface CreateDiagnosticResultInput {
  userId: string;
  answers: DiagnosticAnswer[];
  correctByConcept: CorrectByConceptDoc;
  recommendedTrailId: string;
}

function mapDiagnostic(doc: DiagnosticResultDocument): DiagnosticResultEntity {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    answers: doc.answers.map((a) => ({
      questionId: a.questionId,
      selectedOptionId: a.selectedOptionId,
    })),
    correctByConcept: {
      mvp: doc.correctByConcept.mvp,
      validacao: doc.correctByConcept.validacao,
      priorizacao: doc.correctByConcept.priorizacao,
    },
    recommendedTrailId: doc.recommendedTrailId.toString(),
    createdAt: doc.createdAt,
  };
}

export class DiagnosticRepository {
  async create(input: CreateDiagnosticResultInput): Promise<DiagnosticResultEntity> {
    const doc = await DiagnosticResultModel.create({
      userId: input.userId,
      answers: input.answers,
      correctByConcept: input.correctByConcept,
      recommendedTrailId: input.recommendedTrailId,
    });
    return mapDiagnostic(doc);
  }

  async findLatestByUserId(userId: string): Promise<DiagnosticResultEntity | null> {
    const doc = await DiagnosticResultModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
    return doc ? mapDiagnostic(doc) : null;
  }
}
