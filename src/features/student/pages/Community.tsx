import { useState } from 'react';
import { community } from '@/data/portal';
import { communityItems } from '@/data/program';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import { Button } from '@/shared/ui/Button';
import { buttonClass } from '@/shared/ui/buttonClass';
import Card from '@/shared/ui/Card';
import { List, ListRow } from '@/shared/ui/List';
import PageHeader from '@/shared/ui/PageHeader';

export default function Community() {
  useDocumentTitle('Community');
  const [joinedCircle, setJoinedCircle] = useState(false);
  const join = community.inviteUrl
    ? <a className={buttonClass()} href={community.inviteUrl} target="_blank" rel="noreferrer">Join the server</a>
    : <span className="text-sm text-muted">Invite link coming soon</span>;

  return (
    <>
      <PageHeader title="Community" lede="Applicants should not have to navigate the process alone. Talk with other students and mentors throughout the cycle."/>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card label={community.moderation} title={`D4Y ${community.platform}`} action={join} className="self-start">
          <List>
            {community.channels.map(channel => <ListRow key={channel.name} title={`# ${channel.name}`} meta={channel.description}/>)}
          </List>
          <p className="mt-4 border-t border-line pt-4 text-sm text-muted">{community.conduct}</p>
        </Card>
        <div className="grid content-start gap-6">
          <Card title={community.peerCircle.title}>
            <p className="mb-4 text-muted">{community.peerCircle.description}</p>
            {joinedCircle
              ? <p className="rounded-field bg-done-soft p-3" role="status">You’re on the list for the next circle.</p>
              : <Button onClick={() => setJoinedCircle(true)}>Sign up</Button>}
          </Card>
          <Card title="Also in the program">
            <List>{communityItems.map(entry => <ListRow key={entry.title} title={entry.title} meta={entry.description}/>)}</List>
          </Card>
        </div>
      </div>
    </>
  );
}
