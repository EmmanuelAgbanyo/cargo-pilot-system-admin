
import { useState, useEffect } from 'react';
import { getShipments } from '../utils/shipmentService';
import { Shipment } from '../types';
import Layout from '../components/Layout';
import ShipmentTable from '../components/ShipmentTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ShipmentList = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    loadShipments();
  }, []);
  
  useEffect(() => {
    filterShipments();
  }, [shipments, searchQuery, statusFilter]);
  
  const loadShipments = () => {
    const allShipments = getShipments();
    setShipments(allShipments);
    setFilteredShipments(allShipments);
  };
  
  const filterShipments = () => {
    let filtered = [...shipments];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        shipment =>
          shipment.id.toString().includes(query) ||
          shipment.sender.toLowerCase().includes(query) ||
          shipment.receiver.toLowerCase().includes(query) ||
          shipment.route.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }
    
    setFilteredShipments(filtered);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shipment List</h1>
          <p className="text-muted-foreground">View and manage all shipments</p>
        </div>
        <Link to="/add-shipment">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Shipment
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by ID, sender, receiver or route..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <ShipmentTable shipments={filteredShipments} onDelete={loadShipments} />
    </Layout>
  );
};

export default ShipmentList;
