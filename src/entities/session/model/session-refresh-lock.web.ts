/** В вебе несколько вкладок координируются Web Locks API. */
export async function withRefreshLock<T>(
  work: () => Promise<T>,
): Promise<T | null> {
  if (typeof navigator === 'undefined' || !navigator.locks) return work();
  return navigator.locks.request('donereceived:session-refresh', work);
}
