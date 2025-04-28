export function StatusBadge({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}