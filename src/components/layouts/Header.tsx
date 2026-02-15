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
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

/**
 * Header Component
 * This is the top bar of the main content area, containing search, notifications, and user profile.
 */
export const Header = () => {
  const { user, logout } = useAuth(); // Get user and logout function
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user?.full_name || user?.email || 'Admin User';
  const routeTitle = location.pathname.split('/').filter(Boolean).pop() || 'dashboard';
  const currentPageTitle = routeTitle.charAt(0).toUpperCase() + routeTitle.slice(1);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-border/70 bg-card/75 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* --- Page Title & Breadcrumbs --- */}
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          {currentPageTitle}
        </h1>
        {/* Breadcrumbs could go here */}
      </div>

      <div className="flex items-center gap-6">
        {/* --- Global Search --- */}
        <div className="relative hidden w-72 lg:block">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search scans, reports, or CVEs..."
            className="w-full border-input bg-background pl-10"
          />
        </div>

        {/* --- Action Buttons --- */}
        {/* This button will eventually open the 'Start New Scan' modal */}
        <Button className="hidden sm:inline-flex">
          Start New Scan
        </Button>

        {/* --- Notification Bell --- */}
        <Button
          variant="outline"
          size="icon"
          className="border-border bg-background text-foreground hover:bg-accent"
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
                  alt={displayName}
                />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-border bg-popover text-popover-foreground"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@sentinel.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onSelect={() => navigate('/app/settings')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => navigate('/app/settings')}
            >
              {/* This component will now render correctly */}
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
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
