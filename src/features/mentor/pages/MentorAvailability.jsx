import { useState } from 'react';
import { availability, mentor } from '@/data/demo.js';
import PageHeader from '@/shared/components/PageHeader.jsx';
import Panel from '@/shared/components/Panel.jsx';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle.js';
import { viewerTimeZone } from '@/shared/lib/format.js';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MentorAvailability() {
  useDocumentTitle('Availability');
  const [slots, setSlots] = useState(availability);
  const [limits, setLimits] = useState({ reviews: mentor.monthlyReviewLimit, sessions: mentor.monthlySessionLimit });

  const addSlot = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const slot = { id: crypto.randomUUID(), day: data.get('day'), start: data.get('start'), end: data.get('end') };
    if (slot.end <= slot.start) return;
    setSlots(current => [...current, slot].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day) || a.start.localeCompare(b.start)));
    event.currentTarget.reset();
  };

  return (
    <>
      <PageHeader eyebrow="MENTOR AREA" title="Availability" muted="and monthly limits." lede={`Students book one-on-one sessions in these weekly windows. Times are in ${viewerTimeZone()}.`}/>
      <div className="app-layout">
        <Panel title="Weekly windows">
          {slots.length === 0 ? <p className="muted-line">No windows yet. Students can’t book sessions with you.</p> : (
            <ul className="item-list">
              {slots.map(slot => (
                <li key={slot.id}>
                  <span>{slot.day}<small className="block">{slot.start} to {slot.end}</small></span>
                  <button className="text-button" type="button" onClick={() => setSlots(current => current.filter(item => item.id !== slot.id))}>Remove<span className="visually-hidden"> {slot.day} {slot.start}</span></button>
                </li>
              ))}
            </ul>
          )}
          <form className="inline-form" onSubmit={addSlot}>
            <div className="field"><label htmlFor="day">Day</label><select id="day" name="day" defaultValue="Monday">{days.map(day => <option key={day}>{day}</option>)}</select></div>
            <div className="field"><label htmlFor="start">From</label><input id="start" name="start" type="time" required defaultValue="18:00"/></div>
            <div className="field"><label htmlFor="end">To</label><input id="end" name="end" type="time" required defaultValue="19:00"/></div>
            <button className="button button-outline button-compact" type="submit">Add window</button>
          </form>
        </Panel>
        <Panel title="Monthly limits">
          <p className="body-text">Limits protect your volunteer time. You won’t be assigned more than this in a month.</p>
          <div className="form-stack">
            <div className="field field-row">
              <label htmlFor="review-limit">Reviews per month</label>
              <input id="review-limit" type="number" min={0} max={20} value={limits.reviews} onChange={event => setLimits(current => ({ ...current, reviews: Number(event.target.value) }))}/>
            </div>
            <div className="field field-row">
              <label htmlFor="session-limit">Sessions per month</label>
              <input id="session-limit" type="number" min={0} max={20} value={limits.sessions} onChange={event => setLimits(current => ({ ...current, sessions: Number(event.target.value) }))}/>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
