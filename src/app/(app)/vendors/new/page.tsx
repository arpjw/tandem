
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateVendorProfileSummary } from '@/ai/flows/vendor-profile-generator'; // Updated import
import type { VendorProfileOutput } from '@/ai/flows/vendor-profile-generator'; // Updated import
import { ArrowLeft, Loader2, Sparkles, Briefcase, Award, Building2, Clock, Layers, FileText, Users, ShieldCheck, PlusCircle, Trash2, Globe, Tag } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';

const companySizeEnum = z.enum(['Solo', 'Small (2-10)', 'Medium (11-50)', 'Large (51+)']);

const projectHistorySchema = z.object({
  title: z.string().min(3, "Project title is too short."),
  client: z.string().min(2, "Client name is too short."),
  description: z.string().min(10, "Project description is too short."),
  outcome: z.string().min(5, "Outcome is too short."),
  year: z.coerce.number().min(1980, "Invalid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
});

const vendorFormSchema = z.object({
  name: z.string().min(3, { message: "Business name must be at least 3 characters." }),
  businessDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  expertise: z.string().min(3, { message: "List at least one expertise area (comma-separated)." }), 
  services: z.string().min(3, { message: "Please list at least one service (comma-separated)." }), 
  
  certifications: z.string().optional().describe("Comma-separated, e.g., minority-owned, veteran-owned, SBA 8a"),
  capacitySummary: z.string().optional().describe("e.g., Handles projects up to $500k, Team of 15"),
  projectHistory: z.array(projectHistorySchema).optional(),
  isVerified: z.boolean().default(false).optional(),
  naicsCodes: z.string().optional().describe("Comma-separated NAICS codes"),
  dunsNumber: z.string().optional().regex(/^\d{9}$/, {message: "DUNS number must be 9 digits."}),

  portfolioLinks: z.string().url({ message: "Please enter a valid URL for portfolio." }).optional().or(z.literal('')),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be 0 or more.").optional(),
  companySize: companySizeEnum.optional(),
  industryFocus: z.string().optional().describe("Comma-separated industry focus"),
  availability: z.string().optional(),
  awardsAndCertificationsText: z.string().optional().describe("Additional awards/certs as text (comma-separated)"), // For AI input
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function NewVendorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiProfile, setAiProfile] = useState<VendorProfileOutput | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: '',
      businessDescription: '',
      expertise: '',
      services: '',
      certifications: '',
      capacitySummary: '',
      projectHistory: [{ title: '', client: '', description: '', outcome: '', year: new Date().getFullYear() -1 }],
      isVerified: false,
      naicsCodes: '',
      dunsNumber: '',
      portfolioLinks: '',
      yearsOfExperience: undefined,
      companySize: undefined,
      industryFocus: '',
      availability: '',
      awardsAndCertificationsText: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projectHistory"
  });

  const handleGenerateProfile = async () => {
    const { name, businessDescription, expertise, services, certifications, industryFocus } = form.getValues();
    const projectHighlights = form.getValues("projectHistory")?.slice(0,2).map(p => p.title).join(', ');

    if (!businessDescription || businessDescription.length < 20) {
      toast({
        title: "Error",
        description: "Please provide a business name and description (at least 20 characters) to generate an AI summary.",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await generateVendorProfileSummary({ 
        businessName: name,
        businessDescription,
        expertiseAreas: expertise,
        keyServicesOffered: services,
        certifications,
        projectHighlights,
        industryFocus
      });
      setAiProfile(result);
      if(result.profileSummary) {
        // Optionally set a form field with this, or just display it.
        // form.setValue("aiGeneratedProfile", result.profileSummary); 
      }
      toast({
        title: "AI Profile Assist Complete",
        description: "Review the AI-generated summary and keywords below.",
      });
    } catch (error) {
      console.error("AI Profile Generation Error:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate profile summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  async function onSubmit(data: VendorFormValues) {
    setIsLoading(true);
    const processedData = {
      ...data,
      expertise: data.expertise.split(',').map(s => s.trim()).filter(s => s),
      services: data.services.split(',').map(s => s.trim()).filter(s => s),
      certifications: data.certifications?.split(',').map(s => s.trim()).filter(s => s) || [],
      naicsCodes: data.naicsCodes?.split(',').map(s => s.trim()).filter(s => s) || [],
      industryFocus: data.industryFocus?.split(',').map(s => s.trim()).filter(s => s) || [],
      awardsAndCertifications: data.awardsAndCertificationsText?.split(',').map(s => s.trim()).filter(s => s) || [],
      aiGeneratedProfile: aiProfile?.profileSummary, // Save the AI generated summary
      // projectHistory is already in the correct array format
    };
    console.log("Vendor data submitted:", processedData);
    // Simulate API call (e.g., add to mockVendors or send to backend)
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Vendor Profile Created/Updated",
      description: `${data.name}'s profile has been successfully submitted.`,
    });
    setIsLoading(false);
    router.push('/vendors'); 
  }

  return (
    <>
      <PageTitle 
        title="Create / Update SMB Vendor Profile"
        description="Showcase your business capabilities to connect with subcontracting opportunities."
        action={
          <Button variant="outline" asChild>
            <Link href="/vendors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors</Link>
          </Button>
        }
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Tell us about your Small to Medium Business (SMB).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Business Name</FormLabel> <FormControl> <Input placeholder="e.g., Innovate Solutions LLC" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="businessDescription" render={({ field }) => ( <FormItem> <FormLabel>Business Description</FormLabel> <FormControl> <Textarea placeholder="Describe your business mission, core values, and unique selling propositions..." className="min-h-[100px]" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="yearsOfExperience" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Years of Experience</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} /> </FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={form.control} name="companySize" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Building2 className="mr-2 h-4 w-4 text-muted-foreground" /> Company Size</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select company size" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="Solo">Solo</SelectItem> <SelectItem value="Small (2-10)">Small (2-10 employees)</SelectItem> <SelectItem value="Medium (11-50)">Medium (11-50 employees)</SelectItem> <SelectItem value="Large (51+)">Large (51+ employees)</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={form.control} name="availability" render={({ field }) => ( <FormItem> <FormLabel>Availability</FormLabel> <FormControl> <Input placeholder="e.g., Available for new projects Q3, Full-time capacity" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Capabilities & Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="expertise" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" /> Core Expertise (comma-separated)</FormLabel> <FormControl> <Input placeholder="e.g., Web Development, Cybersecurity, Logistics Planning" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="services" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Layers className="mr-2 h-4 w-4 text-muted-foreground" /> Services Offered (comma-separated)</FormLabel> <FormControl> <Input placeholder="e.g., Custom Software, Freight Forwarding, HVAC Installation" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="industryFocus" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Tag className="mr-2 h-4 w-4 text-muted-foreground" /> Industry Focus (comma-separated, Optional)</FormLabel> <FormControl> <Input placeholder="e.g., Government, Healthcare, Manufacturing" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                   <FormField control={form.control} name="capacitySummary" render={({ field }) => ( <FormItem> <FormLabel>Capacity Summary (Optional)</FormLabel> <FormControl> <Textarea placeholder="e.g., Team of 10, Handle projects up to $200k, 5 concurrent projects" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <Separator />
                  <FormField control={form.control} name="certifications" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Award className="mr-2 h-4 w-4 text-muted-foreground" /> Business Certifications (comma-separated)</FormLabel> <FormControl> <Input placeholder="e.g., minority-owned, veteran-owned, SBA 8a, ISO 9001, CMMC Level 2" {...field} /> </FormControl><FormDescription>Enter official business certifications.</FormDescription> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="naicsCodes" render={({ field }) => ( <FormItem> <FormLabel>NAICS Codes (comma-separated, Optional)</FormLabel> <FormControl> <Input placeholder="e.g., 541511, 236220" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="dunsNumber" render={({ field }) => ( <FormItem> <FormLabel>DUNS Number (Optional)</FormLabel> <FormControl> <Input placeholder="9-digit DUNS number" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                   <FormField control={form.control} name="awardsAndCertificationsText" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Award className="mr-2 h-4 w-4 text-muted-foreground" /> Other Awards & Professional Certifications (comma-separated, Optional)</FormLabel> <FormControl> <Textarea placeholder="e.g., Best Design Agency 2023, PMP Certified, AWS Certified Developer" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                   <FormField control={form.control} name="portfolioLinks" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4 text-muted-foreground"/> Portfolio/Website Link (Optional)</FormLabel> <FormControl> <Input placeholder="https://yourbusiness.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                  <FormField control={form.control} name="isVerified" render={({ field }) => ( <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow items-center"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} /> </FormControl> <div className="space-y-1 leading-none"> <FormLabel className="flex items-center"><ShieldCheck className="mr-2 h-4 w-4 text-green-600" /> Mark as Verified (Admin)</FormLabel> <FormDescription>Verification status, typically managed by platform admins.</FormDescription> </div> </FormItem> )} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Project History / Past Performance
                    <Button type="button" size="sm" variant="outline" onClick={() => append({ title: '', client: '', description: '', outcome: '', year: new Date().getFullYear() -1 })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                  </CardTitle>
                  <CardDescription>Showcase up to 5 key projects or contracts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="p-4 border rounded-md space-y-3 relative">
                      <FormField control={form.control} name={`projectHistory.${index}.title`} render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input placeholder="e.g., System Upgrade for Client X" {...field} /></FormControl><FormMessage /> </FormItem>)} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name={`projectHistory.${index}.client`} render={({ field }) => ( <FormItem> <FormLabel>Client / Prime</FormLabel> <FormControl><Input placeholder="e.g., Major Corp Inc. / Gov Agency" {...field} /></FormControl><FormMessage /> </FormItem>)} />
                        <FormField control={form.control} name={`projectHistory.${index}.year`} render={({ field }) => ( <FormItem> <FormLabel>Year Completed</FormLabel> <FormControl><Input type="number" placeholder="e.g., 2022" {...field} /></FormControl><FormMessage /> </FormItem>)} />
                      </div>
                      <FormField control={form.control} name={`projectHistory.${index}.description`} render={({ field }) => ( <FormItem> <FormLabel>Brief Description</FormLabel> <FormControl><Textarea placeholder="Role, responsibilities, key activities..." {...field} /></FormControl><FormMessage /> </FormItem>)} />
                      <FormField control={form.control} name={`projectHistory.${index}.outcome`} render={({ field }) => ( <FormItem> <FormLabel>Key Outcome / Result</FormLabel> <FormControl><Input placeholder="e.g., Achieved 20% cost savings" {...field} /></FormControl><FormMessage /> </FormItem>)} />
                      {fields.length > 1 && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}> <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove Project</span></Button>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-1 self-start sticky top-4"> {/* AI Card */}
              <CardHeader>
                <CardTitle>AI Profile Assist</CardTitle>
                <CardDescription>Generate a compelling summary and keywords for your profile using AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" onClick={handleGenerateProfile} disabled={isAiLoading || !form.watch('businessDescription')} className="w-full">
                  {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate with AI
                </Button>
                {aiProfile?.profileSummary && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-md border space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1 text-sm text-primary">AI Generated Summary:</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiProfile.profileSummary}</p>
                    </div>
                     {aiProfile.suggestedKeywords && aiProfile.suggestedKeywords.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-1 text-sm text-primary">AI Suggested Keywords:</h4>
                           <div className="flex flex-wrap gap-1">
                            {aiProfile.suggestedKeywords.map(kw => (
                              <Badge key={kw} variant="outline">{kw}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    {aiProfile.readinessAssessment && (
                       <div>
                          <h4 className="font-semibold mb-1 text-sm text-primary">AI Readiness Note:</h4>
                          <p className="text-xs text-muted-foreground italic whitespace-pre-wrap">{aiProfile.readinessAssessment}</p>
                        </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2 mt-8">
            <Button type="button" variant="outline" onClick={() => router.push('/vendors')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Vendor Profile
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
