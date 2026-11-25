import { OnboardingStep, type UserProfile } from '../domain/index.js';
import { UserModel, type UserDocument } from '../models/User.js';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
  onboardingStep: OnboardingStep;
  activeTrailId?: string;
  createdAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  profile?: Partial<UserProfile>;
}

function mapUser(doc: UserDocument): UserEntity {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    profile: {
      jobTitle: doc.profile?.jobTitle,
      startupStage: doc.profile?.startupStage,
      learningStyle: doc.profile?.learningStyle,
      avatarUrl: doc.profile?.avatarUrl,
    },
    onboardingStep: doc.onboardingStep,
    activeTrailId: doc.activeTrailId?.toString(),
    createdAt: doc.createdAt,
  };
}

export class UserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? mapUser(doc) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).exec();
    return doc ? mapUser(doc) : null;
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const doc = await UserModel.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      onboardingStep: OnboardingStep.Diagnostic,
    });
    return mapUser(doc);
  }

  async updateOnboarding(
    userId: string,
    data: { onboardingStep: OnboardingStep; activeTrailId?: string },
  ): Promise<UserEntity | null> {
    const update: Record<string, unknown> = { onboardingStep: data.onboardingStep };
    if (data.activeTrailId) {
      update.activeTrailId = data.activeTrailId;
    }
    const doc = await UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true }).exec();
    return doc ? mapUser(doc) : null;
  }

  async setActiveTrail(userId: string, trailId: string): Promise<UserEntity | null> {
    const doc = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { activeTrailId: trailId } },
      { new: true },
    ).exec();
    return doc ? mapUser(doc) : null;
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserEntity | null> {
    const setFields: Record<string, unknown> = {};
    if (input.name !== undefined) {
      setFields.name = input.name;
    }
    if (input.email !== undefined) {
      setFields.email = input.email.toLowerCase();
    }
    if (input.profile) {
      if (input.profile.jobTitle !== undefined) {
        setFields['profile.jobTitle'] = input.profile.jobTitle;
      }
      if (input.profile.startupStage !== undefined) {
        setFields['profile.startupStage'] = input.profile.startupStage;
      }
      if (input.profile.learningStyle !== undefined) {
        setFields['profile.learningStyle'] = input.profile.learningStyle;
      }
      if (input.profile.avatarUrl !== undefined) {
        setFields['profile.avatarUrl'] = input.profile.avatarUrl;
      }
    }

    const doc = await UserModel.findByIdAndUpdate(userId, { $set: setFields }, { new: true }).exec();
    return doc ? mapUser(doc) : null;
  }
}
