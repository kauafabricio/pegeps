import { SpecialistRequestStatus } from '../domain/index.js';
import {
  SpecialistRequestModel,
  type SpecialistRequestDocument,
} from '../models/SpecialistRequest.js';

export interface SpecialistRequestEntity {
  id: string;
  userId: string;
  status: SpecialistRequestStatus;
  createdAt: Date;
}

function mapRequest(doc: SpecialistRequestDocument): SpecialistRequestEntity {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

export class SpecialistRequestRepository {
  async create(userId: string): Promise<SpecialistRequestEntity> {
    const doc = await SpecialistRequestModel.create({
      userId,
      status: SpecialistRequestStatus.Pendente,
    });
    return mapRequest(doc);
  }
}
