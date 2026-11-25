import { Schema, model, type Document, type Types } from 'mongoose';
import { LearningStyle, MaterialType } from '../domain/index.js';

export interface MaterialDocument extends Document {
  _id: Types.ObjectId;
  moduleId: Types.ObjectId;
  conceptId?: string;
  type: MaterialType;
  title: string;
  url: string;
  author?: string;
  learningStyles: LearningStyle[];
}

const materialSchema = new Schema<MaterialDocument>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
    conceptId: { type: String },
    type: { type: String, enum: Object.values(MaterialType), required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: String },
    learningStyles: {
      type: [{ type: String, enum: Object.values(LearningStyle) }],
      required: true,
    },
  },
  { collection: 'materials' },
);

materialSchema.index({ moduleId: 1, learningStyles: 1 });

export const MaterialModel = model<MaterialDocument>('Material', materialSchema);
