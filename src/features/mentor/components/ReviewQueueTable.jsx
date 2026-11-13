import { Link } from 'react-router';
import { mentorReviewPath } from '@/app/paths.js';
import StatusPill from '@/shared/components/StatusPill.jsx';
import { formatDay } from '@/shared/lib/format.js';

export default function ReviewQueueTable({ items }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th scope="col">Student</th><th scope="col">Assignment</th><th scope="col">Track</th><th scope="col">Due</th><th scope="col">Status</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.student}</td>
              <td><Link to={mentorReviewPath(item.id)}>{item.title}</Link></td>
              <td>{item.track}</td>
              <td>{formatDay(item.due)}</td>
              <td><StatusPill status={item.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
