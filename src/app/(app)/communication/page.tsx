
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTitle } from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMessages, mockOpportunities, mockSuppliers } from '@/lib/mockData';
import type { CommunicationMessage, Opportunity, Supplier } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

interface EnrichedMessage extends CommunicationMessage {
  opportunityTitle?: string;
  supplierName?: string;
}

// Helper component for client-side date formatting
const FormattedTimestamp = ({ timestamp, formatType }: { timestamp: Date | string; formatType: 'conversation' | 'message' }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (timestamp) {
      const dateObj = new Date(timestamp);
      if (formatType === 'conversation') {
        setFormattedDate(
          `${dateObj.toLocaleDateString([], { day: 'numeric', month: 'short'})} at ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        );
      } else if (formatType === 'message') {
        setFormattedDate(
          dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
    }
  }, [timestamp, formatType]);

  return <>{formattedDate || '...'}</>; // Show placeholder while loading
};


function CommunicationContent() {
  const searchParams = useSearchParams();
  const initialOpportunityId = searchParams.get('opportunityId');
  const initialSupplierId = searchParams.get('supplierId');
  const isUserVerified = searchParams.get('verified') === 'true';

  const [selectedConversation, setSelectedConversation] = useState<{ opportunityId: string, supplierId: string } | null>(null);
  const [messages, setMessages] = useState<EnrichedMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const conversations = mockMessages.reduce((acc, msg) => {
    const key = `${msg.opportunityId}-${msg.supplierId}`;
    if (!acc[key]) {
      const opportunity = mockOpportunities.find(p => p.id === msg.opportunityId);
      const supplier = mockSuppliers.find(v => v.id === msg.supplierId);

      const latestMessageForConvo = mockMessages
        .filter(m => m.opportunityId === msg.opportunityId && m.supplierId === msg.supplierId)
        .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      acc[key] = {
        opportunityId: msg.opportunityId,
        supplierId: msg.supplierId,
        opportunityTitle: opportunity?.title || 'Unknown Opportunity',
        supplierName: supplier?.name || 'Unknown Supplier',
        lastMessage: latestMessageForConvo?.content || 'No messages yet.',
        lastMessageTimestamp: latestMessageForConvo?.timestamp || new Date(0),
        isSupplierVerified: supplier?.isVerified || false,
      };
    }
    return acc;
  }, {} as Record<string, { opportunityId: string, supplierId: string, opportunityTitle: string, supplierName: string, lastMessage: string, lastMessageTimestamp: Date, isSupplierVerified: boolean }>);

  const uniqueConversations = Object.values(conversations).sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime());


  useEffect(() => {
    if (initialOpportunityId && initialSupplierId) {
      setSelectedConversation({ opportunityId: initialOpportunityId, supplierId: initialSupplierId });
    } else if (uniqueConversations.length > 0 && !selectedConversation) {
      // Don't auto-select if not verified
    }
  }, [initialOpportunityId, initialSupplierId, uniqueConversations, selectedConversation]);

  useEffect(() => {
    if (selectedConversation && isUserVerified) {
      const filteredMessages = mockMessages
        .filter(msg => msg.opportunityId === selectedConversation.opportunityId && msg.supplierId === selectedConversation.supplierId)
        .map(msg => {
          const opportunity = mockOpportunities.find(p => p.id === msg.opportunityId);
          const supplier = mockSuppliers.find(v => v.id === msg.supplierId);
          return {
            ...msg,
            opportunityTitle: opportunity?.title || 'Unknown Opportunity',
            supplierName: supplier?.name || 'Unknown Supplier',
          };
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(filteredMessages);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, isUserVerified]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !isUserVerified) return;

    const opportunity = mockOpportunities.find(p => p.id === selectedConversation.opportunityId);
    const supplier = mockSuppliers.find(v => v.id === selectedConversation.supplierId);

    const msgToAdd: EnrichedMessage = {
      id: `msg${Date.now()}`,
      opportunityId: selectedConversation.opportunityId,
      supplierId: selectedConversation.supplierId,
      sender: 'user', 
      content: newMessage.trim(),
      timestamp: new Date(),
      opportunityTitle: opportunity?.title,
      supplierName: supplier?.name,
    };

    mockMessages.push(msgToAdd);
    setMessages(prev => [...prev, msgToAdd]);
    setNewMessage('');
    const convoKey = `${selectedConversation.opportunityId}-${selectedConversation.supplierId}`;
    if(conversations[convoKey]) {
        conversations[convoKey].lastMessage = msgToAdd.content;
        conversations[convoKey].lastMessageTimestamp = msgToAdd.timestamp;
    }
  };

  const currentOpportunity = selectedConversation ? mockOpportunities.find(p => p.id === selectedConversation.opportunityId) : null;
  const currentSupplier = selectedConversation ? mockSuppliers.find(v => v.id === selectedConversation.supplierId) : null;

  return (
    <>
      <PageTitle
        title="Communication Hub"
        description="Connect and collaborate with SMBs on subcontracting opportunities."
      />

      {!isUserVerified && (
         <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            You must be a verified user to use the communication hub. If you are a supplier, please
            <Button variant="link" asChild className="p-0 h-auto ml-1 text-destructive hover:text-destructive/80">
              <Link href="/suppliers/onboarding/industry">Complete Verification</Link>
            </Button>
            . Buyers may also need verification for certain actions.
          </AlertDescription>
        </Alert>
      )}

      <div className={`flex h-[calc(100vh-200px)] gap-6 ${!isUserVerified ? 'opacity-50 pointer-events-none blur-sm' : ''}`}>
        <Card className="w-1/3 flex flex-col">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-0">
              {uniqueConversations.map(convo => (
                <button
                  key={`${convo.opportunityId}-${convo.supplierId}`}
                  onClick={() => setSelectedConversation({ opportunityId: convo.opportunityId, supplierId: convo.supplierId })}
                  className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConversation?.opportunityId === convo.opportunityId && selectedConversation?.supplierId === convo.supplierId ? 'bg-muted shadow-inner' : ''}`}
                  disabled={!isUserVerified}
                >
                  <p className="font-semibold">{convo.opportunityTitle}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    with {convo.supplierName}
                    {convo.isSupplierVerified && <ShieldCheck className="ml-1.5 h-4 w-4 text-green-500" title="Verified Supplier" />}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{convo.lastMessage}</p>
                   <p className="text-xs text-muted-foreground/70 mt-0.5">
                    <FormattedTimestamp timestamp={convo.lastMessageTimestamp} formatType="conversation" />
                  </p>
                </button>
              ))}
              {uniqueConversations.length === 0 && isUserVerified && <p className="p-4 text-sm text-muted-foreground">No conversations yet. Start by contacting a supplier about an opportunity.</p>}
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="w-2/3 flex flex-col">
          {selectedConversation && currentOpportunity && currentSupplier && isUserVerified ? (
            <>
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  Chat with {currentSupplier.name}
                  {currentSupplier.isVerified && <ShieldCheck className="ml-2 h-5 w-5 text-green-500" title="Verified Supplier"/>}
                </CardTitle>
                <CardDescription>Regarding opportunity: {currentOpportunity.title}</CardDescription>
              </CardHeader>
              <ScrollArea className="flex-grow p-6 space-y-4 bg-muted/20">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender === 'user' ? 'https://placehold.co/100x100.png' : currentSupplier.imageUrl || 'https://placehold.co/100x100.png'} data-ai-hint={msg.sender === 'user' ? 'prime contract manager' : 'supplier representative'} />
                        <AvatarFallback>{msg.sender === 'user' ? 'ME' : currentSupplier.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                          <FormattedTimestamp timestamp={msg.timestamp} formatType="message" />
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
                    disabled={!isUserVerified}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || !isUserVerified}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {isUserVerified ? "Select a conversation to start chatting." : "Please verify your profile to access communications."}
              </p>
              {uniqueConversations.length === 0 && isUserVerified && <p className="text-sm text-muted-foreground mt-2">Find an opportunity and contact a supplier to begin.</p>}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}

export default function CommunicationPage() {
  return (
    <Suspense fallback={<div>Loading communications...</div>}>
      <CommunicationContent />
    </Suspense>
  )
}

