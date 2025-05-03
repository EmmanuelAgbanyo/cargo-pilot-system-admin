
export type ShipmentStatus = 'In Transit' | 'Delivered' | 'Pending';

export interface Shipment {
  id: number;
  sender: string;
  receiver: string;
  route: string;
  cost: number;
  status: ShipmentStatus;
  createdAt?: string;
}

export interface User {
  username: string;
  password: string;
}
