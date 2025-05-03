
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated } from "./utils/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddShipment from "./pages/AddShipment";
import ShipmentList from "./pages/ShipmentList";
import ShipmentDetails from "./pages/ShipmentDetails";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-shipment" element={<AddShipment />} />
          <Route path="/shipments" element={<ShipmentList />} />
          <Route path="/shipment/:id" element={<ShipmentDetails />} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
