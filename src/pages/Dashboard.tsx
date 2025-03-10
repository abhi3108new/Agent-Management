
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { Agent, Distribution } from '@/lib/types';
import { PlusCircle, UserPlus, Upload, ChevronRight, BarChart3, Users, ListChecks } from 'lucide-react';
import AgentCard from '@/components/AgentCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [agentsResponse, distributionsResponse] = await Promise.all([
          api.getAgents(),
          api.getDistributions()
        ]);
        
        if (agentsResponse.success && agentsResponse.data) {
          setAgents(agentsResponse.data);
        }
        
        if (distributionsResponse.success && distributionsResponse.data) {
          setDistributions(distributionsResponse.data);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 pb-6 min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto animate-fade-in">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Here's an overview of your system.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card/70 backdrop-blur-sm animate-scale-in [animation-delay:0.1s]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Agents
                </CardTitle>
                <CardDescription>Manage your team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{agents.length}</div>
                <Button asChild className="w-full">
                  <Link to="/agents" className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Manage Agents
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card/70 backdrop-blur-sm animate-scale-in [animation-delay:0.2s]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <ListChecks className="h-5 w-5 mr-2 text-primary" />
                  Distributions
                </CardTitle>
                <CardDescription>Contact allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{distributions.length}</div>
                <Button asChild className="w-full">
                  <Link to="/distribution" className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      New Distribution
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-card/70 backdrop-blur-sm animate-scale-in [animation-delay:0.3s]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Status
                </CardTitle>
                <CardDescription>System overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm mb-4">
                  <div className="flex justify-between py-1">
                    <span>Agents:</span>
                    <span className="font-medium">{agents.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Distributions:</span>
                    <span className="font-medium">{distributions.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>System Status:</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8 animate-fade-in animation-delay-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Agents</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/agents">View All</Link>
              </Button>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : agents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agents.slice(0, 3).map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No agents found</p>
                  <Button asChild>
                    <Link to="/agents" className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Agent
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="animate-fade-in animation-delay-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Distributions</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/distribution">View All</Link>
              </Button>
            </div>
            
            {isLoading ? (
              <Card className="animate-pulse">
                <CardContent className="py-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between py-2">
                        <div className="h-5 bg-muted rounded w-1/3"></div>
                        <div className="h-5 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : distributions.length > 0 ? (
              <Card>
                <CardContent className="py-6">
                  <div className="divide-y">
                    {distributions.slice(0, 3).map((dist) => (
                      <div key={dist.id} className="flex justify-between py-3 first:pt-0 last:pb-0">
                        <div>
                          <div className="font-medium">{dist.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(dist.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{dist.totalContacts} contacts</div>
                          <div className="text-sm text-muted-foreground">
                            {dist.totalAgents} agents
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">No distributions found</p>
                  <Button asChild>
                    <Link to="/distribution" className="flex items-center">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create Your First Distribution
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
