import type { LearningStyle, StartupStage } from '../domain/index.js';
import { ConflictError, NotFoundError } from '../errors/AppError.js';
import type { UserRepository } from '../repositories/UserRepository.js';
import { toPublicUser, type PublicUser } from './AuthService.js';
import type { IStorageService, UploadFileInput } from './StorageService.js';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  jobTitle?: string;
  startupStage?: StartupStage;
  learningStyle?: LearningStyle;
}

export class ProfileService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly storageService: IStorageService,
  ) {}

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado.');
    }
    return toPublicUser(user);
  }

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<PublicUser> {
    const current = await this.userRepo.findById(userId);
    if (!current) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    if (payload.email && payload.email.toLowerCase() !== current.email) {
      const existing = await this.userRepo.findByEmail(payload.email);
      if (existing && existing.id !== userId) {
        throw new ConflictError('Este e-mail já está em uso por outra conta.', 'EMAIL_IN_USE');
      }
    }

    const updated = await this.userRepo.updateProfile(userId, {
      name: payload.name,
      email: payload.email,
      profile: {
        jobTitle: payload.jobTitle,
        startupStage: payload.startupStage,
        learningStyle: payload.learningStyle,
      },
    });

    if (!updated) {
      throw new NotFoundError('Usuário não encontrado.');
    }
    return toPublicUser(updated);
  }

  async uploadAvatar(userId: string, file: UploadFileInput): Promise<PublicUser> {
    const current = await this.userRepo.findById(userId);
    if (!current) {
      throw new NotFoundError('Usuário não encontrado.');
    }

    const previousAvatarUrl = current.profile.avatarUrl;
    const avatarUrl = await this.storageService.saveAvatar(userId, file);

    const updated = await this.userRepo.updateProfile(userId, {
      profile: { avatarUrl },
    });

    if (previousAvatarUrl && previousAvatarUrl !== avatarUrl) {
      await this.storageService.deleteByUrl(previousAvatarUrl);
    }

    if (!updated) {
      throw new NotFoundError('Usuário não encontrado.');
    }
    return toPublicUser(updated);
  }
}
