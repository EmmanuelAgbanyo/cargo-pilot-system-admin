
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, icon, className }: StatCardProps) => {
  return (
    <Card className={cn("border-none rounded-lg shadow-sm p-6", className)}>
      <div className="flex items-center">
        <div className="rounded-full p-3 mr-4 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
