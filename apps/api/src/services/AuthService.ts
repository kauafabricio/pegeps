import type { OnboardingStep, UserProfile } from '../domain/index.js';
import { ConflictError, UnauthorizedError } from '../errors/AppError.js';
import type { UserEntity, UserRepository } from '../repositories/UserRepository.js';
import { signAuthToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  onboardingStep: OnboardingStep;
  activeTrailId?: string;
  createdAt: Date;
}

export function toPublicUser(user: UserEntity): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
    onboardingStep: user.onboardingStep,
    activeTrailId: user.activeTrailId,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  async register(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Já existe uma conta cadastrada com este e-mail.', 'EMAIL_IN_USE');
    }

    const passwordHash = await hashPassword(input.password);
    const created = await this.userRepo.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = signAuthToken(created.id);
    return { user: toPublicUser(created), token };
  }

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ user: PublicUser; token: string }> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
    }

    const matches = await verifyPassword(input.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedError('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
    }

    const token = signAuthToken(user.id);
    return { user: toPublicUser(user), token };
  }

  async getCurrentUser(userId: string): Promise<PublicUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedError('Usuário da sessão não encontrado.');
    }
    return toPublicUser(user);
  }
}
