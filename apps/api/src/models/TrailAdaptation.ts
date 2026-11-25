import { Schema, model, type Document, type Types } from 'mongoose';

export interface TrailAdaptationDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  context: string;
  resultTrailId: Types.ObjectId;
  createdAt: Date;
}

const trailAdaptationSchema = new Schema<TrailAdaptationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    context: { type: String, required: true },
    resultTrailId: { type: Schema.Types.ObjectId, ref: 'Trail', required: true },
  },
  {
    collection: 'trail_adaptations',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

trailAdaptationSchema.index({ userId: 1, createdAt: -1 });

export const TrailAdaptationModel = model<TrailAdaptationDocument>(
  'TrailAdaptation',
  trailAdaptationSchema,
);
