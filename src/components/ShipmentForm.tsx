import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shipment, ShipmentStatus } from '../types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const formSchema = z.object({
  sender: z.string().min(1, { message: 'Sender is required' }),
  receiver: z.string().min(1, { message: 'Receiver is required' }),
  route: z.string().min(1, { message: 'Route is required' }),
  cost: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Cost must be a positive number',
  }),
  status: z.enum(['In Transit', 'Delivered', 'Pending']),
});

type FormValues = z.infer<typeof formSchema>;

interface ShipmentFormProps {
  shipment?: Shipment;
  onSave: (shipment: Omit<Shipment, 'id' | 'createdAt'> | Shipment) => void;
  isEdit?: boolean;
}

const ShipmentForm = ({ shipment, onSave, isEdit = false }: ShipmentFormProps) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: shipment?.sender || '',
      receiver: shipment?.receiver || '',
      route: shipment?.route || '',
      cost: shipment?.cost ? shipment.cost.toString() : '',
      status: shipment?.status || 'In Transit',
    },
  });
  
  useEffect(() => {
    if (shipment) {
      form.reset({
        sender: shipment.sender,
        receiver: shipment.receiver,
        route: shipment.route,
        cost: shipment.cost.toString(),
        status: shipment.status,
      });
    }
  }, [shipment, form]);
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);
      
      const shipmentData = {
        sender: values.sender,
        receiver: values.receiver,
        route: values.route,
        cost: Number(values.cost),
        status: values.status as ShipmentStatus,
      };
      
      if (isEdit && shipment) {
        onSave({
          ...shipmentData,
          id: shipment.id,
          createdAt: shipment.createdAt,
        });
        toast.success('Shipment updated successfully');
      } else {
        onSave(shipmentData);
        toast.success('Shipment added successfully');
      }
      
      // If creating a new shipment, go back to list
      if (!isEdit) {
        navigate('/shipments');
      }
    } catch (error) {
      console.error('Error saving shipment:', error);
      toast.error('An error occurred while saving the shipment');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleGenerateInvoice = () => {
    if (shipment) {
      generateInvoicePDF(shipment);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="receiver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route</FormLabel>
                <FormControl>
                  <Input placeholder="Accra - Kumasi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost (GHS)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" placeholder="500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/shipments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
          </Button>
          
          <div className="space-x-2">
            {isEdit && shipment && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGenerateInvoice}
              >
                Generate Invoice
              </Button>
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : isEdit ? 'Update Shipment' : 'Add Shipment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ShipmentForm;
