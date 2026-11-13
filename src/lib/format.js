// Date helpers. Date-only strings ("2026-11-16") are calendar dates; ISO timestamps are shown in the viewer's time zone.

const parseDay = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day || 1);
};

export const formatDay = (value) => parseDay(value).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });

export const formatMonth = (value) => parseDay(value).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });

export const formatDateTime = (iso) => new Date(iso).toLocaleString('en-CA', {
  weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});

export const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');

/** Whole days from `from` to `to`, both date-only strings. */
export const daysBetween = (from, to) => Math.round((parseDay(to) - parseDay(from)) / 86400000);

export const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
