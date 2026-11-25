import { z } from 'zod';
import { generateGeminiJson } from '../config/gemini.js';
import type { ModuleEntity } from '../repositories/ModuleRepository.js';
import type { UserEntity } from '../repositories/UserRepository.js';

export interface AdaptTrailAiInput {
  user: UserEntity;
  context: string;
  remainingModules: ModuleEntity[];
}

export interface AdaptTrailAiOutput {
  title: string;
  description: string;
  moduleIds: string[];
}

export interface TrailAdapterAI {
  adaptTrail(input: AdaptTrailAiInput): Promise<AdaptTrailAiOutput>;
}

const aiTrailResponseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(400),
  moduleIds: z.array(z.string().min(1)).min(1),
});

export class GeminiTrailAdapterAI implements TrailAdapterAI {
  async adaptTrail(input: AdaptTrailAiInput): Promise<AdaptTrailAiOutput> {
    const prompt = this.buildPrompt(input.user, input.context, input.remainingModules);
    const remainingIdsSet = new Set(input.remainingModules.map((m) => m.id));

    return generateGeminiJson<AdaptTrailAiOutput>(prompt, (raw) => {
      const parsed = aiTrailResponseSchema.parse(raw);
      const seen = new Set<string>();

      for (const id of parsed.moduleIds) {
        if (!remainingIdsSet.has(id) || seen.has(id)) {
          throw new Error(`ID de módulo inválido retornado pela IA: ${id}`);
        }
        seen.add(id);
      }

      return parsed;
    });
  }

  private buildPrompt(
    user: UserEntity,
    context: string,
    remainingModules: ModuleEntity[],
  ): string {
    const profileSummary = {
      cargo: user.profile.jobTitle ?? 'Não informado',
      estagioStartup: user.profile.startupStage ?? 'Não informado',
      estiloEstudo: user.profile.learningStyle ?? 'Não informado',
    };

    const catalogPayload = remainingModules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      concepts: m.concepts.map((c) => c.name),
    }));

    return [
      'Você é um especialista em gestão de projetos em startups na plataforma Pegeps.',
      'Sua tarefa é ordenar e selecionar módulos DO CATÁLOGO abaixo (sem criar novos módulos nem alterar IDs) para atender à realidade e dores do usuário.',
      '',
      `Perfil do usuário: ${JSON.stringify(profileSummary)}`,
      `Contexto e dores do usuário: "${context}"`,
      '',
      `Módulos disponíveis (NÃO concluídos): ${JSON.stringify(catalogPayload)}`,
      '',
      'Regras estritas:',
      '1. Responda EXCLUSIVAMENTE com JSON válido no formato: {"title": string, "description": string, "moduleIds": string[]}.',
      '2. Use somente os IDs exatos listados em "Módulos disponíveis".',
      '3. Não repita IDs e inclua pelo menos 1 módulo (preferencialmente ordene os mais urgentes primeiro).',
      '4. Escreva title (até 80 chars) e description (até 250 chars) em português do Brasil, de forma clara e motivadora.',
    ].join('\n');
  }
}
