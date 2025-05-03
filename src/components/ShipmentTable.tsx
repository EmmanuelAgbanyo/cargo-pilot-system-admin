
import { useNavigate } from 'react-router-dom';
import { Shipment } from '../types';
import { formatCurrency } from '../utils/shipmentService';
import { deleteShipment } from '../utils/shipmentService';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, FileText, Trash } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { toast } from '@/components/ui/sonner';

interface ShipmentTableProps {
  shipments: Shipment[];
  onDelete: () => void;
}

const ShipmentTable = ({ shipments, onDelete }: ShipmentTableProps) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shipmentToDelete, setShipmentToDelete] = useState<number | null>(null);
  
  const handleView = (id: number) => {
    navigate(`/shipment/${id}`);
  };
  
  const handleDeleteClick = (id: number) => {
    setShipmentToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (shipmentToDelete !== null) {
      deleteShipment(shipmentToDelete);
      setDeleteDialogOpen(false);
      onDelete();
      toast.success('Shipment deleted successfully');
    }
  };
  
  const handleGenerateInvoice = (shipment: Shipment) => {
    generateInvoicePDF(shipment);
  };
  
  return (
    <>
      <div className="overflow-x-auto mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No shipments found
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.sender}</TableCell>
                  <TableCell>{shipment.receiver}</TableCell>
                  <TableCell>{shipment.route}</TableCell>
                  <TableCell>{formatCurrency(shipment.cost)}</TableCell>
                  <TableCell>
                    <StatusBadge status={shipment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleView(shipment.id)} 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleGenerateInvoice(shipment)} 
                        title="Generate Invoice"
                      >
                        <FileText size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(shipment.id)} 
                        title="Delete Shipment"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shipment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShipmentTable;
