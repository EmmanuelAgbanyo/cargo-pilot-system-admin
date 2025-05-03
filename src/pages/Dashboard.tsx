
import { useEffect, useState } from 'react';
import { getShipmentStatistics } from '../utils/shipmentService';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ShipmentChart from '../components/ShipmentChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Truck, CheckCircle, Clock, Plus, ListChecks } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    pending: 0
  });
  
  useEffect(() => {
    const statistics = getShipmentStatistics();
    setStats(statistics);
  }, []);
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of shipment activities</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Shipments" 
          value={stats.total} 
          icon={<Package size={24} />} 
          className="border-b-4 border-blue-500"
        />
        <StatCard 
          title="Delivered" 
          value={stats.delivered} 
          icon={<CheckCircle size={24} />} 
          className="border-b-4 border-green-500"
        />
        <StatCard 
          title="In Transit" 
          value={stats.inTransit} 
          icon={<Truck size={24} />} 
          className="border-b-4 border-yellow-500"
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={<Clock size={24} />} 
          className="border-b-4 border-orange-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h2 className="text-xl font-semibold mb-4">Shipment Statistics</h2>
          <ShipmentChart data={{ 
            delivered: stats.delivered, 
            inTransit: stats.inTransit, 
            pending: stats.pending 
          }} />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/add-shipment')} 
              className="w-full flex items-center justify-center" 
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Shipment
            </Button>
            <Button 
              onClick={() => navigate('/shipments')} 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              size="lg"
            >
              <ListChecks className="mr-2 h-5 w-5" />
              View All Shipments
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
