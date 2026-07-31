import { differenceInCalendarDays, format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

export function nowIso(): string {
  return new Date().toISOString();
}

export function formatFriendlyDate(iso: string): string {
  const date = parseISO(iso);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'h:mm a');
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function daysBetween(a: string, b: string): number {
  return Math.abs(differenceInCalendarDays(parseISO(a), parseISO(b)));
}

export function dayKey(iso: string = nowIso()): string {
  return format(parseISO(iso), 'yyyy-MM-dd');
}
