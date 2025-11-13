import { Search, Bell, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

/**
 * Header Component
 * This is the top bar of the main content area, containing search, notifications, and user profile.
 */
export const Header = () => {
  // In a real app, this would come from a router hook or context
  const currentPageTitle = 'Dashboard'; 
  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="flex h-20 items-center justify-between px-8 bg-primary-dark border-b border-neutral-700">
      {/* --- Page Title & Breadcrumbs --- */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-100">
          {currentPageTitle}
        </h1>
        {/* Breadcrumbs could go here */}
      </div>

      <div className="flex items-center gap-6">
        {/* --- Global Search --- */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="search"
            placeholder="Search scans, reports, or CVEs..."
            className="w-full pl-10 bg-primary-light border-neutral-600 focus:border-accent-blue focus:ring-accent-blue"
          />
        </div>

        {/* --- Action Buttons --- */}
        {/* This button will eventually open the 'Start New Scan' modal */}
        <Button className="bg-accent-gold text-primary-dark font-bold hover:bg-accent-gold/90">
          Start New Scan
        </Button>

        {/* --- Notification Bell --- */}
        <Button
          variant="outline"
          size="icon"
          className="bg-primary-dark border-neutral-600 hover:bg-neutral-800 text-neutral-300"
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* --- User Profile Dropdown --- */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.email || 'A'}`}
                  alt={user?.full_name || 'Admin User'}
                />
                <AvatarFallback className="bg-accent-blue text-primary-dark font-bold">
                  {user?.full_name ? user.full_name.charAt(0) : 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-primary-light border-neutral-700 text-neutral-200"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-accent-gold">
                  {user?.full_name || 'Admin User'}
                </p>
                <p className="text-xs leading-none text-neutral-400">
                  {user?.email || 'admin@sentinel.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-neutral-700" />
            <DropdownMenuItem 
              className="focus:bg-neutral-700 focus:text-accent-gold"
              onSelect={() => navigate('/settings')} // Navigate to profile/settings
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="focus:bg-neutral-700 focus:text-accent-gold"
              onSelect={() => navigate('/settings')}
            >
              {/* This component will now render correctly */}
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-neutral-700" />
            <DropdownMenuItem 
              className="text-red-500 focus:bg-red-900/20 focus:text-red-400"
              onSelect={handleLogout} // Call logout function
            >
              <User className="mr-2 h-4 w-4" /> {/* LogOut icon is also available */}
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
