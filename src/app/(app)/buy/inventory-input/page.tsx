
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
import { analyzeInventory } from '@/ai/flows/inventory-analyzer';
import type { AnalyzeInventoryOutput } from '@/ai/flows/inventory-analyzer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

function InventoryInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const industry = searchParams.get('industry');
  const { toast } = useToast();

  const [inventoryData, setInventoryData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeInventoryOutput | null>(null);

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
    try {
      const result = await analyzeInventory({ inventoryData, industry: industry || 'Other' });
      setAnalysisResult(result);
      toast({ title: "Inventory Analysis Complete", description: "Review the AI suggestions below."});
    } catch (error) {
        console.error("AI Inventory Analysis Error:", error);
        toast({ title: "AI Analysis Failed", description: "Could not analyze inventory. Please try again or skip this step.", variant: "destructive"});
        setAnalysisResult({ // Provide a fallback structure
            analysisSummary: "AI analysis could not be completed. Please review inventory manually or provide more detailed data.",
            reorderSuggestions: [],
            keyMaterials: [],
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleContinueWithAIProposal = () => {
    if (!analysisResult || !analysisResult.analysisSummary) { // Check for summary as a proxy for successful/fallback analysis
        toast({title: "Analysis Required", description: "Please analyze inventory first or skip to manual proposal.", variant: "destructive"});
        return;
    }
    // Navigate to AI proposal generation page (integrated into new opportunity page)
    router.push(`/opportunities/new?industry=${encodeURIComponent(industry || '')}&inventoryAnalysis=${encodeURIComponent(JSON.stringify(analysisResult))}&source=ai_inventory`);
  };


  if (!industry) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Loading industry information...</p>
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
            Analyze Inventory
          </Button>

          {analysisResult && (
            <Alert className="mt-4" variant={analysisResult.analysisSummary?.includes("could not be completed") ? "destructive" : "default"}>
                <Info className="h-4 w-4" />
                <AlertTitle>AI Inventory Analysis</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p className="font-medium">{analysisResult.analysisSummary}</p>
                    {analysisResult.reorderSuggestions && analysisResult.reorderSuggestions.length > 0 && (
                        <div>
                            <h5 className="font-semibold text-sm">Reorder Suggestions:</h5>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {analysisResult.reorderSuggestions.map((item, idx) => <Badge key={idx} variant="secondary">{item}</Badge>)}
                            </div>
                        </div>
                    )}
                    {analysisResult.keyMaterials && analysisResult.keyMaterials.length > 0 && (
                         <div>
                            <h5 className="font-semibold text-sm">Key Materials Identified:</h5>
                             <div className="flex flex-wrap gap-1 mt-1">
                                {analysisResult.keyMaterials.map((item, idx) => <Badge key={idx} variant="outline">{item}</Badge>)}
                            </div>
                        </div>
                    )}
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button variant="outline" onClick={() => router.push('/buy/select-industry')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" asChild>
                <Link href={`/opportunities/new?industry=${encodeURIComponent(industry || '')}&source=manual`}>Skip to Manual Proposal</Link>
            </Button>
            <Button onClick={handleContinueWithAIProposal} disabled={!analysisResult || !analysisResult.analysisSummary}>
                Continue to AI Drafted Proposal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ProgressIndicator currentStep={2} totalSteps={4} className="pb-4" />
    </div>
  );
}

export default function BuyerInventoryPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading...</p></div>}>
            <InventoryInputContent />
        </Suspense>
    )
}
