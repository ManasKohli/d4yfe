import { useState } from 'react';
import FilterPills from '../../components/FilterPills.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import ProgressBar from '../../components/ProgressBar.jsx';
import { cohort, roster } from '../../data/demo.js';
import { tracks } from '../../data/portal.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function AdminStudents() {
  useDocumentTitle('Students');
  const [track, setTrack] = useState('All');
  const visible = roster.filter(student => track === 'All' || student.track === track);

  return (
    <>
      <PageHeader eyebrow="D4Y ADMIN" title="Students" muted="and enrollment." lede={`${roster.length} of ${cohort.capacity} seats filled in the ${cohort.name.toLowerCase()}.`}/>
      <Panel title={`${visible.length} students`} action={<FilterPills label="Track" options={['All', ...tracks]} value={track} onChange={setTrack}/>} className="panel-wide-head">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Track</th><th scope="col">Package</th><th scope="col">Mentor</th><th scope="col">Modules done</th></tr></thead>
            <tbody>
              {visible.map(student => (
                <tr key={student.id}>
                  <td>{student.name}</td><td>{student.track}</td><td>{student.package}</td><td>{student.mentor}</td>
                  <td><div className="cell-progress"><span className="num">{student.done} of {student.modules}</span><ProgressBar value={student.done} max={student.modules} label={`${student.name} progress`}/></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
