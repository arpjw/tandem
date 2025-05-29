
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Info, Loader2, SparklesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { analyzeInventory } from '@/ai/flows/inventory-analyzer'; // Placeholder for future AI call
// import type { AnalyzeInventoryOutput } from '@/ai/flows/inventory-analyzer';

function InventoryInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const industry = searchParams.get('industry');
  const { toast } = useToast();

  const [inventoryData, setInventoryData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null); // Simplified for now

  useEffect(() => {
    if (!industry) {
      toast({ title: "Error", description: "Industry not specified. Please go back.", variant: "destructive"});
      router.push('/buy/select-industry');
    }
  }, [industry, router, toast]);

  const handleAnalyzeInventory = async () => {
    if (!inventoryData.trim()) {
        toast({ title: "No Data", description: "Please enter some inventory data to analyze.", variant: "destructive"});
        return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // const result: AnalyzeInventoryOutput = await analyzeInventory({ inventoryData, industry: industry || 'Other' });
    // For now, just simulate a result
    const simulatedResult = `Based on your input for the ${industry} industry, consider reordering widgets and sprockets. Key materials seem to be steel and plastic.`;
    setAnalysisResult(simulatedResult);
    setIsAnalyzing(false);
    toast({ title: "Inventory Analysis Complete (Simulated)", description: "Review the suggestions below."});
  };

  const handleContinueWithAIProposal = () => {
    if (!analysisResult) {
        toast({title: "Analysis Required", description: "Please analyze inventory first or skip to manual proposal.", variant: "destructive"});
        return;
    }
    // Navigate to AI proposal generation page (to be created)
    // For now, this will be disabled or link to manual proposal
    router.push(`/opportunities/new?industry=${encodeURIComponent(industry || '')}&inventoryAnalysis=${encodeURIComponent(analysisResult)}&source=ai_inventory`);

  };


  if (!industry) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Loading industry information...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <PageTitle title="Buyer: Inventory Input (Optional)" description={`Industry: ${industry}`} />
          <CardDescription>
            Optionally, provide your current inventory data. Our AI can help analyze it to suggest resources or materials you might need for your proposal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="inventoryData" className="text-sm font-medium">Inventory Data</label>
            <Textarea
              id="inventoryData"
              placeholder="Paste or type your inventory list, material needs, or describe shortages here..."
              value={inventoryData}
              onChange={(e) => setInventoryData(e.target.value)}
              className="min-h-[150px]"
            />
            <p className="text-xs text-muted-foreground">
              This could be a list of items, current stock levels, or components you're running low on.
            </p>
          </div>
          <Button onClick={handleAnalyzeInventory} disabled={isAnalyzing || !inventoryData.trim()} className="w-full sm:w-auto">
            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SparklesIcon className="mr-2 h-4 w-4" />}
            Analyze Inventory (Simulated)
          </Button>

          {analysisResult && (
            <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h4 className="font-semibold mb-2 text-primary">AI Analysis Suggestion (Simulated):</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={() => router.push('/buy/select-industry')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" asChild>
                <Link href={`/opportunities/new?industry=${encodeURIComponent(industry || '')}`}>Skip to Manual Proposal</Link>
            </Button>
            <Button onClick={handleContinueWithAIProposal} disabled={!analysisResult}>
                Continue to Proposal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ProgressIndicator currentStep={2} totalSteps={4} />
    </div>
  );
}

export default function BuyerInventoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InventoryInputContent />
        </Suspense>
    )
}
