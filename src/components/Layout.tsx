
import { ReactNode } from 'react';
import { SidebarProvider } from './Sidebar';
import AuthGuard from './AuthGuard';
import AppSidebar from './AppSidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="main-content w-full">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default Layout;
