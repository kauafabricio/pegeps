import {
  TrailAdaptationModel,
  type TrailAdaptationDocument,
} from '../models/TrailAdaptation.js';

export interface TrailAdaptationEntity {
  id: string;
  userId: string;
  context: string;
  resultTrailId: string;
  createdAt: Date;
}

function mapAdaptation(doc: TrailAdaptationDocument): TrailAdaptationEntity {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    context: doc.context,
    resultTrailId: doc.resultTrailId.toString(),
    createdAt: doc.createdAt,
  };
}

export class TrailAdaptationRepository {
  async findLatestByUserId(userId: string): Promise<TrailAdaptationEntity | null> {
    const doc = await TrailAdaptationModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
    return doc ? mapAdaptation(doc) : null;
  }

  async create(input: {
    userId: string;
    context: string;
    resultTrailId: string;
  }): Promise<TrailAdaptationEntity> {
    const doc = await TrailAdaptationModel.create({
      userId: input.userId,
      context: input.context,
      resultTrailId: input.resultTrailId,
    });
    return mapAdaptation(doc);
  }
}
