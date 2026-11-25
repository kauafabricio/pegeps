import { ProgressModel, type ProgressDocument } from '../models/Progress.js';

export interface ProgressEntity {
  id: string;
  userId: string;
  completedModuleIds: string[];
  updatedAt: Date;
}

function mapProgress(doc: ProgressDocument): ProgressEntity {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    completedModuleIds: doc.completedModuleIds.map((id) => id.toString()),
    updatedAt: doc.updatedAt,
  };
}

export class ProgressRepository {
  async findByUserId(userId: string): Promise<ProgressEntity | null> {
    const doc = await ProgressModel.findOne({ userId }).exec();
    return doc ? mapProgress(doc) : null;
  }

  async ensureForUser(userId: string): Promise<ProgressEntity> {
    const doc = await ProgressModel.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, completedModuleIds: [] } },
      { new: true, upsert: true },
    ).exec();
    return mapProgress(doc);
  }

  async markModuleCompleted(userId: string, moduleId: string): Promise<ProgressEntity> {
    const doc = await ProgressModel.findOneAndUpdate(
      { userId },
      { $addToSet: { completedModuleIds: moduleId } },
      { new: true, upsert: true },
    ).exec();
    return mapProgress(doc);
  }
}
