import { http, uploadForm } from '@/lib/http';
import type { AuthUser } from '@/providers/AuthProvider';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  jobTitle?: string;
  startupStage?: string;
  learningStyle?: string;
}

export const profileService = {
  update: (payload: UpdateProfilePayload) =>
    http.patch<{ user: AuthUser }>('/profile', payload),

  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return uploadForm<{ user: AuthUser }>('/profile/avatar', fd, 'POST');
  },
};
