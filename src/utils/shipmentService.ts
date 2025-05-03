import { Shipment, ShipmentStatus } from '../types';

const STORAGE_KEY = 'shipments';

// Initial sample data
const sampleShipments: Shipment[] = [
  {
    id: 1001,
    sender: 'John Doe',
    receiver: 'Jane Smith',
    route: 'Accra - Kumasi',
    cost: 500,
    status: 'Delivered',
    createdAt: new Date().toISOString()
  },
  {
    id: 1002,
    sender: 'Michael Brown',
    receiver: 'Sarah Kyei',
    route: 'Tamale - Takoradi',
    cost: 300,
    status: 'In Transit',
    createdAt: new Date().toISOString()
  },
  {
    id: 1003,
    sender: 'Alex Johnson',
    receiver: 'Kwame Mensah',
    route: 'Accra - Takoradi',
    cost: 450,
    status: 'Pending',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Get all shipments from localStorage or initialize with sample data
export const getShipments = (): Shipment[] => {
  try {
    const shipments = localStorage.getItem(STORAGE_KEY);
    if (shipments) {
      return JSON.parse(shipments);
    } else {
      saveShipments(sampleShipments);
      return sampleShipments;
    }
  } catch (error) {
    console.error('Error retrieving shipments:', error);
    return [];
  }
};

// Save shipments to localStorage
export const saveShipments = (shipments: Shipment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shipments));
  } catch (error) {
    console.error('Error saving shipments:', error);
  }
};

// Add a new shipment
export const addShipment = (shipment: Omit<Shipment, 'id' | 'createdAt'>): Shipment => {
  const shipments = getShipments();
  
  // Generate a new ID by finding the highest current ID and adding 1
  const maxId = shipments.reduce((max, s) => (s.id > max ? s.id : max), 1000);
  const newId = maxId + 1;
  
  const newShipment: Shipment = {
    ...shipment,
    id: newId,
    createdAt: new Date().toISOString()
  };
  
  shipments.push(newShipment);
  saveShipments(shipments);
  
  return newShipment;
};

// Get a shipment by ID
export const getShipmentById = (id: number): Shipment | undefined => {
  const shipments = getShipments();
  return shipments.find(s => s.id === id);
};

// Update an existing shipment
export const updateShipment = (updatedShipment: Shipment): Shipment | undefined => {
  const shipments = getShipments();
  const index = shipments.findIndex(s => s.id === updatedShipment.id);
  
  if (index !== -1) {
    shipments[index] = updatedShipment;
    saveShipments(shipments);
    return updatedShipment;
  }
  
  return undefined;
};

// Delete a shipment by ID
export const deleteShipment = (id: number): boolean => {
  const shipments = getShipments();
  const filteredShipments = shipments.filter(s => s.id !== id);
  
  if (filteredShipments.length < shipments.length) {
    saveShipments(filteredShipments);
    return true;
  }
  
  return false;
};

// Get shipment statistics
export const getShipmentStatistics = () => {
  const shipments = getShipments();
  
  return {
    total: shipments.length,
    delivered: shipments.filter(s => s.status === 'Delivered').length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    pending: shipments.filter(s => s.status === 'Pending').length
  };
};

// Get status class name for styling
export const getStatusClassName = (status: ShipmentStatus): string => {
  switch (status) {
    case 'Delivered':
      return 'status-delivered';
    case 'In Transit':
      return 'status-in-transit';
    case 'Pending':
      return 'status-pending';
    default:
      return '';
  }
};
