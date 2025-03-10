
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { path: '/agents', label: 'Agents', icon: <Users className="h-4 w-4" /> },
    { path: '/distribution', label: 'Distribution', icon: <ListTodo className="h-4 w-4" /> },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-card backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/dashboard" className="flex items-center space-x-2 text-primary font-semibold">
              <span className="text-xl">Agent Allocator</span>
            </NavLink>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="ml-4 flex items-center space-x-2">
              <div className="text-sm text-foreground/70">
                {user?.name}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                )}
                onClick={closeMobileMenu}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            <Button 
              variant="ghost" 
              className="w-full justify-start mt-2 text-destructive"
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
