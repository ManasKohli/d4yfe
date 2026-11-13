import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import { communityItems } from '../../data/program.js';
import { community } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function Community() {
  useDocumentTitle('Community');
  const [joinedCircle, setJoinedCircle] = useState(false);
  const join = community.inviteUrl
    ? <a className="button button-dark button-compact" href={community.inviteUrl} target="_blank" rel="noreferrer">Join the server</a>
    : <span className="muted-line">Invite link coming soon</span>;

  return (
    <>
      <PageHeader eyebrow="STUDENT PORTAL" title="Community," muted="between sessions." lede="Applicants should not have to navigate the process alone. Talk with other students and mentors throughout the cycle."/>
      <div className="app-layout">
        <Panel label={community.moderation} title={`D4Y ${community.platform}`} action={join}>
          <h3 className="sub-label">Channels</h3>
          <ul className="item-list">
            {community.channels.map(channel => <li key={channel.name}><span className="channel"># {channel.name}</span><small>{channel.description}</small></li>)}
          </ul>
          <p className="panel-foot"><span>{community.conduct}</span></p>
        </Panel>
        <div className="stack">
          <Panel title={community.peerCircle.title}>
            <p className="body-text">{community.peerCircle.description}</p>
            {joinedCircle
              ? <p className="callout" role="status">You’re on the list for the next circle.</p>
              : <button className="button button-dark button-compact" type="button" onClick={() => setJoinedCircle(true)}>Sign up</button>}
          </Panel>
          <Panel title="Also in the program">
            <ul className="item-list">
              {communityItems.map(entry => <li key={entry.title}><span>{entry.title}<small className="block">{entry.description}</small></span></li>)}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
