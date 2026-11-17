import { File, Paths } from 'expo-file-system';

/**
 * Межпроцессный lock обновления токенов. Expo TaskManager может поднять
 * отдельный headless runtime, поэтому JS-promise не защищает от второго
 * refresh. Файл создаётся атомарно (create без overwrite); протухший lock
 * после падения процесса снимается по возрасту.
 */
const LOCK_TTL_MS = 45_000;
const WAIT_MS = 3_000;
const RETRY_MS = 100;

const lockFile = new File(Paths.cache, 'donereceived-session-refresh.lock');

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function tryAcquire() {
  try {
    if (lockFile.exists) {
      const modified = lockFile.lastModified;
      if (!modified || Date.now() - modified > LOCK_TTL_MS) lockFile.delete();
    }
    lockFile.create({ intermediates: true });
    lockFile.write(String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

function release() {
  try {
    lockFile.delete();
  } catch {
    // Lock уже снят или файл исчез — освобождать нечего.
  }
}

/**
 * null — lock не удалось взять за отведённое время. Вызывающий не должен
 * считать это отказом сервера и не должен стирать сессию.
 */
export async function withRefreshLock<T>(
  work: () => Promise<T>,
): Promise<T | null> {
  const startedAt = Date.now();
  while (!tryAcquire()) {
    if (Date.now() - startedAt >= WAIT_MS) return null;
    await wait(RETRY_MS);
  }
  try {
    return await work();
  } finally {
    release();
  }
}
