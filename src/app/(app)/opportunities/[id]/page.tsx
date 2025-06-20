
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react'; // Added useEffect, useState
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, DollarSign, CalendarDays, ListChecks, Brain, Users, MessageSquare, Target, Milestone, Building, ShieldCheck, Flag, Award, AlertTriangle, Briefcase, HandCoins, HelpCircle, ThumbsDown, ThumbsUp, Handshake } from 'lucide-react';
import { mockOpportunities, mockSuppliers } from '@/lib/mockData'; 
import type { Opportunity, Supplier, OpportunityBid } from '@/lib/types'; 
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';


// Helper function to estimate max budget value (simplified)
const getOpportunityMaxBudget = (budgetStr?: string): number => {
  if (!budgetStr) return Infinity;
  const numbers = budgetStr.match(/\d+[\,\d+]*/g)?.map(s => parseInt(s.replace(/,/g, ''), 10)) || [];
  return numbers.length > 0 ? Math.max(...numbers) : Infinity;
};

// Client-side component for formatting bid amount
const BidAmountBadge = ({ amount }: { amount: number }) => {
  const [formattedAmount, setFormattedAmount] = useState<string | null>(null);

  useEffect(() => {
    setFormattedAmount(amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
  }, [amount]);

  return (
    <Badge variant="default" className="bg-green-100 text-green-700 border-green-300 hover:bg-green-200 py-1 px-2.5">
      Bid: {formattedAmount || '...'}
    </Badge>
  );
};


function OpportunityDetailsContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const isUserVerified = searchParams.get('verified') === 'true'; 

  const opportunity = mockOpportunities.find(p => p.id === params.id);

  const biddingSupplierIds = opportunity?.bids?.map(bid => bid.supplierId) || [];
  
  const allSuppliers = mockSuppliers; 

  const verifiedMatchedSuppliers = allSuppliers.filter(s => 
    s.isVerified && 
    (s.expertise.some(exp => opportunity?.requiredSkills.includes(exp)) || 
     opportunity?.diversityGoals?.some(dg => s.certifications?.includes(dg.type)))
  ).slice(0, 5); 

  const suppliersWhoBid = allSuppliers.filter(s => biddingSupplierIds.includes(s.id));

  const displaySuppliers = [
    ...suppliersWhoBid, 
    ...verifiedMatchedSuppliers.filter(s => !biddingSupplierIds.includes(s.id)), 
  ].filter((value, index, self) => index === self.findIndex((t) => (t.id === value.id))); 


  const opportunityMaxBudget = getOpportunityMaxBudget(opportunity?.budget);
  const showProvisionalSuppliers = opportunityMaxBudget <= 20000;

  const provisionalSuppliers = showProvisionalSuppliers ? 
    allSuppliers.filter(s => !s.isVerified && 
      (s.expertise.some(exp => opportunity?.requiredSkills.includes(exp)) || 
      opportunity?.diversityGoals?.some(dg => s.certifications?.includes(dg.type))) &&
      !displaySuppliers.find(ds => ds.id === s.id) 
    ).slice(0, 2) 
    : [];

  const handleAskToBid = (supplierName: string) => {
    toast({
        title: "Request Sent (Simulated)",
        description: `${supplierName} has been notified and asked to bid on this opportunity.`,
    });
  };


  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Opportunity not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The subcontracting opportunity you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href={`/opportunities${isUserVerified ? '?verified=true' : ''}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities
          </Link>
        </Button>
      </div>
    );
  }
  
  const fromNew = searchParams.get('from') === 'new';
  const contractFinalized = searchParams.get('contract') === 'finalized';

  return (
    <>
      <PageTitle
        title={opportunity.title}
        description={opportunity.companyBackground || "Detailed opportunity information and requirements."}
        action={
           <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/opportunities${isUserVerified ? '?verified=true' : ''}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities</Link>
            </Button>
             <Button disabled> 
              <Edit className="mr-2 h-4 w-4" /> Edit Opportunity
            </Button>
          </div>
        }
      />

      {fromNew && (
        <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
          <ThumbsUp className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Opportunity Successfully Posted!</AlertTitle>
          <AlertDescription className="text-green-600">
            Your opportunity is now live. You can view matched suppliers below or share the link directly.
          </AlertDescription>
        </Alert>
      )}
      {contractFinalized && (
         <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
          <Handshake className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700">Contract Finalized!</AlertTitle>
          <AlertDescription className="text-green-600">
            The agreement for this opportunity has been finalized.
          </AlertDescription>
        </Alert>
      )}

      {!isUserVerified && ( 
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification May Be Required for Full Actions</AlertTitle>
          <AlertDescription>
            As a buyer, some actions like accepting bids might require your own profile verification.
            Suppliers must be verified to be fully matched.
          </AlertDescription>
        </Alert>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8`}>
        <div className="lg:col-span-2 space-y-8">
          <Card>
             {opportunity.imageUrl && (
              <div className="relative h-60 w-full rounded-t-lg overflow-hidden">
                <Image src={opportunity.imageUrl} alt={`${opportunity.title} cover image`} layout="fill" objectFit="cover" data-ai-hint="contract agreement deal"/>
              </div>
            )}
            <CardHeader className={opportunity.imageUrl ? "pt-6 border-t" : "pt-6"}>
              <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
              {opportunity.setAsideStatus && <Badge variant="outline" className="mt-2 w-fit text-sm py-1 px-3">{opportunity.setAsideStatus}</Badge>}
            </CardHeader>
            <CardContent className="space-y-6">
              {opportunity.companyBackground && ( <> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> Posting Organization Background</h3> <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.companyBackground}</p> </div> <Separator /> </> )}
              <div> <h3 className="text-lg font-semibold mb-2">Opportunity Description</h3> <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p> </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div> <h4 className="text-md font-semibold mb-2 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Budget / Value</h4> <p className="text-muted-foreground">{opportunity.budget}</p> </div>
                <div> <h4 className="text-md font-semibold mb-2 flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Timeline / Duration</h4> <p className="text-muted-foreground">{opportunity.timeline}</p> </div>
              </div>
               {opportunity.opportunityType && ( <> <Separator /> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Opportunity Type</h3> <p className="text-muted-foreground">{opportunity.opportunityType}</p> </div> </> )}
              {opportunity.keyDeliverables && opportunity.keyDeliverables.length > 0 && ( <> <Separator /> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><Milestone className="mr-2 h-5 w-5 text-primary" /> Key Deliverables</h3> <ul className="list-disc list-inside text-muted-foreground space-y-1"> {opportunity.keyDeliverables.map((deliverable, index) => ( <li key={index}>{deliverable}</li> ))} </ul> </div> </> )}
               <Separator />
              <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Required Skills & Capabilities</h3> <div className="flex flex-wrap gap-2"> {opportunity.requiredSkills.map((skill) => ( <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge> ))} </div> </div>
              {opportunity.diversityGoals && opportunity.diversityGoals.length > 0 && ( <> <Separator /> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Supplier Diversity Goals</h3> <div className="space-y-2"> {opportunity.diversityGoals.map((goal, index) => ( <div key={index} className="p-2 border rounded-md bg-muted/30"> <p className="font-medium">{goal.type} {goal.percentage && <span className="ml-2 text-sm text-muted-foreground">({goal.percentage}% target)</span>} </p> {goal.description && <p className="text-xs text-muted-foreground">{goal.description}</p>} </div> ))} </div> </div> </> )}
              {opportunity.complianceRequirements && opportunity.complianceRequirements.length > 0 && ( <> <Separator /> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Compliance Requirements</h3> <div className="flex flex-wrap gap-2"> {opportunity.complianceRequirements.map((compliance, index) => ( <Badge key={index} variant="outline" className="text-sm">{compliance}</Badge> ))} </div> </div> </> )}
              {(opportunity.aiSuggestedSkills || opportunity.aiSuggestedExperience || opportunity.aiSuggestedVendorQualifications) && ( <> <Separator /> <div> <h3 className="text-lg font-semibold mb-2 flex items-center"><Brain className="mr-2 h-5 w-5 text-primary" /> AI Analysis & Insights</h3> <div className="space-y-4 p-4 bg-secondary/30 rounded-md border"> {opportunity.aiSuggestedSkills && opportunity.aiSuggestedSkills.length > 0 && ( <div> <h4 className="text-md font-semibold mb-1">AI Suggested Skills:</h4>  <div className="flex flex-wrap gap-2"> {opportunity.aiSuggestedSkills.map(skill => ( <Badge key={skill} variant="default">{skill}</Badge> ))} </div> </div> )} {opportunity.aiSuggestedExperience && ( <div> <h4 className="text-md font-semibold mb-1 mt-2">AI Suggested Experience:</h4> <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.aiSuggestedExperience}</p> </div> )} {opportunity.aiSuggestedVendorQualifications && ( <div> <h4 className="text-md font-semibold mb-1 mt-2">AI Suggested Supplier Qualifications:</h4> <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.aiSuggestedVendorQualifications}</p> </div> )} </div> </div> </> )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
                <Button variant="default" size="lg" asChild={!isUserVerified} disabled={!isUserVerified}>
                   {isUserVerified ? ( <Link href={`#`}> Bid </Link> ) : ( <span>Bid</span> )}
                </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Potential Suppliers</CardTitle>
              <CardDescription>Suppliers who may be a good fit or have bid.</CardDescription>
            </CardHeader>
            <CardContent>
              {displaySuppliers.length > 0 ? (
                <ul className="space-y-4">
                  {displaySuppliers.map((supplier) => {
                    const bid = opportunity.bids?.find(b => b.supplierId === supplier.id && b.status === 'pending');
                    return (
                      <li key={supplier.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/10 transition-colors">
                        {supplier.imageUrl && <Image src={supplier.imageUrl} alt={supplier.name} width={48} height={48} className="rounded-full h-12 w-12 object-cover" data-ai-hint="business team logo"/>}
                        {!supplier.imageUrl && <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold">{supplier.name.charAt(0)}</div>}
                        <div className="flex-1">
                          <Link href={`/suppliers/${supplier.id}?verified=${isUserVerified}&opportunityId=${opportunity.id}`} className="font-semibold text-primary hover:underline" prefetch={false}>
                            {supplier.name} {supplier.isVerified && <ShieldCheck className="inline h-4 w-4 ml-1 text-green-500" title="Verified Supplier"/>}
                            {!supplier.isVerified && <Badge variant="outline" className="ml-1 text-xs border-amber-500 text-amber-600">Provisional</Badge>}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-2">{supplier.businessDescription}</p>
                          {supplier.certifications && supplier.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {supplier.certifications.slice(0,2).map(cert => <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>)}
                            </div>
                          )}
                          <div className="mt-2 flex flex-col sm:flex-row gap-2 items-start">
                            {bid ? (
                               <BidAmountBadge amount={bid.amount} />
                            ) : (
                              supplier.isVerified && 
                              <Button variant="outline" size="sm" onClick={() => handleAskToBid(supplier.name)} disabled={!isUserVerified}>
                                <HandCoins className="mr-1.5 h-3 w-3" /> Ask to Bid
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild className="text-primary p-0 h-auto hover:bg-transparent">
                                <Link href={`/communication?opportunityId=${opportunity.id}&supplierId=${supplier.id}${isUserVerified ? '&verified=true' : ''}`}>
                                    <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                                </Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific suppliers matched or bidding yet. AI matching is in progress or broaden criteria.</p>
              )}

              {provisionalSuppliers.length > 0 && (
                <>
                  <Separator className="my-4"/>
                  <h4 className="text-md font-semibold mb-2 flex items-center">
                    Other Potential Suppliers (Provisional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="ml-1.5 h-4 w-4 text-muted-foreground"/></TooltipTrigger>
                        <TooltipContent><p>Not fully verified, may be suitable for smaller value opportunities.</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h4>
                  <ul className="space-y-4">
                    {provisionalSuppliers.map((supplier) => (
                       <li key={supplier.id} className="flex items-start space-x-3 p-3 border border-dashed rounded-md hover:bg-accent/10 transition-colors opacity-80">
                        {supplier.imageUrl && <Image src={supplier.imageUrl} alt={supplier.name} width={48} height={48} className="rounded-full h-12 w-12 object-cover" data-ai-hint="business team logo"/>}
                        {!supplier.imageUrl && <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold">{supplier.name.charAt(0)}</div>}
                        <div className="flex-1">
                          <Link href={`/suppliers/${supplier.id}?verified=${isUserVerified}&opportunityId=${opportunity.id}`} className="font-semibold text-primary hover:underline" prefetch={false}>
                            {supplier.name} <Badge variant="outline" className="ml-1 text-xs border-amber-500 text-amber-600">Provisional</Badge>
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-2">{supplier.businessDescription}</p>
                           <div className="mt-2">
                            <Button variant="ghost" size="sm" asChild className="text-primary p-0 h-auto hover:bg-transparent">
                                <Link href={`/communication?opportunityId=${opportunity.id}&supplierId=${supplier.id}${isUserVerified ? '&verified=true' : ''}`}>
                                    <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                                </Link>
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="link" asChild className="w-full text-primary hover:text-primary/80" disabled={!isUserVerified}>
                   <Link href={`/suppliers?verified=${isUserVerified}`}>View all AI matches</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}


export default function OpportunityDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading opportunity details...</div>}>
      <OpportunityDetailsContent params={params} />
    </Suspense>
  );
}

    