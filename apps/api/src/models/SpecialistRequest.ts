import { Schema, model, type Document, type Types } from 'mongoose';
import { SpecialistRequestStatus } from '../domain/index.js';

export interface SpecialistRequestDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  status: SpecialistRequestStatus;
  createdAt: Date;
}

const specialistRequestSchema = new Schema<SpecialistRequestDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(SpecialistRequestStatus),
      default: SpecialistRequestStatus.Pendente,
      required: true,
    },
  },
  {
    collection: 'specialist_requests',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const SpecialistRequestModel = model<SpecialistRequestDocument>(
  'SpecialistRequest',
  specialistRequestSchema,
);
