
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMessages, mockOpportunities, mockVendors } from '@/lib/mockData'; // Using mockOpportunities
import type { CommunicationMessage, Opportunity, Vendor } from '@/lib/types'; // Using Opportunity

interface EnrichedMessage extends CommunicationMessage {
  opportunityTitle?: string; // Changed from projectName
  vendorName?: string;
}

export default function CommunicationPage() {
  const searchParams = useSearchParams();
  const initialOpportunityId = searchParams.get('opportunityId'); // Changed from projectId
  const initialVendorId = searchParams.get('vendorId');

  const [selectedConversation, setSelectedConversation] = useState<{ opportunityId: string, vendorId: string } | null>(null);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Group messages by opportunityId and vendorId to create conversations
  const conversations = mockMessages.reduce((acc, msg) => {
    const key = `${msg.opportunityId}-${msg.vendorId}`; // Changed from projectId
    if (!acc[key]) {
      const opportunity = mockOpportunities.find(p => p.id === msg.opportunityId); // Changed from project
      const vendor = mockVendors.find(v => v.id === msg.vendorId);
      
      const latestMessageForConvo = mockMessages
        .filter(m => m.opportunityId === msg.opportunityId && m.vendorId === msg.vendorId)
        .sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      acc[key] = { 
        opportunityId: msg.opportunityId, 
        vendorId: msg.vendorId,
        opportunityTitle: opportunity?.title || 'Unknown Opportunity', // Changed from projectName
        vendorName: vendor?.name || 'Unknown Vendor',
        lastMessage: latestMessageForConvo?.content || 'No messages yet.',
        lastMessageTimestamp: latestMessageForConvo?.timestamp || new Date(0),
        isVendorVerified: vendor?.isVerified || false,
      };
    }
    return acc;
  }, {} as Record<string, { opportunityId: string, vendorId: string, opportunityTitle: string, vendorName: string, lastMessage: string, lastMessageTimestamp: Date, isVendorVerified: boolean }>);

  const uniqueConversations = Object.values(conversations).sort((a,b) => b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime());


  useEffect(() => {
    if (initialOpportunityId && initialVendorId) {
      setSelectedConversation({ opportunityId: initialOpportunityId, vendorId: initialVendorId });
    } else if (uniqueConversations.length > 0 && !selectedConversation) {
      setSelectedConversation({ opportunityId: uniqueConversations[0].opportunityId, vendorId: uniqueConversations[0].vendorId });
    }
  }, [initialOpportunityId, initialVendorId, uniqueConversations, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      const filteredMessages = mockMessages
        .filter(msg => msg.opportunityId === selectedConversation.opportunityId && msg.vendorId === selectedConversation.vendorId)
        .map(msg => {
          const opportunity = mockOpportunities.find(p => p.id === msg.opportunityId);
          const vendor = mockVendors.find(v => v.id === msg.vendorId);
          return {
            ...msg,
            opportunityTitle: opportunity?.title || 'Unknown Opportunity',
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

    const opportunity = mockOpportunities.find(p => p.id === selectedConversation.opportunityId);
    const vendor = mockVendors.find(v => v.id === selectedConversation.vendorId);

    const msgToAdd: EnrichedMessage = {
      id: `msg${Date.now()}`,
      opportunityId: selectedConversation.opportunityId,
      vendorId: selectedConversation.vendorId,
      sender: 'user', // Assume 'user' is the prime contractor in this context
      content: newMessage.trim(),
      timestamp: new Date(),
      opportunityTitle: opportunity?.title,
      vendorName: vendor?.name,
    };
    
    // In a real app, this would be an API call
    mockMessages.push(msgToAdd); 
    setMessages(prev => [...prev, msgToAdd]);
    setNewMessage('');
    // Update last message in uniqueConversations for immediate UI update
    const convoKey = `${selectedConversation.opportunityId}-${selectedConversation.vendorId}`;
    if(conversations[convoKey]) {
        conversations[convoKey].lastMessage = msgToAdd.content;
        conversations[convoKey].lastMessageTimestamp = msgToAdd.timestamp;
    }
    // Consider re-sorting uniqueConversations or updating the specific item.
  };

  const currentOpportunity = selectedConversation ? mockOpportunities.find(p => p.id === selectedConversation.opportunityId) : null;
  const currentVendor = selectedConversation ? mockVendors.find(v => v.id === selectedConversation.vendorId) : null;

  return (
    <>
      <PageTitle 
        title="Communication Hub" 
        description="Connect and collaborate with SMBs on subcontracting opportunities."
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
                  key={`${convo.opportunityId}-${convo.vendorId}`}
                  onClick={() => setSelectedConversation({ opportunityId: convo.opportunityId, vendorId: convo.vendorId })}
                  className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConversation?.opportunityId === convo.opportunityId && selectedConversation?.vendorId === convo.vendorId ? 'bg-muted shadow-inner' : ''}`}
                >
                  <p className="font-semibold">{convo.opportunityTitle}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    with {convo.vendorName}
                    {convo.isVendorVerified && <ShieldCheck className="ml-1.5 h-4 w-4 text-green-500" title="Verified Vendor" />}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{convo.lastMessage}</p>
                   <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {new Date(convo.lastMessageTimestamp).toLocaleDateString([], { day: 'numeric', month: 'short'})}
                    {' at '}
                    {new Date(convo.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))}
              {uniqueConversations.length === 0 && <p className="p-4 text-sm text-muted-foreground">No conversations yet. Start by contacting a vendor about an opportunity.</p>}
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="w-2/3 flex flex-col">
          {selectedConversation && currentOpportunity && currentVendor ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  Chat with {currentVendor.name}
                  {currentVendor.isVerified && <ShieldCheck className="ml-2 h-5 w-5 text-green-500" title="Verified Vendor"/>}
                </CardTitle>
                <CardDescription>Regarding opportunity: {currentOpportunity.title}</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow p-6 space-y-4 bg-muted/20">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender === 'user' ? 'https://placehold.co/100x100.png' : currentVendor.imageUrl || 'https://placehold.co/100x100.png'} data-ai-hint={msg.sender === 'user' ? 'prime contract manager' : 'vendor representative'} />
                        <AvatarFallback>{msg.sender === 'user' ? 'ME' : currentVendor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                 {messages.length === 0 && <p className="text-center text-sm text-muted-foreground pt-10">No messages in this conversation yet. Start chatting!</p>}
              </ScrollArea>
              <CardFooter className="border-t pt-4 bg-background">
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
              {uniqueConversations.length === 0 && <p className="text-sm text-muted-foreground mt-2">Find an opportunity and contact a vendor to begin.</p>}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
