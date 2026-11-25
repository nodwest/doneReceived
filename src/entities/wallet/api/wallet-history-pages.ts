export function nextWalletCursor(
  next: string | null | undefined,
  seen: readonly (string | undefined)[],
) {
  return next && !seen.includes(next) ? next : undefined;
}

export function mergeWalletPages<T extends { id: string }>(
  pages: readonly { transactions: readonly T[] }[],
) {
  const byId = new Map<string, T>();
  for (const page of pages) {
    for (const item of page.transactions) {
      if (!byId.has(item.id)) byId.set(item.id, item);
    }
  }
  return [...byId.values()];
}
