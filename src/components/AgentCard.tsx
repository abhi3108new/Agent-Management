
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agent, Contact } from '@/lib/types';
import { Mail, Phone, Trash, Edit, UserCircle } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  contacts?: Contact[];
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  className?: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ 
  agent, 
  contacts = [], 
  onEdit, 
  onDelete,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden transition-all-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <UserCircle className="h-5 w-5 mr-2 text-primary" />
            {agent.name}
          </CardTitle>
          {(onEdit || onDelete) && (
            <div className="flex space-x-1">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(agent)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDelete(agent)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              )}
            </div>
          )}
        </div>
        <CardDescription>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 mr-1.5" />
            {agent.email}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            {agent.mobile}
          </div>
        </CardDescription>
      </CardHeader>
      
      {contacts && contacts.length > 0 && (
        <CardContent className="pb-2">
          <div className="text-sm font-medium mb-2">Assigned Contacts ({contacts.length})</div>
          <div className="max-h-32 overflow-y-auto pr-1">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="text-sm py-1.5 px-2 rounded-md bg-secondary mb-1 last:mb-0"
              >
                <div className="font-medium">{contact.firstName}</div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        Added on {new Date(agent.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
