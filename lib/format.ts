import type { Period, YearMonth } from '@/content';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2023-11" → "Nov 2023" */
export function formatYearMonth(value: YearMonth): string {
  const [year, month] = value.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** "Nov 2023 – present" */
export function formatPeriod(period: Period): string {
  const end = period.end === 'present' ? 'present' : formatYearMonth(period.end);
  return `${formatYearMonth(period.start)} – ${end}`;
}

/** ["a", "b", "c"] → "a, b and c" */
export function joinList(items: string[], conjunction: 'and' | 'or' = 'and'): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
