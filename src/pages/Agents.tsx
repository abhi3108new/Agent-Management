
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import AgentCard from '@/components/AgentCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Agent } from '@/lib/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, SearchIcon, UserPlus } from 'lucide-react';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load agents
  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        const response = await api.getAgents();
        if (response.success && response.data) {
          setAgents(response.data);
          setFilteredAgents(response.data);
        }
      } catch (error) {
        toast.error('Failed to load agents');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgents();
  }, []);

  // Filter agents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAgents(agents);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = agents.filter(
      agent => 
        agent.name.toLowerCase().includes(lowerCaseQuery) ||
        agent.email.toLowerCase().includes(lowerCaseQuery) ||
        agent.mobile.includes(searchQuery)
    );
    
    setFilteredAgents(filtered);
  }, [searchQuery, agents]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
    });
    setSelectedAgent(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      password: '', // Password is not included when editing
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (selectedAgent) {
        // Update existing agent
        const agentData = { ...formData };
        // Don't update password if empty
        if (!agentData.password) {
          delete agentData.password;
        }
        
        const response = await api.updateAgent(selectedAgent.id, agentData);
        if (response.success && response.data) {
          setAgents(prev => prev.map(a => a.id === selectedAgent.id ? response.data : a));
          toast.success('Agent updated successfully');
        } else {
          toast.error(response.error || 'Failed to update agent');
        }
      } else {
        // Create new agent
        if (!formData.password) {
          toast.error('Password is required');
          setIsSubmitting(false);
          return;
        }
        
        const response = await api.createAgent(formData);
        if (response.success && response.data) {
          setAgents(prev => [...prev, response.data]);
          toast.success('Agent created successfully');
        } else {
          toast.error(response.error || 'Failed to create agent');
        }
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;
    
    try {
      const response = await api.deleteAgent(selectedAgent.id);
      if (response.success) {
        setAgents(prev => prev.filter(a => a.id !== selectedAgent.id));
        toast.success('Agent deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete agent');
      }
      
      setIsDeleteDialogOpen(false);
      setSelectedAgent(null);
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 pb-6 min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <header className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Agents</h1>
                <p className="text-muted-foreground">
                  Manage your team members and assign contacts
                </p>
              </div>
              <Button 
                onClick={openAddDialog}
                className="mt-4 md:mt-0 animate-scale-in"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </div>
            
            <div className="relative animate-fade-in animation-delay-300">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search agents by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </header>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3 mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  className="animate-scale-in"
                />
              ))}
            </div>
          ) : (
            <Card className="animate-fade-in">
              <CardContent className="flex flex-col items-center justify-center py-12">
                {searchQuery ? (
                  <>
                    <p className="text-muted-foreground mb-4">No agents match your search criteria</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">No agents found</p>
                    <Button onClick={openAddDialog}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Agent
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Add/Edit Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAgent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
            <DialogDescription>
              {selectedAgent 
                ? 'Update the agent details below' 
                : 'Enter the details for the new agent'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">
                  {selectedAgent 
                    ? 'Password (leave empty to keep current)' 
                    : 'Password'}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!selectedAgent}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : selectedAgent ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Agent Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent 
              <span className="font-semibold"> {selectedAgent?.name}</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Agents;
