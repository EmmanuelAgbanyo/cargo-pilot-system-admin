
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ShipmentForm from '../components/ShipmentForm';
import { getShipmentById, updateShipment } from '../utils/shipmentService';
import { Shipment } from '../types';
import { toast } from '@/components/ui/sonner';

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      const shipmentId = parseInt(id, 10);
      const foundShipment = getShipmentById(shipmentId);
      
      if (foundShipment) {
        setShipment(foundShipment);
      } else {
        setError('Shipment not found');
        toast.error('Shipment not found');
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handleSave = (updatedShipment: Shipment) => {
    const result = updateShipment(updatedShipment);
    if (result) {
      setShipment(result);
    }
    return result;
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Shipment Details</h1>
        <p className="text-muted-foreground">View and edit shipment information</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      ) : shipment ? (
        <ShipmentForm shipment={shipment} onSave={handleSave} isEdit={true} />
      ) : (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
          Shipment not found
        </div>
      )}
    </Layout>
  );
};

export default ShipmentDetails;
