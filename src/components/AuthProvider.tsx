
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/api';
import { AuthState, LoginCredentials, User } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: api.getToken(),
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (api.getToken()) {
        try {
          const response = await api.getCurrentUser();
          if (response.success && response.data) {
            setState({
              user: response.data,
              token: api.getToken(),
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await api.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success(`Welcome back, ${user.name}`);
        return true;
      } else {
        toast.error(response.error || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const handleLogout = () => {
    api.clearToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const logout = async (): Promise<void> => {
    await api.logout();
    handleLogout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Redirect component for protected routes
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary text-opacity-80">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};
