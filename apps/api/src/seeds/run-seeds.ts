import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { CATALOG_MODULES, TrailKind } from '../domain/index.js';
import { AssessmentBankModel } from '../models/AssessmentBank.js';
import { MaterialModel } from '../models/Material.js';
import { ModuleModel } from '../models/Module.js';
import { TrailModel } from '../models/Trail.js';
import { buildSeedAssessmentBanks } from './assessment-banks.js';
import { SEED_MATERIALS } from './materials.js';

interface SeedTrailFileItem {
  slug: string;
  title: string;
  description: string;
  kind: TrailKind;
  firstStep: string;
  moduleSlugs: string[];
}

async function runSeeds(): Promise<void> {
  await connectDatabase();
  console.info('Conectado ao MongoDB para executar seeds...');

  // 1. Módulos do catálogo
  const moduleIdBySlug = new Map<string, string>();
  for (const mod of CATALOG_MODULES) {
    const saved = await ModuleModel.findOneAndUpdate(
      { slug: mod.slug },
      {
        $set: {
          title: mod.title,
          description: mod.description,
          order: mod.order,
          concepts: mod.concepts,
        },
      },
      { upsert: true, new: true },
    ).exec();
    moduleIdBySlug.set(mod.slug, saved._id.toString());
  }
  console.info(`Módulos sincronizados: ${moduleIdBySlug.size}`);

  // 2. Trilhas (padrão + 8 diagnósticas)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rawTrails = await fs.readFile(path.join(__dirname, 'diagnostic-trails.json'), 'utf-8');
  const seedTrails = JSON.parse(rawTrails) as SeedTrailFileItem[];

  for (const trail of seedTrails) {
    const moduleIds = trail.moduleSlugs.map((slug) => {
      const id = moduleIdBySlug.get(slug);
      if (!id) {
        throw new Error(`Slug de módulo não encontrado na trilha ${trail.slug}: ${slug}`);
      }
      return id;
    });

    await TrailModel.findOneAndUpdate(
      { slug: trail.slug },
      {
        $set: {
          title: trail.title,
          description: trail.description,
          kind: trail.kind,
          firstStep: trail.firstStep,
          moduleIds,
        },
      },
      { upsert: true, new: true },
    ).exec();
  }
  console.info(`Trilhas sincronizadas: ${seedTrails.length}`);

  // 3. Materiais de estudo (idempotente: limpa e reinsere materiais de catálogo)
  await MaterialModel.deleteMany({}).exec();
  const materialsToInsert = SEED_MATERIALS.map((mat) => {
    const moduleId = moduleIdBySlug.get(mat.moduleSlug);
    if (!moduleId) {
      throw new Error(`Slug de módulo inválido no material: ${mat.moduleSlug}`);
    }
    return {
      moduleId,
      conceptId: mat.conceptId,
      type: mat.type,
      title: mat.title,
      url: mat.url,
      author: mat.author,
      learningStyles: mat.learningStyles,
    };
  });
  await MaterialModel.insertMany(materialsToInsert);
  console.info(`Materiais inseridos: ${materialsToInsert.length}`);

  // 4. Bancos de avaliação (10 variantes × 10 questões por módulo)
  const banks = buildSeedAssessmentBanks();
  for (const bank of banks) {
    const moduleId = moduleIdBySlug.get(bank.moduleSlug);
    if (!moduleId) {
      throw new Error(`Slug de módulo inválido no banco de questões: ${bank.moduleSlug}`);
    }
    await AssessmentBankModel.findOneAndUpdate(
      { moduleId },
      { $set: { variants: bank.variants } },
      { upsert: true, new: true },
    ).exec();
  }
  console.info(`Bancos de avaliação sincronizados: ${banks.length} módulos × 10 variantes`);

  await disconnectDatabase();
  console.info('Seeds finalizados com sucesso!');
}

runSeeds().catch(async (err) => {
  console.error('Erro ao executar seeds:', err);
  await disconnectDatabase();
  process.exit(1);
});
