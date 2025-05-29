
'use client';

import { Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { mockOpportunities, mockSuppliers } from '@/lib/mockData';
import { ArrowLeft, FileText, Loader2, Users, Handshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ContractGenerationContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const opportunityId = params.opportunityId as string;
  const supplierId = params.supplierId as string;
  const buyerIsVerified = searchParams.get('verified') === 'true'; // Buyer's verification status

  const opportunity = mockOpportunities.find(op => op.id === opportunityId);
  const supplier = mockSuppliers.find(sup => sup.id === supplierId);

  const handleFinalizeContract = () => {
    toast({
        title: "Contract Finalized (Simulated)",
        description: `Agreement between Your Company and ${supplier?.name || 'Supplier'} for "${opportunity?.title || 'Opportunity'}" is now active.`,
    });
    // In a real app, update bid status, notify parties, etc.
    // Navigate to the opportunity or dashboard
    router.push(`/opportunities/${opportunityId}?verified=true&contract=finalized`);
  };

  if (!opportunity || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading contract details...</p>
        {!opportunity && <p className="text-sm text-destructive">Opportunity not found.</p>}
        {!supplier && <p className="text-sm text-destructive">Supplier not found.</p>}
         <Button variant="outline" onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }
  
  // Placeholder: Buyer's company name. In a real app, this would come from the logged-in user's profile.
  const buyerCompanyName = "Prime Contract Solutions Inc."; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <PageTitle title="Contract Agreement" description="Review and finalize the agreement." />
           <div className="flex items-center text-sm text-muted-foreground">
                <Handshake className="mr-2 h-5 w-5 text-primary" />
                <span>Opportunity: {opportunity.title}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-5 w-5 text-primary" />
                <span>Supplier: {supplier.name}</span>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 border rounded-md bg-card min-h-[300px]">
            <h2 className="text-xl font-semibold mb-4 text-center">Subcontracting Agreement</h2>
            <p className="text-sm text-muted-foreground mb-4">
              This Subcontracting Agreement ("Agreement") is made and entered into as of {new Date().toLocaleDateString()}
              by and between:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-primary">Procuring Party (Buyer):</h3>
                <p>{buyerCompanyName}</p>
                {/* Add address etc. if available */}
              </div>
              <div>
                <h3 className="font-semibold text-primary">Supplying Party (Supplier):</h3>
                <p>{supplier.name}</p>
                {/* Add address etc. if available */}
              </div>
            </div>

            <h3 className="font-semibold mb-2">1. Scope of Work:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The Supplier agrees to perform services and/or provide materials for the project titled: <strong className="text-foreground">"{opportunity.title}"</strong>.
              Detailed scope, deliverables, and specifications are as outlined in the original opportunity posting (ID: {opportunity.id}) and any mutually agreed upon amendments, which are incorporated herein by reference.
            </p>
            
            <h3 className="font-semibold mb-2">2. Compensation:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The agreed upon compensation for the satisfactory completion of the Scope of Work is <strong className="text-foreground">{opportunity.budget}</strong> (or as per accepted bid amount if different and specified). Payment terms to be mutually agreed upon.
            </p>

            <h3 className="font-semibold mb-2">3. Term:</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The term of this Agreement shall commence on {new Date().toLocaleDateString()} and continue until project completion as per timeline <strong className="text-foreground">"{opportunity.timeline}"</strong>, unless terminated earlier in accordance with the provisions of this Agreement.
            </p>
            
            <p className="text-xs text-muted-foreground mt-6">
                (This is a simplified placeholder contract. A real contract would include many more clauses covering intellectual property, confidentiality, termination, dispute resolution, governing law, etc.)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="space-y-2">
              <label htmlFor="buyerSignature" className="text-sm font-medium">Buyer Signature:</label>
              <div className="h-12 border-b border-input bg-muted/30 rounded-t-md p-2">
                {/* Placeholder for digital signature component or typed name */}
                 <p className="text-sm text-muted-foreground italic">Signed by {buyerCompanyName} representative</p>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="supplierSignature" className="text-sm font-medium">Supplier Signature:</label>
              <div className="h-12 border-b border-input bg-muted/30 rounded-t-md p-2">
                {/* Placeholder for digital signature component or typed name */}
                <p className="text-sm text-muted-foreground italic">Signed by {supplier.name} representative</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleFinalizeContract} disabled={!buyerIsVerified}>
             <FileText className="mr-2 h-4 w-4" />
            Finalize Contract (Simulated)
          </Button>
        </CardFooter>
      </Card>
      {buyerIsVerified && <ProgressIndicator currentStep={4} totalSteps={4} className="pb-4" />}
    </div>
  );
}


export default function ContractPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading contract...</p></div>}>
            <ContractGenerationContent />
        </Suspense>
    )
}

