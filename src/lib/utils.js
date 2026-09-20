export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Formats a duration in seconds as "1h 24m" / "24m" / "<1m", using the
// hour/minute abbreviations from i18n so it reads naturally in Bengali too.
export function formatDuration(totalSeconds, hourShort, minuteShort, underMinuteLabel) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0 && minutes === 0) return underMinuteLabel;
  if (hours === 0) return `${minutes}${minuteShort}`;
  if (minutes === 0) return `${hours}${hourShort}`;
  return `${hours}${hourShort} ${minutes}${minuteShort}`;
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10);
}

// Consecutive days with any activity, ending today. If nothing is logged
// today yet, counting starts from yesterday so a still-unbroken streak
// from previous days doesn't read as zero. `activity` is { "YYYY-MM-DD": count }.
export function computeStreak(activity) {
  const cursor = new Date();
  if (!activity[toDateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activity[toDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Longest run of consecutive active days anywhere in the history (the
// "best streak"). Same "YYYY-MM-DD" keys as computeStreak; the current
// streak is included, so best is never below it.
export function computeBestStreak(activity) {
  const days = Object.keys(activity)
    .filter((k) => activity[k])
    .map((k) => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10)))
    .sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  let prev = null;
  for (const day of days) {
    run = prev !== null && day - prev === 86400000 ? run + 1 : 1;
    if (run > best) best = run;
    prev = day;
  }
  return Math.max(best, computeStreak(activity));
}
