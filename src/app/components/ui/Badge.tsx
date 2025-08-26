interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium';
  outline?: boolean;
}

export default function Badge({ 
  label, 
  variant = 'default', 
  size = 'medium',
  outline = false
}: BadgeProps) {
  const variantClasses = {
    default: outline 
      ? 'bg-white text-gray-700 border border-gray-300' 
      : 'bg-gray-100 text-gray-800',
    success: outline 
      ? 'bg-white text-green-700 border border-green-500' 
      : 'bg-green-100 text-green-800',
    warning: outline 
      ? 'bg-white text-amber-700 border border-amber-500' 
      : 'bg-amber-100 text-amber-800',
    danger: outline 
      ? 'bg-white text-red-700 border border-red-500' 
      : 'bg-red-100 text-red-800',
    info: outline 
      ? 'bg-white text-blue-700 border border-blue-500' 
      : 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-0.5',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const getVariant = () => {
    const lowerStatus = status.toLowerCase();
    if (['active', 'completed', 'approved', 'success', 'online', 'operational'].some(s => lowerStatus.includes(s))) {
      return 'success';
    }
    if (['pending', 'in progress', 'waiting', 'warning', 'partial'].some(s => lowerStatus.includes(s))) {
      return 'warning';
    }
    if (['inactive', 'failed', 'rejected', 'error', 'offline', 'critical'].some(s => lowerStatus.includes(s))) {
      return 'danger';
    }
    return 'default';
  };

  return <Badge label={status} variant={getVariant()} />;
}
