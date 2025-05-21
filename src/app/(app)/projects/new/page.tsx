
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { analyzeProjectRequirements } from '@/ai/flows/project-requirement-analyzer';
import type { AnalyzeProjectRequirementsOutput } from '@/ai/flows/project-requirement-analyzer';
import { ArrowLeft, Loader2, Sparkles, ListChecks, Brain, Users, Target, Milestone, Building } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const projectFormSchema = z.object({
  title: z.string().min(5, { message: "Project title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  budget: z.string().min(3, { message: "Please specify the budget." }),
  timeline: z.string().min(3, { message: "Please specify the timeline." }),
  requiredSkills: z.string().min(3, { message: "List at least one required skill (comma-separated)." }),
  projectGoals: z.string().min(3, {message: "List at least one project goal (comma-separated)."}),
  targetAudience: z.string().optional(),
  keyDeliverables: z.string().min(3, {message: "List at least one key deliverable (comma-separated)."}),
  companyBackground: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzeProjectRequirementsOutput | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      budget: '',
      timeline: '',
      requiredSkills: '',
      projectGoals: '',
      targetAudience: '',
      keyDeliverables: '',
      companyBackground: '',
    },
  });

  const handleAnalyzeRequirements = async () => {
    const { description, budget, timeline } = form.getValues();
    if (!description || !budget || !timeline) {
      toast({
        title: "Missing Information",
        description: "Please fill in project description, budget, and timeline to use AI analysis.",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeProjectRequirements({ 
        projectDescription: description, 
        desiredBudget: budget, 
        timeline 
      });
      setAiAnalysis(result);
      toast({
        title: "AI Analysis Complete",
        description: "Review the AI-suggested skills and experience.",
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

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);
    const processedData = {
      ...data,
      requiredSkills: data.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
      projectGoals: data.projectGoals.split(',').map(s => s.trim()).filter(s => s),
      keyDeliverables: data.keyDeliverables.split(',').map(s => s.trim()).filter(s => s),
      aiAnalysis,
    };
    console.log("Project data submitted:", processedData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Project Posted",
      description: `"${data.title}" has been successfully posted.`,
    });
    setIsLoading(false);
    // router.push('/projects'); // Commented out to allow viewing console log
  }

  return (
    <>
      <PageTitle 
        title="Post New Project"
        description="Detail your project needs to find the perfect vendor."
        action={
           <Button variant="outline" asChild>
            <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
          </Button>
        }
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Provide all necessary information about your project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., E-commerce Platform Revamp" {...field} />
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
                      <FormLabel className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" /> Company Background (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe your company..."
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
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project scope, goals, and deliverables..."
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
                        <FormLabel>Desired Budget</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., $50,000 - $70,000" {...field} />
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
                        <FormLabel>Project Timeline</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 6 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                 <FormField
                  control={form.control}
                  name="projectGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Target className="mr-2 h-4 w-4 text-muted-foreground" /> Project Goals (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Increase sales, Improve UX, Reduce load time" {...field} />
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
                      <FormLabel className="flex items-center"><Milestone className="mr-2 h-4 w-4 text-muted-foreground" /> Key Deliverables (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Functional prototype, Final designs, Deployed application" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /> Target Audience (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Young professionals, Small businesses" {...field} />
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
                      <FormLabel>Required Skills (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js, AWS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI Requirement Analysis</CardTitle>
                <CardDescription>Let AI suggest key skills and experience for your project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" onClick={handleAnalyzeRequirements} disabled={isAiLoading} className="w-full">
                  {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Analyze with AI
                </Button>
                {aiAnalysis && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><ListChecks className="mr-2 h-4 w-4 text-primary" /> AI Suggested Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {aiAnalysis.suggestedSkills.map(skill => (
                          <Badge key={skill} variant="default">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm flex items-center"><Brain className="mr-2 h-4 w-4 text-primary" /> AI Suggested Experience:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiAnalysis.suggestedExperience}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/projects')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Project
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
