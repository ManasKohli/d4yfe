// Date helpers. Date-only strings ("2026-11-16") are calendar dates; ISO timestamps are shown in the viewer's time zone.

const parseDay = (value: string) => {
  const [year = 1970, month = 1, day = 1] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Today's calendar date in the viewer's time zone, as "2026-11-16". */
export const todayLocal = (now = new Date()) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export const formatDay = (value: string) => parseDay(value).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

export const formatMonth = (value: string) => parseDay(value).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-CA', {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});

export const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');

/** Whole days from `from` to `to`, both date-only strings. */
export const daysBetween = (from: string, to: string) => Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86400000);

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;
