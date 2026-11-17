import { useState, type FormEvent } from 'react';
import { availability, mentor } from '@/data/demo';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { viewerTimeZone } from '@/shared/lib/format';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { Field, Input, Select } from '@/shared/ui/Field';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import type { AvailabilitySlot } from '@/types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MentorAvailability() {
  useDocumentTitle('Availability');
  const [slots, setSlots] = useState<AvailabilitySlot[]>(availability);
  const [limits, setLimits] = useState({ reviews: mentor.monthlyReviewLimit, sessions: mentor.monthlySessionLimit });
  const [error, setError] = useState('');

  const addSlot = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const slot = { id: crypto.randomUUID(), day: String(data.get('day')), start: String(data.get('start')), end: String(data.get('end')) };
    if (slot.end <= slot.start) {
      setError('The end time must be after the start time.');
      return;
    }
    setError('');
    setSlots(current => [...current, slot].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.start.localeCompare(b.start)));
    form.reset();
  };

  return (
    <>
      <PageHeader title="Availability" lede={`Students book one-on-one sessions in these weekly windows. Times are in ${viewerTimeZone()}.`}/>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card title="Weekly windows" className="self-start">
          {slots.length === 0 ? <p className="text-muted">No windows yet. Students can’t book sessions with you.</p> : (
            <List>
              {slots.map(slot => (
                <ListRow
                  key={slot.id}
                  title={slot.day}
                  meta={`${slot.start} to ${slot.end}`}
                  trailing={(
                    <Button variant="ghost" onClick={() => setSlots(current => current.filter(item => item.id !== slot.id))}>
                      Remove<span className="sr-only"> {slot.day} {slot.start}</span>
                    </Button>
                  )}
                />
              ))}
            </List>
          )}
          <form className="mt-5 grid gap-3 border-t border-line pt-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end" onSubmit={addSlot}>
            <Field label="Day" htmlFor="day"><Select id="day" name="day" defaultValue="Monday">{days.map(day => <option key={day}>{day}</option>)}</Select></Field>
            <Field label="From" htmlFor="start"><Input id="start" name="start" type="time" required defaultValue="18:00"/></Field>
            <Field label="To" htmlFor="end"><Input id="end" name="end" type="time" required defaultValue="19:00"/></Field>
            <Button type="submit" variant="outline">Add window</Button>
            {error && <p className="text-sm text-warn md:col-span-4" role="alert">{error}</p>}
          </form>
        </Card>
        <Card title="Monthly limits" className="self-start">
          <p className="mb-4 text-muted">Limits protect your volunteer time. You won’t be assigned more than this in a month.</p>
          <div className="grid gap-4">
            <Field label="Reviews per month" htmlFor="review-limit">
              <Input id="review-limit" type="number" min={0} max={20} value={limits.reviews} onChange={event => setLimits(current => ({ ...current, reviews: Number(event.target.value) }))}/>
            </Field>
            <Field label="Sessions per month" htmlFor="session-limit">
              <Input id="session-limit" type="number" min={0} max={20} value={limits.sessions} onChange={event => setLimits(current => ({ ...current, sessions: Number(event.target.value) }))}/>
            </Field>
          </div>
        </Card>
      </div>
    </>
  );
}
