
import Layout from '../components/Layout';
import ShipmentForm from '../components/ShipmentForm';
import { addShipment } from '../utils/shipmentService';
import { Shipment } from '../types';

const AddShipment = () => {
  const handleSave = (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
    return addShipment(shipmentData);
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Shipment</h1>
        <p className="text-muted-foreground">Create a new shipment record</p>
      </div>
      
      <ShipmentForm onSave={handleSave} />
    </Layout>
  );
};

export default AddShipment;
