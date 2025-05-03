
import { ShipmentStatus } from '../types';
import { getStatusClassName } from '../utils/shipmentService';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusClass = getStatusClassName(status);
  
  return (
    <Badge variant="outline" className={`${statusClass} font-medium`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
