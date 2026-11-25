import type { Concept } from '../domain/index.js';
import { ModuleModel, type ModuleDocument } from '../models/Module.js';

export interface ModuleEntity {
  id: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  concepts: Concept[];
}

function mapModule(doc: ModuleDocument): ModuleEntity {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    order: doc.order,
    concepts: doc.concepts.map((c) => ({ id: c.id, name: c.name })),
  };
}

export class ModuleRepository {
  async findAllOrdered(): Promise<ModuleEntity[]> {
    const docs = await ModuleModel.find().sort({ order: 1 }).exec();
    return docs.map(mapModule);
  }

  async findById(id: string): Promise<ModuleEntity | null> {
    const doc = await ModuleModel.findById(id).exec();
    return doc ? mapModule(doc) : null;
  }

  async findByIds(ids: string[]): Promise<ModuleEntity[]> {
    const docs = await ModuleModel.find({ _id: { $in: ids } }).exec();
    return docs.map(mapModule);
  }

  async findBySlug(slug: string): Promise<ModuleEntity | null> {
    const doc = await ModuleModel.findOne({ slug }).exec();
    return doc ? mapModule(doc) : null;
  }
}
