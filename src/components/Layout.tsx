
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="main-content w-full">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Layout;
