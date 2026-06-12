import { getStatusConfig } from '../../utils/statusConfig'

export default function StatusBadge({ status }) {
  const cfg = getStatusConfig(status)
  return (
    <span className={`status-badge ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}
