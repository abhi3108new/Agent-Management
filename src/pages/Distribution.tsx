
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import AgentCard from '@/components/AgentCard';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Agent, Contact, Distribution } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, AlertCircle, CheckCircle2, Users, DownloadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const DistributionPage = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDistribution, setCurrentDistribution] = useState<Distribution | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
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
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileValidationError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = e.target.files[0];
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Validate file type
    if (
      !fileType.includes('csv') && 
      !fileType.includes('excel') && 
      !fileType.includes('spreadsheetml') &&
      !fileName.endsWith('.csv') && 
      !fileName.endsWith('.xlsx') && 
      !fileName.endsWith('.xls')
    ) {
      setFileValidationError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (agents.length === 0) {
      toast.error('You need to add agents before distributing contacts');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const response = await api.uploadAndDistributeContacts(selectedFile);
      
      if (response.success && response.data) {
        toast.success('File uploaded and contacts distributed successfully');
        setDistributions(prev => [...prev, response.data]);
        setSelectedFile(null);
        setActiveTab('distributions');
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        toast.error(response.error || 'Failed to upload and distribute contacts');
      }
    } catch (error) {
      toast.error('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const viewDistribution = async (distribution: Distribution) => {
    try {
      const response = await api.getDistribution(distribution.id);
      
      if (response.success && response.data) {
        setCurrentDistribution(response.data.distribution);
        setContacts(response.data.contacts);
        setIsDialogOpen(true);
      } else {
        toast.error(response.error || 'Failed to load distribution details');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  // Group contacts by agent
  const contactsByAgent = contacts.reduce((groups, contact) => {
    const agentId = contact.agentId || 'unassigned';
    if (!groups[agentId]) {
      groups[agentId] = [];
    }
    groups[agentId].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);

  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 pb-6 min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <header className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold mb-2">Contact Distribution</h1>
            <p className="text-muted-foreground">
              Upload and distribute contact lists among your agents
            </p>
          </header>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
              <TabsTrigger value="distributions" className="flex-1">Distributions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    Upload and Distribute Contacts
                  </CardTitle>
                  <CardDescription>
                    The contacts will be distributed equally among your agents
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {agents.length === 0 ? (
                    <Alert variant="destructive" className="mb-6">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No agents available</AlertTitle>
                      <AlertDescription>
                        You need to add agents before distributing contacts.
                        <Button 
                          className="mt-2 w-full" 
                          onClick={() => window.location.href = '/agents'}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Manage Agents
                        </Button>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="default" className="mb-6 bg-primary/10 border-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <AlertTitle>Ready to distribute</AlertTitle>
                      <AlertDescription>
                        You have {agents.length} agents available for distribution.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Upload CSV or Excel File</Label>
                      <div className="grid gap-2">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50 hover:bg-primary/5">
                          <input
                            id="file-upload"
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Label 
                            htmlFor="file-upload" 
                            className="cursor-pointer flex flex-col items-center"
                          >
                            <DownloadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                            <div className="text-sm font-medium mb-1">
                              {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              CSV or Excel files only (max 10MB)
                            </div>
                          </Label>
                        </div>
                        
                        {fileValidationError && (
                          <div className="text-destructive text-sm mt-1">
                            {fileValidationError}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Expected CSV Format</h3>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="text-xs font-mono text-muted-foreground">
                            <div className="mb-2">The CSV should contain these columns:</div>
                            <div className="flex space-x-4">
                              <div className="text-foreground">FirstName</div>
                              <div className="text-foreground">Phone</div>
                              <div className="text-foreground">Notes</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button 
                      onClick={handleUpload} 
                      disabled={!selectedFile || isUploading || agents.length === 0}
                      className="w-full"
                    >
                      {isUploading ? 'Processing...' : 'Upload and Distribute'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distributions" className="mt-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Distribution History
                  </CardTitle>
                  <CardDescription>
                    View and manage your contact distributions
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between py-4 border-b last:border-0">
                          <div className="space-y-2">
                            <div className="h-5 bg-muted rounded w-48"></div>
                            <div className="h-4 bg-muted rounded w-32"></div>
                          </div>
                          <div className="h-8 bg-muted rounded w-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : distributions.length > 0 ? (
                    <div className="divide-y">
                      {distributions.map((dist) => (
                        <div key={dist.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="mb-3 sm:mb-0">
                            <div className="font-medium">{dist.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(dist.date).toLocaleDateString()}{' • '}
                              {dist.totalContacts} contacts{' • '}
                              {dist.totalAgents} agents
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDistribution(dist)}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-muted-foreground mb-4">No distributions found</div>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('upload')}
                      >
                        Create Your First Distribution
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Distribution Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Distribution Details</DialogTitle>
            <DialogDescription>
              {currentDistribution?.name} • {new Date(currentDistribution?.date || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <Separator className="my-4" />
          
          <div className="space-y-4 pb-6">
            <div className="grid grid-cols-3 gap-4 text-sm text-center">
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-muted-foreground">Total Contacts</div>
                <div className="text-xl font-bold mt-1">{currentDistribution?.totalContacts}</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-muted-foreground">Agents</div>
                <div className="text-xl font-bold mt-1">{currentDistribution?.totalAgents}</div>
              </div>
              <div className="bg-muted/40 p-3 rounded-md">
                <div className="text-muted-foreground">Status</div>
                <div className="text-xl font-bold mt-1 text-green-600 capitalize">
                  {currentDistribution?.status}
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Contact Allocation by Agent</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  contacts={contactsByAgent[agent.id] || []}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DistributionPage;
