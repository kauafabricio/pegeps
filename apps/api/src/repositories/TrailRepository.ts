import { TrailKind } from '../domain/index.js';
import { TrailModel, type TrailDocument } from '../models/Trail.js';

export interface TrailEntity {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: TrailKind;
  ownerId?: string;
  moduleIds: string[];
  firstStep: string;
  createdAt: Date;
}

export interface CreateTrailInput {
  slug: string;
  title: string;
  description: string;
  kind: TrailKind;
  ownerId?: string;
  moduleIds: string[];
  firstStep: string;
}

function mapTrail(doc: TrailDocument): TrailEntity {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    kind: doc.kind,
    ownerId: doc.ownerId?.toString(),
    moduleIds: doc.moduleIds.map((id) => id.toString()),
    firstStep: doc.firstStep,
    createdAt: doc.createdAt,
  };
}

export class TrailRepository {
  async findById(id: string): Promise<TrailEntity | null> {
    const doc = await TrailModel.findById(id).exec();
    return doc ? mapTrail(doc) : null;
  }

  async findBySlug(slug: string): Promise<TrailEntity | null> {
    const doc = await TrailModel.findOne({ slug }).exec();
    return doc ? mapTrail(doc) : null;
  }

  async create(input: CreateTrailInput): Promise<TrailEntity> {
    const doc = await TrailModel.create({
      slug: input.slug,
      title: input.title,
      description: input.description,
      kind: input.kind,
      ownerId: input.ownerId,
      moduleIds: input.moduleIds,
      firstStep: input.firstStep,
    });
    return mapTrail(doc);
  }
}
