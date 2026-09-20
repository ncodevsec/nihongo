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
