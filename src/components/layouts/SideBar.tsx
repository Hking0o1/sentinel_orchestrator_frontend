import React from 'react';
import {
  LayoutDashboard,
  Target,
  Settings,
  ShieldCheck,
  BookMarked,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth'; // <-- 1. Import the useAuth hook
import { useNavigate } from 'react-router-dom'; // <-- 2. Import the useNavigate hook

/**
 * Main navigation links for the sidebar.
 */
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Scans', icon: Target, href: '/scans' },
  { name: 'Reports', icon: BookMarked, href: '/reports' },
  { name: 'Vulnerabilities', icon: ShieldCheck, href: '/vulnerabilities' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

/**
 * Sidebar Component
 * This is the main navigation panel for the dashboard layout.
 */
export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  // --- 3. Get the functions we need ---
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  // ------------------------------------

  // --- 4. Create the event handler ---
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // -----------------------------------

  // Helper to get user initials
  // const getInitials = (name: string | null | undefined) => {
  //   if (!name) return 'A';
  //   const names = name.split(' ');
  //   if (names.length > 1) {
  //     return names[0][0] + names[names.length - 1][0];
  //   }
  //   return name[0];
  // };

  return (
    <nav
      className={`flex flex-col h-screen p-4 bg-primary-light border-r border-border text-foreground transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* --- Header / Logo --- */}
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
            Project Sentinel
          </h1>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-card border-border hover:bg-accent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* --- Navigation Links --- */}
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className={`flex items-center p-3 rounded-lg text-muted-foreground transition-colors duration-200
                hover:bg-accent hover:text-primary
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && (
                <span className="ml-4 font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* --- User Profile / Logout --- */}
      <div className="border-t border-border pt-4">
        <a
          href="/settings" // Link to the settings page
          className={`flex items-center p-3 rounded-lg text-muted-foreground transition-colors duration-200
            hover:bg-accent hover:text-primary
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <img
            src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.email || 'A'}`}
            alt="User Avatar"
            className="h-8 w-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="ml-4 whitespace-nowrap">
              <p className="font-semibold text-sm text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </a>
        
        {/* --- 5. Attach the onClick handler --- */}
        <Button
          variant="ghost"
          className={`w-full mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-4 font-medium">Logout</span>}
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;