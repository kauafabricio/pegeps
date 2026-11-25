import { Schema, model, type Document, type Types } from 'mongoose';
import type { Concept } from '../domain/index.js';

export interface ModuleDocument extends Document {
  _id: Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  order: number;
  concepts: Concept[];
}

const conceptSchema = new Schema<Concept>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false },
);

const moduleSchema = new Schema<ModuleDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    concepts: { type: [conceptSchema], required: true },
  },
  { collection: 'modules' },
);

export const ModuleModel = model<ModuleDocument>('Module', moduleSchema);
