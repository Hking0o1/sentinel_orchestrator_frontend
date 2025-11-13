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
import { Button } from '@/components/ui/button'; // Assumes shadcn/ui is set up with this alias

/**
 * Main navigation links for the sidebar.
 */
const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Scans', icon: Target, href: '/scans' },
  { name: 'Reports', icon: BookMarked, href: '/reports' },
  { name: 'Vulnerabilities', icon: ShieldCheck, href: '/vulnerabilities' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

/**
 * Sidebar Component
 * This is the main navigation panel for the dashboard layout.
 * It uses the custom color palette defined in tailwind.config.js.
 */
export const Sidebar = () => {
  // In a real app, this state would be managed by a layout context or Zustand
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <nav
      className={`flex flex-col h-screen p-4 bg-primary-darker text-neutral-200 border-r border-neutral-700 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* --- Header / Logo --- */}
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-accent-gold whitespace-nowrap">
            Project Sentinel
          </h1>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-primary-dark border-neutral-600 hover:bg-neutral-800"
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
              className={`flex items-center p-3 rounded-lg text-neutral-300 transition-colors duration-200
                hover:bg-primary-light hover:text-accent-gold
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
      <div className="border-t border-neutral-700 pt-4">
        <a
          href="/profile" // Or handle with a click event
          className={`flex items-center p-3 rounded-lg text-neutral-300 transition-colors duration-200
            hover:bg-primary-light hover:text-accent-gold
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <img
            src="https://placehold.co/100x100/1D2B44/FFD700?text=A"
            alt="User Avatar"
            className="h-8 w-8 rounded-full"
          />
          {!isCollapsed && (
            <div className="ml-4 whitespace-nowrap">
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-neutral-400">admin@sentinel.com</p>
            </div>
          )}
        </a>
        <Button
          variant="ghost"
          className={`w-full mt-2 text-neutral-400 hover:text-red-500 hover:bg-red-900/20
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-4 font-medium">Logout</span>}
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;

