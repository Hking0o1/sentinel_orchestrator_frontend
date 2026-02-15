import React from 'react';
import { Sidebar } from './SideBar';
import { Header } from './Header';

/**
 * DashboardLayout Component
 * This component creates the standard authenticated layout for the application.
 * It combines the Sidebar and Header, and renders the specific page content
 * as its children.
 */
export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* --- Sidebar (Fixed) --- */}
      <Sidebar />

      {/* --- Main Content Area (Scrollable) --- */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* --- Header (Fixed) --- */}
        <Header />

        {/* --- Page Content (Scrollable) --- */}
        <main className="flex-1 overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
