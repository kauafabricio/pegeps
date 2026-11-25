import { Schema, model, type Document, type Types } from 'mongoose';
import { LearningStyle, OnboardingStep, StartupStage } from '../domain/index.js';

export interface UserProfileDoc {
  jobTitle?: string;
  startupStage?: StartupStage;
  learningStyle?: LearningStyle;
  avatarUrl?: string;
}

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  profile: UserProfileDoc;
  onboardingStep: OnboardingStep;
  activeTrailId?: Types.ObjectId;
  createdAt: Date;
}

const userProfileSchema = new Schema<UserProfileDoc>(
  {
    jobTitle: { type: String, trim: true },
    startupStage: { type: String, enum: Object.values(StartupStage) },
    learningStyle: { type: String, enum: Object.values(LearningStyle) },
    avatarUrl: { type: String },
  },
  { _id: false },
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: { type: userProfileSchema, default: (): UserProfileDoc => ({}) },
    onboardingStep: {
      type: String,
      enum: Object.values(OnboardingStep),
      default: OnboardingStep.Diagnostic,
      required: true,
    },
    activeTrailId: { type: Schema.Types.ObjectId, ref: 'Trail' },
  },
  {
    collection: 'users',
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const UserModel = model<UserDocument>('User', userSchema);
