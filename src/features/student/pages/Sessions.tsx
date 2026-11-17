import { useState } from 'react';
import { bookable, sessions, student } from '@/data/demo';
import { sessionRules } from '@/data/portal';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { formatDateTime, viewerTimeZone } from '@/shared/lib/format';
import Badge from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import Card from '@/shared/ui/Card';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';
import StatList from '@/shared/ui/StatList';

export default function Sessions() {
  useDocumentTitle('Sessions');
  const [requested, setRequested] = useState<string[]>([]);
  const sorted = [...sessions].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <PageHeader title="Sessions" lede="Workshops, office hours, accountability groups, and one-on-one sessions in one calendar."/>
      <StatList label="Your sessions" stats={[
        { label: 'One-on-ones left', value: `${student.oneOnOnes.left} of ${student.oneOnOnes.total}` },
        { label: 'Upcoming', value: sessions.length },
        { label: 'Time zone', value: <span className="text-base font-medium">{viewerTimeZone()}</span> },
      ]}/>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Upcoming" className="self-start">
          {sorted.length === 0 ? <p className="text-muted">No sessions on your calendar.</p> : (
            <List>
              {sorted.map(session => (
                <ListRow
                  key={session.id}
                  title={session.title}
                  meta={`${formatDateTime(session.start)} · ${session.kind}`}
                  trailing={<Badge status={session.status} label={session.status === 'booked' ? 'Booked' : 'On your calendar'}/>}
                />
              ))}
            </List>
          )}
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">{sessionRules.reminders} {sessionRules.reschedule}</p>
        </Card>
        <Card title="Book a session" className="self-start">
          <List>
            {bookable.map(option => {
              const isRequested = requested.includes(option.id);
              return (
                <ListRow
                  key={option.id}
                  title={option.title}
                  meta={option.opens ?? `${option.minutes} minutes`}
                  trailing={option.opens ? <Badge status="upcoming" label="Not open"/> : (
                    <Button variant="outline" disabled={isRequested} onClick={() => setRequested(current => [...current, option.id])}>
                      {isRequested ? 'Requested' : 'Request a time'}
                    </Button>
                  )}
                />
              );
            })}
          </List>
        </Card>
      </div>
    </>
  );
}
