import StatusBadge from './StatusBadge'
import { formatDate } from '../utils/dateUtils'

export default function ComplianceTable({ rows }) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <p>No documents match your search or filters.</p>
        <span>Try a different registration number, or clear filters to see everything.</span>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="compliance-table">
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Asset type</th>
            <th>Document type</th>
            <th>Route</th>
            <th>Expiry date</th>
            <th>Status</th>
            <th>Responsible</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`row-${row.liveStatus.toLowerCase()}`}>
              <td className="reg-no">{row.regNo}</td>
              <td>{row.assetType}</td>
              <td>{row.documentType}</td>
              <td>{row.routeDetail}</td>
              <td>{formatDate(row.expiryDate)}</td>
              <td><StatusBadge status={row.liveStatus} expiryDate={row.expiryDate} /></td>
              <td>{row.responsiblePerson}</td>
              <td className="remarks">{row.remarks || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
