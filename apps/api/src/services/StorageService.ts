import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface UploadFileInput {
  buffer: Buffer;
  mimeType: string;
}

export interface IStorageService {
  saveAvatar(userId: string, file: UploadFileInput): Promise<string>;
  deleteByUrl(url: string): Promise<void>;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export class LocalDiskStorageService implements IStorageService {
  private readonly avatarsDir: string;

  constructor(baseUploadsDir = path.resolve(process.cwd(), 'uploads')) {
    this.avatarsDir = path.join(baseUploadsDir, 'avatars');
  }

  async saveAvatar(userId: string, file: UploadFileInput): Promise<string> {
    await fs.mkdir(this.avatarsDir, { recursive: true });
    const ext = MIME_TO_EXT[file.mimeType] ?? 'png';
    const filename = `${userId}-${crypto.randomUUID()}.${ext}`;
    const fullPath = path.join(this.avatarsDir, filename);
    await fs.writeFile(fullPath, file.buffer);
    return `/uploads/avatars/${filename}`;
  }

  async deleteByUrl(url: string): Promise<void> {
    if (!url.startsWith('/uploads/avatars/')) {
      return;
    }
    const filename = path.basename(url);
    const fullPath = path.join(this.avatarsDir, filename);
    try {
      await fs.unlink(fullPath);
    } catch {
      // Arquivo antigo já removido ou inexistente; seguro ignorar.
    }
  }
}
