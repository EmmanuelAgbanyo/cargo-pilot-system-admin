
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ListChecks, 
  LogOut,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = sessionStorage.getItem('user');
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="sidebar no-print">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6 flex items-center">
          <Package className="mr-2" />
          ACMS Admin
        </h1>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400">Welcome,</p>
          <p className="font-medium">{user || 'Admin'}</p>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors", 
                  isActive('/') && "bg-blue-700"
                )}
              >
                <LayoutDashboard className="mr-3" size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/add-shipment" 
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors", 
                  isActive('/add-shipment') && "bg-blue-700"
                )}
              >
                <Plus className="mr-3" size={20} />
                Add Shipment
              </Link>
            </li>
            <li>
              <Link 
                to="/shipments" 
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors", 
                  isActive('/shipments') && "bg-blue-700"
                )}
              >
                <ListChecks className="mr-3" size={20} />
                Shipment List
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors text-left"
              >
                <LogOut className="mr-3" size={20} />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
