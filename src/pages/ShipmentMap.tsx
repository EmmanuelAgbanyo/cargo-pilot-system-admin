
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ShipmentMap from '../components/ShipmentMap';
import { getShipments } from '../utils/shipmentService';
import { Shipment } from '../types';

const ShipmentMapPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    // Load shipments when component mounts
    const loadedShipments = getShipments();
    setShipments(loadedShipments);
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Shipment Map</h1>
        <p className="mb-4 text-muted-foreground">
          This map displays all active shipments and their routes across the globe.
          Different colors indicate the status of each shipment.
        </p>

        <ShipmentMap shipments={shipments} />
      </div>
    </Layout>
  );
};

export default ShipmentMapPage;
