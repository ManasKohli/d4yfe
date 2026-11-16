import { useState } from 'react';
import { cohort, roster } from '@/data/demo';
import { tracks } from '@/data/portal';
import useDocumentTitle from '@/shared/hooks/useDocumentTitle';
import FilterPills from '@/shared/ui/FilterPills';
import PageHeader from '@/shared/ui/PageHeader';
import ProgressBar from '@/shared/ui/ProgressBar';
import Table from '@/shared/ui/Table';

const trackOptions = ['All', ...tracks];

export default function AdminStudents() {
  useDocumentTitle('Students');
  const [track, setTrack] = useState('All');
  const visible = roster.filter(student => track === 'All' || student.track === track);

  return (
    <>
      <PageHeader eyebrow="D4Y admin" title="Students" lede={`${roster.length} of ${cohort.capacity} seats filled in the ${cohort.name.toLowerCase()}.`}/>
      <div className="mb-5"><FilterPills label="Track" options={trackOptions} value={track} onChange={setTrack}/></div>
      <Table
        caption="Students in the cohort"
        rows={visible}
        rowKey={student => student.id}
        empty="No students on this track yet."
        columns={[
          { header: 'Student', cell: student => <span className="font-medium">{student.name}</span> },
          { header: 'Track', cell: student => student.track, hideOnPhone: true },
          { header: 'Package', cell: student => student.package, hideOnPhone: true },
          { header: 'Mentor', cell: student => student.mentor, hideOnPhone: true },
          {
            header: 'Modules done',
            cell: student => (
              <div className="flex min-w-32 items-center gap-3">
                <span className="text-sm tabular-nums">{student.done} of {student.modules}</span>
                <div className="flex-1"><ProgressBar value={student.done} max={student.modules} label={`${student.name} progress`}/></div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
