import { Schema, model, type Document, type Types } from 'mongoose';

export interface ProgressDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  completedModuleIds: Types.ObjectId[];
  updatedAt: Date;
}

const progressSchema = new Schema<ProgressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    completedModuleIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
      default: [],
      required: true,
    },
  },
  {
    collection: 'progress',
    timestamps: { createdAt: false, updatedAt: true },
  },
);

export const ProgressModel = model<ProgressDocument>('Progress', progressSchema);
