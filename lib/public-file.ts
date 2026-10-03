import { stat } from 'node:fs/promises';
import path from 'node:path';

/** Size in bytes of a file served from public/, or null when it isn't there. Read at build time. */
export async function publicFileSize(urlPath: string): Promise<number | null> {
  try {
    const file = await stat(path.join(process.cwd(), 'public', urlPath));
    return file.isFile() ? file.size : null;
  } catch {
    return null;
  }
}
