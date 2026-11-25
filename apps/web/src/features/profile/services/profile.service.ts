import { http, uploadForm } from '@/lib/http';
import type { AuthUser } from '@/providers/AuthProvider';

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  jobTitle?: string;
  startupStage?: string;
  learningStyle?: string;
}

export const profileService = {
  get: () => http.get<{ user: AuthUser }>('/users/me'),
  update: (data: UpdateProfileInput) => http.patch<{ user: AuthUser }>('/users/me', data),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return uploadForm<{ user: AuthUser }>('/users/me/avatar', fd);
  },
};
