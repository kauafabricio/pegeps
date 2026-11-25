import { Schema, model, type Document, type Types } from 'mongoose';
import { TrailKind } from '../domain/index.js';

export interface TrailDocument extends Document {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  kind: TrailKind;
  ownerId?: Types.ObjectId;
  moduleIds: Types.ObjectId[];
  firstStep: string;
  createdAt: Date;
}

const trailSchema = new Schema<TrailDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    kind: { type: String, enum: Object.values(TrailKind), required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    moduleIds: { type: [{ type: Schema.Types.ObjectId, ref: 'Module' }], required: true },
    firstStep: { type: String, required: true },
  },
  {
    collection: 'trails',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const TrailModel = model<TrailDocument>('Trail', trailSchema);
