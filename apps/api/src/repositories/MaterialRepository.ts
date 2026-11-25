import { LearningStyle, MaterialType } from '../domain/index.js';
import { MaterialModel, type MaterialDocument } from '../models/Material.js';

export interface MaterialEntity {
  id: string;
  moduleId: string;
  conceptId?: string;
  type: MaterialType;
  title: string;
  url: string;
  author?: string;
  learningStyles: LearningStyle[];
}

function mapMaterial(doc: MaterialDocument): MaterialEntity {
  return {
    id: doc._id.toString(),
    moduleId: doc.moduleId.toString(),
    conceptId: doc.conceptId,
    type: doc.type,
    title: doc.title,
    url: doc.url,
    author: doc.author,
    learningStyles: [...doc.learningStyles],
  };
}

export class MaterialRepository {
  async findByFilter(filter: {
    moduleId: string;
    conceptId?: string;
    learningStyle?: LearningStyle;
  }): Promise<MaterialEntity[]> {
    const query: Record<string, unknown> = { moduleId: filter.moduleId };
    if (filter.conceptId) {
      query.conceptId = filter.conceptId;
    }
    if (filter.learningStyle) {
      query.learningStyles = filter.learningStyle;
    }

    const docs = await MaterialModel.find(query).limit(8).exec();
    return docs.map(mapMaterial);
  }
}
