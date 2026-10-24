/** '#4254AD' + 0.18 → 'rgba(66, 84, 173, 0.18)'. */
export function withAlpha(hex: string, alpha: number) {
  const channel = (start: number) => parseInt(hex.slice(start, start + 2), 16);
  return `rgba(${channel(1)}, ${channel(3)}, ${channel(5)}, ${alpha})`;
}
