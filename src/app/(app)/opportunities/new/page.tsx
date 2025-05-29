
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { analyzeOpportunity } from '@/ai/flows/opportunity-analyzer';
import type { AnalyzeOpportunityOutput } from '@/ai/flows/opportunity-analyzer';
import { generateProposalFromInventory } from '@/ai/flows/proposal-generator';
import type { AnalyzeInventoryOutput } from '@/ai/flows/inventory-analyzer';
import { ArrowLeft, Loader2, Sparkles, ListChecks, Brain, Users, Target, Milestone, Building, ShieldCheck, Flag, Award } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const opportunityFormSchema = z.object({
  title: z.string().min(5, { message: "Opportunity title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  budget: z.string().min(3, { message: "Please specify the budget or value." }),
  timeline: z.string().min(3, { message: "Please specify the timeline." }),
  requiredSkills: z.string().min(3, { message: "List at least one required skill (comma-separated)." }),
  opportunityType: z.string().optional().describe("e.g., Subcontract, RFP Response, Teaming Agreement"),
  diversityGoals: z.string().optional().describe("Describe diversity goals, e.g., '20% WOSB participation', 'MBEs encouraged' (comma-separated goals)"),
  complianceRequirements: z.string().optional().describe("List key compliance needs, e.g., 'ITAR, CMMC Level 2' (comma-separated)"),
  setAsideStatus: z.string().optional().describe("e.g., SBA 8(a) Set-Aside, WOSB Set-Aside"),
  companyBackground: z.string().optional(),
  keyDeliverables: z.string().optional().describe("List key deliverables (comma-separated)."),
  buyerIndustry: z.string().optional(), 
});

type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

function NewOpportunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const buyerIndustryFromQuery = searchParams.get('industry');
  const inventoryAnalysisString = searchParams.get('inventoryAnalysis');
  const source = searchParams.get('source'); 
  const isFromAIGenerationPath = source === 'ai_inventory' && inventoryAnalysisString;

  const [isLoading, setIsLoading] = useState(false);
  const [isAiAnalyzingQualifications, setIsAiAnalyzingQualifications] = useState(false);
  const [isAiGeneratingProposal, setIsAiGeneratingProposal] = useState(isFromAIGenerationPath);
  const [aiQualificationAnalysis, setAiQualificationAnalysis] = useState<AnalyzeOpportunityOutput | null>(null);

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      timeline: '',
      requiredSkills: '',
      opportunityType: '',
      diversityGoals: '',
      complianceRequirements: '',
      setAsideStatus: '',
      companyBackground: '',
      keyDeliverables: '',
      buyerIndustry: buyerIndustryFromQuery || '',
    },
  });

  useEffect(() => {
    if (buyerIndustryFromQuery) {
        form.setValue('buyerIndustry', buyerIndustryFromQuery);
    }

    if (isFromAIGenerationPath && inventoryAnalysisString) {
      const generateAIOpportunityDraft = async () => {
        setIsAiGeneratingProposal(true);
        try {
          const inventoryAnalysis: AnalyzeInventoryOutput = JSON.parse(inventoryAnalysisString);
          const companyName = "Our Company"; // Placeholder, ideally fetched from user profile
          
          const proposalOutput = await generateProposalFromInventory({
            inventoryAnalysis,
            industry: buyerIndustryFromQuery || 'Not specified',
            buyerCompanyName: companyName,
          });

          form.reset({
            ...form.getValues(), // keep other values like buyerIndustry
            title: proposalOutput.generatedOpportunityTitle || '',
            description: proposalOutput.generatedOpportunityDescription || `Based on recent inventory analysis (summary: ${inventoryAnalysis.analysisSummary || 'N/A'}), we are seeking suppliers for... Please elaborate on specific needs.`,
            requiredSkills: proposalOutput.suggestedSkills?.join(', ') || '',
            budget: proposalOutput.estimatedBudgetRange || '',
            buyerIndustry: buyerIndustryFromQuery || '',
          });
          toast({ title: "AI Proposal Drafted", description: "Proposal drafted from inventory analysis. Please review and complete all fields."});
        } catch (error) {
          console.error("AI Proposal Generation Error:", error);
          toast({ title: "AI Drafting Failed", description: "Could not draft proposal from inventory. Please fill manually.", variant: "destructive"});
          form.setValue('description', `Failed to auto-draft. Based on recent inventory analysis, we are seeking suppliers for... Please elaborate.`);
        } finally {
          setIsAiGeneratingProposal(false);
        }
      };
      generateAIOpportunityDraft();
    }
  }, [buyerIndustryFromQuery, isFromAIGenerationPath, inventoryAnalysisString, form, toast]);


  const handleAnalyzeQualifications = async () => {
    const { description, budget, timeline, requiredSkills, diversityGoals, complianceRequirements } = form.getValues();
    if (!description) {
      toast({
        title: "Missing Information",
        description: "Please fill in opportunity description to use AI qualification analysis.",
        variant: "destructive",
      });
      return;
    }
    setIsAiAnalyzingQualifications(true);
    setAiQualificationAnalysis(null);
    try {
      const result = await analyzeOpportunity({ 
        opportunityDescription: description, 
        desiredBudget: budget, 
        timeline,
        requiredSkillsInput: requiredSkills,
        diversityGoalsInput: diversityGoals,
        complianceRequirementsInput: complianceRequirements
      });
      setAiQualificationAnalysis(result);
      toast({
        title: "AI Qualification Analysis Complete",
        description: "Review the AI-suggested qualifications below.",
      });
    } catch (error) {
      console.error("AI Qualification Analysis Error:", error);
      toast({
        title: "AI Analysis Failed",
        description: "Could not analyze qualifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiAnalyzingQualifications(false);
    }
  };

  async function onSubmit(data: OpportunityFormValues) {
    setIsLoading(true);
    const opportunityId = `opp${Date.now()}`; 
    const processedData = {
      ...data,
      id: opportunityId,
      requiredSkills: data.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      diversityGoals: data.diversityGoals?.split(',').map(s => s.trim()).filter(s => s).map(goalDesc => ({ type: goalDesc, description: goalDesc })) || [],
      complianceRequirements: data.complianceRequirements?.split(',').map(s => s.trim()).filter(s => s) || [],
      keyDeliverables: data.keyDeliverables?.split(',').map(s => s.trim()).filter(s => s) || [],
      aiAnalysis: aiQualificationAnalysis, 
      industry: data.buyerIndustry,
      bids: [], 
    };
    
    console.log("Opportunity data submitted:", processedData);
    // In a real app, save to mockData or backend
    // This is a client component, so direct modification of mockData is not ideal here
    // For demo, this part would be handled by a state management solution or API call
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast({
      title: "Opportunity Posted",
      description: `"${data.title}" has been successfully posted.`,
    });
    setIsLoading(false);
    router.push(`/opportunities/${opportunityId}?verified=true&from=new`); 
  }
  
  const currentStep = buyerIndustryFromQuery ? 3 : 1; 
  const totalSteps = buyerIndustryFromQuery ? 4 : 1; 

  const backLink = buyerIndustryFromQuery 
    ? `/buy/inventory-input?industry=${encodeURIComponent(buyerIndustryFromQuery)}` 
    : (source === 'ai_inventory' ? `/buy/inventory-input?industry=${encodeURIComponent(buyerIndustryFromQuery || '')}` : "/opportunities");


  if (isAiGeneratingProposal && isFromAIGenerationPath) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <PageTitle title="Drafting Your Opportunity with AI..." description="Please wait while we analyze your inventory needs and generate a proposal draft."/>
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} className="pb-4" />
      </div>
    )
  }

  return (
    <>
      <PageTitle 
        title={isFromAIGenerationPath ? "Review AI Drafted Opportunity" : "Post New Opportunity"}
        description={isFromAIGenerationPath ? "Review and refine the AI-generated proposal. Complete all fields before posting." : "Detail your subcontracting needs or RFP to find qualified SMBs."}
        action={
           <Button variant="outline" asChild>
            <Link href={backLink}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
          </Button>
        }
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Opportunity Details</CardTitle>
                <CardDescription>Provide comprehensive information about the subcontracting opportunity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 {buyerIndustryFromQuery && (
                    <Badge>Industry Context: {buyerIndustryFromQuery}</Badge>
                )}
                 {isFromAIGenerationPath && (
                    <Alert variant="default" className="bg-primary/10 border-primary/30 text-primary">
                        <Sparkles className="h-4 w-4 text-primary"/>
                        <AlertTitle>AI Drafted Proposal</AlertTitle>
                        <AlertDescription>
                            This proposal was drafted by AI based on your inventory analysis. Please review, edit, and complete all fields.
                        </AlertDescription>
                    </Alert>
                 )}
                <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Opportunity Title</FormLabel> <FormControl> <Input placeholder="e.g., Cybersecurity Services Subcontract" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="companyBackground" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" /> Your Company/Organization Background (Optional)</FormLabel> <FormControl> <Textarea placeholder="Briefly describe your organization and the context of this opportunity..." className="min-h-[80px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Opportunity Description</FormLabel> <FormControl> <Textarea placeholder="Describe the scope of work, objectives, and specific needs..." className="min-h-[120px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="budget" render={({ field }) => ( <FormItem> <FormLabel>Budget / Estimated Value</FormLabel> <FormControl> <Input placeholder="e.g., $100,000 - $150,000" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="timeline" render={({ field }) => ( <FormItem> <FormLabel>Timeline / Duration</FormLabel> <FormControl> <Input placeholder="e.g., 6 months, 1 year base + options" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                </div>
                 <FormField control={form.control} name="opportunityType" render={({ field }) => ( <FormItem> <FormLabel>Opportunity Type (Optional)</FormLabel> <FormControl> <Input placeholder="e.g., Subcontract, RFP Response, Teaming" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <Separator />
                <FormField control={form.control} name="requiredSkills" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><ListChecks className="mr-2 h-4 w-4 text-muted-foreground" /> Required Skills/Capabilities (comma-separated)</FormLabel> <FormControl> <Input placeholder="e.g., Java, AWS, Project Management, ISO 9001" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                 <FormField control={form.control} name="keyDeliverables" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Milestone className="mr-2 h-4 w-4 text-muted-foreground" /> Key Deliverables (comma-separated, Optional)</FormLabel> <FormControl> <Textarea placeholder="e.g., Monthly reports, Software module, Completed installation" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <Separator />
                 <FormField control={form.control} name="diversityGoals" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /> Supplier Diversity Goals (comma-separated, Optional)</FormLabel> <FormControl> <Input placeholder="e.g., MBE participation, WOSB preferred, 20% VOSB target" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="complianceRequirements" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Compliance Requirements (comma-separated, Optional)</FormLabel> <FormControl> <Input placeholder="e.g., ITAR, CMMC Level 2, HIPAA" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                <FormField control={form.control} name="setAsideStatus" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Flag className="mr-2 h-4 w-4 text-muted-foreground" /> Set-Aside Status (Optional)</FormLabel> <FormControl> <Input placeholder="e.g., SBA 8(a) Set-Aside, Unrestricted" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Qualification Assist</CardTitle>
                <CardDescription>Let AI suggest key qualifications and supplier attributes for this opportunity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" onClick={handleAnalyzeQualifications} disabled={isAiAnalyzingQualifications || !form.watch('description')} className="w-full">
                  {isAiAnalyzingQualifications ? ( <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ) : ( <Sparkles className="mr-2 h-4 w-4" /> )}
                  Analyze with AI
                </Button>
                {aiQualificationAnalysis && (
                  <div className="mt-4 space-y-4">
                    {aiQualificationAnalysis.suggestedSkills && aiQualificationAnalysis.suggestedSkills.length > 0 && <div> <h4 className="font-semibold mb-2 text-sm flex items-center"><ListChecks className="mr-2 h-4 w-4 text-primary" /> AI Suggested Skills:</h4> <div className="flex flex-wrap gap-1"> {aiQualificationAnalysis.suggestedSkills.map(skill => ( <Badge key={skill} variant="default">{skill}</Badge> ))} </div> </div>}
                    {aiQualificationAnalysis.suggestedExperience && <div> <h4 className="font-semibold mb-2 text-sm flex items-center"><Brain className="mr-2 h-4 w-4 text-primary" /> AI Suggested Experience:</h4> <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiQualificationAnalysis.suggestedExperience}</p> </div>}
                     {aiQualificationAnalysis.suggestedCertifications && aiQualificationAnalysis.suggestedCertifications.length > 0 && <div> <h4 className="font-semibold mb-2 text-sm flex items-center"><Award className="mr-2 h-4 w-4 text-primary" /> AI Suggested Certifications:</h4>  <div className="flex flex-wrap gap-1"> {aiQualificationAnalysis.suggestedCertifications.map(cert => ( <Badge key={cert} variant="secondary">{cert}</Badge> ))} </div> </div>}
                    {aiQualificationAnalysis.keyComplianceAreas && aiQualificationAnalysis.keyComplianceAreas.length > 0 && <div> <h4 className="font-semibold mb-2 text-sm flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary" /> AI Key Compliance Areas:</h4>  <div className="flex flex-wrap gap-1"> {aiQualificationAnalysis.keyComplianceAreas.map(comp => ( <Badge key={comp} variant="outline">{comp}</Badge> ))} </div> </div>}
                     {aiQualificationAnalysis.potentialMatchKeywords && aiQualificationAnalysis.potentialMatchKeywords.length > 0 && <div> <h4 className="font-semibold mb-2 text-sm flex items-center"><Target className="mr-2 h-4 w-4 text-primary" /> AI Match Keywords:</h4>  <div className="flex flex-wrap gap-1"> {aiQualificationAnalysis.potentialMatchKeywords.map(kw => ( <Badge key={kw} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">{kw}</Badge> ))} </div> </div>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isAiGeneratingProposal}>
              {(isLoading || isAiGeneratingProposal) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFromAIGenerationPath ? "Refine & Post Opportunity" : "Post Opportunity"}
            </Button>
          </div>
        </form>
      </Form>
      {buyerIndustryFromQuery && <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} className="pb-4" />}
    </>
  );
}

export default function NewOpportunityPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading...</p></div>}>
            <NewOpportunityPageContent />
        </Suspense>
    )
}
