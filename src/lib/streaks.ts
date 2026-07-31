import { dayKey } from './dates';

/**
 * Given an array of ISO timestamps for activity on distinct days, compute the
 * current consecutive-day streak (ending today or yesterday) and the longest
 * streak on record.
 */
export function computeStreak(activityIsoDates: string[]): { current: number; longest: number } {
  if (activityIsoDates.length === 0) return { current: 0, longest: 0 };

  const uniqueDayKeys = Array.from(new Set(activityIsoDates.map((d) => dayKey(d)))).sort();
  const dayNumbers = uniqueDayKeys.map((k) => Math.floor(new Date(`${k}T00:00:00Z`).getTime() / 86400000));

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dayNumbers.length; i++) {
    if (dayNumbers[i] - dayNumbers[i - 1] === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  const todayNum = Math.floor(Date.now() / 86400000);
  const lastDay = dayNumbers[dayNumbers.length - 1];
  let current = 0;
  if (lastDay === todayNum || lastDay === todayNum - 1) {
    current = 1;
    for (let i = dayNumbers.length - 1; i > 0; i--) {
      if (dayNumbers[i] - dayNumbers[i - 1] === 1) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return { current, longest };
}
