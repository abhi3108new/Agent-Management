
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-4xl text-center">
        <div className="animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Agent</span> Allocator
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Streamline your contact management and distribute leads efficiently to your team.
          </p>
          
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="animate-scale-in animation-delay-200"
            >
              Login
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="animate-scale-in animation-delay-300"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-fade-in animation-delay-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Manage Agents</h3>
              <p className="text-muted-foreground">Create and organize your team in one central location.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Import Contacts</h3>
              <p className="text-muted-foreground">Easily upload CSV files with contact information.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Distribute Lists</h3>
              <p className="text-muted-foreground">Automatically allocate contacts evenly among your agents.</p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto pt-8 text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Agent Allocator. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
