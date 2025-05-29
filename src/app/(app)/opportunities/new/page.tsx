
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
import { ArrowLeft, Loader2, Sparkles, ListChecks, Brain, Users, Target, Milestone, Building, ShieldCheck, Flag, Award } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator'; // Added for buyer flow

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
  // Field for buyer's industry context if coming from that flow
  buyerIndustry: z.string().optional(), 
});

type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;

function NewOpportunityPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const buyerIndustryFromQuery = searchParams.get('industry');
  const inventoryAnalysisFromQuery = searchParams.get('inventoryAnalysis');
  const source = searchParams.get('source'); // e.g., 'ai_inventory' or 'manual'
  const isFromAIGeneration = source === 'ai_inventory' && inventoryAnalysisFromQuery;


  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzeOpportunityOutput | null>(null);

  const form = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      title: '',
      description: isFromAIGeneration ? `Based on recent inventory analysis (needs: ${inventoryAnalysisFromQuery}), we are seeking suppliers for...` : '',
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
    if (isFromAIGeneration) {
        // Placeholder: In a real app, you'd call a proposal generation AI flow here
        // and populate more fields of the form.
        // For now, we just prefill the description.
        toast({ title: "AI Draft Started", description: "Proposal draft started from inventory analysis. Please review and complete."});
    }
  }, [buyerIndustryFromQuery, isFromAIGeneration, inventoryAnalysisFromQuery, form, toast]);


  const handleAnalyzeRequirements = async () => {
    const { description, budget, timeline, requiredSkills, diversityGoals, complianceRequirements } = form.getValues();
    if (!description) {
      toast({
        title: "Missing Information",
        description: "Please fill in opportunity description to use AI analysis.",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeOpportunity({ 
        opportunityDescription: description, 
        desiredBudget: budget, 
        timeline,
        requiredSkillsInput: requiredSkills,
        diversityGoalsInput: diversityGoals,
        complianceRequirementsInput: complianceRequirements
      });
      setAiAnalysis(result);
      toast({
        title: "AI Analysis Complete",
        description: "Review the AI-suggested qualifications below.",
      });
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast({
        title: "AI Analysis Failed",
        description: "Could not analyze requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  async function onSubmit(data: OpportunityFormValues) {
    setIsLoading(true);
    const processedData = {
      ...data,
      id: `opp${Date.now()}`, // Simulate ID generation
      requiredSkills: data.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      diversityGoals: data.diversityGoals?.split(',').map(s => s.trim()).filter(s => s).map(goalDesc => ({ type: goalDesc, description: goalDesc })) || [],
      complianceRequirements: data.complianceRequirements?.split(',').map(s => s.trim()).filter(s => s) || [],
      keyDeliverables: data.keyDeliverables?.split(',').map(s => s.trim()).filter(s => s) || [],
      aiAnalysis, 
      industry: data.buyerIndustry, // Storing the buyer's industry with the opportunity
      bids: [], // Initialize with empty bids
    };
    
    // In a real app, you'd save this to mockData or a backend
    // For now, log and toast
    console.log("Opportunity data submitted:", processedData);
    
    // Simulate adding to mockOpportunities (not ideal for client component, but for demo)
    // import { mockOpportunities } from '@/lib/mockData'; // This would be problematic here.
    // mockOpportunities.push(processedData as any);


    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Opportunity Posted",
      description: `"${data.title}" has been successfully posted.`,
    });
    setIsLoading(false);
    // If from buyer flow, navigate to the posted opportunity. Otherwise, to the list.
    // This simulates posting and then viewing it.
    router.push(`/opportunities/${processedData.id}?verified=true`); 
  }
  
  const currentStep = isFromAIGeneration ? 3 : (buyerIndustryFromQuery ? 3 : 1); // Adjust step based on flow
  const totalSteps = buyerIndustryFromQuery ? 4 : 1; // 4 steps for full buyer flow


  return (
    <>
      <PageTitle 
        title={isFromAIGeneration ? "Review AI Drafted Opportunity" : "Post New Opportunity"}
        description={isFromAIGeneration ? "Review and refine the AI-generated proposal based on your inventory analysis." : "Detail your subcontracting needs or RFP to find qualified SMBs."}
        action={
           <Button variant="outline" asChild>
            <Link href={buyerIndustryFromQuery ? `/buy/inventory-input?industry=${buyerIndustryFromQuery}` : "/opportunities"}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opportunity Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Cybersecurity Services Subcontract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" /> Your Company/Organization Background (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your organization and the context of this opportunity..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opportunity Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the scope of work, objectives, and specific needs..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget / Estimated Value</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $100,000 - $150,000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline / Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 6 months, 1 year base + options" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="opportunityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opportunity Type (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Subcontract, RFP Response, Teaming" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <Separator />
                <FormField
                  control={form.control}
                  name="requiredSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ListChecks className="mr-2 h-4 w-4 text-muted-foreground" /> Required Skills/Capabilities (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Java, AWS, Project Management, ISO 9001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="keyDeliverables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Milestone className="mr-2 h-4 w-4 text-muted-foreground" /> Key Deliverables (comma-separated, Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Monthly reports, Software module, Completed installation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                 <FormField
                  control={form.control}
                  name="diversityGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /> Supplier Diversity Goals (comma-separated, Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., MBE participation, WOSB preferred, 20% VOSB target" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complianceRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" /> Compliance Requirements (comma-separated, Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., ITAR, CMMC Level 2, HIPAA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="setAsideStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Flag className="mr-2 h-4 w-4 text-muted-foreground" /> Set-Aside Status (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SBA 8(a) Set-Aside, Unrestricted" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Qualification Assist</CardTitle>
                <CardDescription>Let AI suggest key qualifications and supplier attributes for this opportunity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" onClick={handleAnalyzeRequirements} disabled={isAiLoading || !form.watch('description')} className="w-full">
                  {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Analyze with AI
                </Button>
                {aiAnalysis && (
                  <div className="mt-4 space-y-4">
                    {aiAnalysis.suggestedSkills && aiAnalysis.suggestedSkills.length > 0 && <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><ListChecks className="mr-2 h-4 w-4 text-primary" /> AI Suggested Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {aiAnalysis.suggestedSkills.map(skill => (
                          <Badge key={skill} variant="default">{skill}</Badge>
                        ))}
                      </div>
                    </div>}
                    {aiAnalysis.suggestedExperience && <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><Brain className="mr-2 h-4 w-4 text-primary" /> AI Suggested Experience:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiAnalysis.suggestedExperience}</p>
                    </div>}
                     {aiAnalysis.suggestedCertifications && aiAnalysis.suggestedCertifications.length > 0 && <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><Award className="mr-2 h-4 w-4 text-primary" /> AI Suggested Certifications:</h4>
                       <div className="flex flex-wrap gap-1">
                        {aiAnalysis.suggestedCertifications.map(cert => (
                          <Badge key={cert} variant="secondary">{cert}</Badge>
                        ))}
                      </div>
                    </div>}
                    {aiAnalysis.keyComplianceAreas && aiAnalysis.keyComplianceAreas.length > 0 && <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-primary" /> AI Key Compliance Areas:</h4>
                       <div className="flex flex-wrap gap-1">
                        {aiAnalysis.keyComplianceAreas.map(comp => (
                          <Badge key={comp} variant="outline">{comp}</Badge>
                        ))}
                      </div>
                    </div>}
                     {aiAnalysis.potentialMatchKeywords && aiAnalysis.potentialMatchKeywords.length > 0 && <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><Target className="mr-2 h-4 w-4 text-primary" /> AI Match Keywords:</h4>
                       <div className="flex flex-wrap gap-1">
                        {aiAnalysis.potentialMatchKeywords.map(kw => (
                          <Badge key={kw} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">{kw}</Badge>
                        ))}
                      </div>
                    </div>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isFromAIGeneration ? "Refine & Post Opportunity" : "Post Opportunity"}
            </Button>
          </div>
        </form>
      </Form>
      {buyerIndustryFromQuery && <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />}
    </>
  );
}

export default function NewOpportunityPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewOpportunityPageContent />
        </Suspense>
    )
}
