import { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Settings,
  ShieldCheck,
  BookMarked,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarClock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import '/public/sentinel_project_colapsed_logo.png' 
import logo from '/public/sentinel_project_logo.svg'
import logo_colapsed from '/public/sentinel_project_colapsed_logo.svg'


const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
  { name: 'Scans', icon: Target, href: '/app/scans' },
  { name: 'Schedules', icon: CalendarClock, href: '/app/schedules' },
  { name: 'Reports', icon: BookMarked, href: '/app/reports' },
  { name: 'Vulnerabilities', icon: ShieldCheck, href: '/app/vulnerabilities' },
  { name: 'Settings', icon: Settings, href: '/app/settings' },
];
// ------------------------------------------------

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className={`flex flex-col h-screen p-4 bg-primary-light border-r border-border text-foreground transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <img src={logo} alt='Sentinel' id="logo" className="h-16 w-auto object-contain invert-[0.1] brightness-150"></img>
        )}
        <Button
          variant="outline"
          size="icon"
          className="bg-card border-border hover:bg-accent"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <div>
              <ChevronRight className="h-5 w-5" />
              <img src={logo_colapsed} alt='Sentinel' id="logo" className="h-16 w-auto object-contain invert-[0.1] brightness-150"></img>
            </div>
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          // Check if this link is active
          const isActive = location.pathname === item.href;
          
          return (
            <li key={item.name}>
              <button
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-accent text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-primary'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="ml-4 font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-border pt-4">
        <button
          onClick={() => navigate('/app/settings')}
          className={`w-full flex items-center p-3 rounded-lg text-muted-foreground transition-colors duration-200
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
            <div className="ml-4 whitespace-nowrap text-left">
              <p className="font-semibold text-sm text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          )}
        </button>
        
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