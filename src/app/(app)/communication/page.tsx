'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMessages, mockProjects, mockVendors } from '@/lib/mockData';
import type { CommunicationMessage, Project, Vendor } from '@/lib/types';

interface EnrichedMessage extends CommunicationMessage {
  projectName?: string;
  vendorName?: string;
}

export default function CommunicationPage() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('projectId');
  const initialVendorId = searchParams.get('vendorId');

  const [selectedConversation, setSelectedConversation] = useState<{ projectId: string, vendorId: string } | null>(null);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Create a list of unique conversations from mockMessages
  const conversations = mockMessages.reduce((acc, msg) => {
    const key = `${msg.projectId}-${msg.vendorId}`;
    if (!acc[key]) {
      const project = mockProjects.find(p => p.id === msg.projectId);
      const vendor = mockVendors.find(v => v.id === msg.vendorId);
      acc[key] = { 
        projectId: msg.projectId, 
        vendorId: msg.vendorId,
        projectName: project?.title || 'Unknown Project',
        vendorName: vendor?.name || 'Unknown Vendor',
        lastMessage: msg.content,
        lastMessageTimestamp: msg.timestamp,
      };
    }
    return acc;
  }, {} as Record<string, { projectId: string, vendorId: string, projectName: string, vendorName: string, lastMessage: string, lastMessageTimestamp: Date }>);

  const uniqueConversations = Object.values(conversations).sort((a,b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime());


  useEffect(() => {
    if (initialProjectId && initialVendorId) {
      setSelectedConversation({ projectId: initialProjectId, vendorId: initialVendorId });
    } else if (uniqueConversations.length > 0) {
      setSelectedConversation({ projectId: uniqueConversations[0].projectId, vendorId: uniqueConversations[0].vendorId });
    }
  }, [initialProjectId, initialVendorId]); // Removed uniqueConversations from deps to avoid re-running if it changes due to new messages

  useEffect(() => {
    if (selectedConversation) {
      const filteredMessages = mockMessages
        .filter(msg => msg.projectId === selectedConversation.projectId && msg.vendorId === selectedConversation.vendorId)
        .map(msg => {
          const project = mockProjects.find(p => p.id === msg.projectId);
          const vendor = mockVendors.find(v => v.id === msg.vendorId);
          return {
            ...msg,
            projectName: project?.title || 'Unknown Project',
            vendorName: vendor?.name || 'Unknown Vendor',
          };
        })
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(filteredMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const project = mockProjects.find(p => p.id === selectedConversation.projectId);
    const vendor = mockVendors.find(v => v.id === selectedConversation.vendorId);

    const msgToAdd: EnrichedMessage = {
      id: `msg${Date.now()}`,
      projectId: selectedConversation.projectId,
      vendorId: selectedConversation.vendorId,
      sender: 'user', // Assuming the current user is the 'user' (e.g., large business)
      content: newMessage.trim(),
      timestamp: new Date(),
      projectName: project?.title,
      vendorName: vendor?.name,
    };
    
    // This would normally be an API call
    mockMessages.push(msgToAdd); // Add to mock data for persistence in session
    setMessages(prev => [...prev, msgToAdd]);
    setNewMessage('');
  };

  const currentProject = selectedConversation ? mockProjects.find(p => p.id === selectedConversation.projectId) : null;
  const currentVendor = selectedConversation ? mockVendors.find(v => v.id === selectedConversation.vendorId) : null;

  return (
    <>
      <PageTitle 
        title="Communication Hub" 
        description="Connect and collaborate with vendors and businesses."
      />
      <div className="flex h-[calc(100vh-200px)] gap-6">
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-0">
              {uniqueConversations.map(convo => (
                <button
                  key={`${convo.projectId}-${convo.vendorId}`}
                  onClick={() => setSelectedConversation({ projectId: convo.projectId, vendorId: convo.vendorId })}
                  className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConversation?.projectId === convo.projectId && selectedConversation?.vendorId === convo.vendorId ? 'bg-muted' : ''}`}
                >
                  <p className="font-semibold">{convo.projectName}</p>
                  <p className="text-sm text-muted-foreground">with {convo.vendorName}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{convo.lastMessage}</p>
                </button>
              ))}
              {uniqueConversations.length === 0 && <p className="p-4 text-sm text-muted-foreground">No conversations yet.</p>}
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="w-2/3 flex flex-col">
          {selectedConversation && currentProject && currentVendor ? (
            <>
              <CardHeader className="border-b">
                <CardTitle>Chat with {currentVendor.name}</CardTitle>
                <CardDescription>Regarding project: {currentProject.title}</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow p-6 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender === 'user' ? 'https://placehold.co/100x100.png' : currentVendor.imageUrl || 'https://placehold.co/100x100.png'} data-ai-hint={msg.sender === 'user' ? 'user avatar' : 'vendor avatar'} />
                        <AvatarFallback>{msg.sender === 'user' ? 'U' : currentVendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                 {messages.length === 0 && <p className="text-center text-sm text-muted-foreground">No messages in this conversation yet. Start chatting!</p>}
              </ScrollArea>
              <CardFooter className="border-t pt-4">
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                  <Input 
                    type="text" 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a conversation to start chatting.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
