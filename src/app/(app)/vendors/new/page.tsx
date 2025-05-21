
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateVendorProfile } from '@/ai/flows/vendor-profile-generator';
import { ArrowLeft, Loader2, Sparkles, Briefcase, Award, Building2, Clock, Layers } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';

const companySizeEnum = z.enum(['Solo', 'Small (2-10)', 'Medium (11-50)', 'Large (51+)']);

const vendorFormSchema = z.object({
  name: z.string().min(3, { message: "Business name must be at least 3 characters." }),
  businessDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  expertise: z.string().min(3, { message: "Please list at least one expertise area (comma-separated)." }), 
  services: z.string().min(3, { message: "Please list at least one service (comma-separated)." }), 
  portfolioLinks: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  yearsOfExperience: z.coerce.number().min(0, "Years of experience must be 0 or more.").optional(),
  companySize: companySizeEnum.optional(),
  industryFocus: z.string().optional(), // comma-separated
  availability: z.string().optional(),
  awardsAndCertifications: z.string().optional(), // comma-separated
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function NewVendorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiGeneratedProfile, setAiGeneratedProfile] = useState<string | undefined>(undefined);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: '',
      businessDescription: '',
      expertise: '',
      services: '',
      portfolioLinks: '',
      yearsOfExperience: undefined,
      companySize: undefined,
      industryFocus: '',
      availability: '',
      awardsAndCertifications: '',
    },
  });

  const handleGenerateProfile = async () => {
    const businessDescription = form.getValues("businessDescription");
    if (!businessDescription || businessDescription.length < 20) {
      toast({
        title: "Error",
        description: "Please provide a business description (at least 20 characters) to generate a profile.",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await generateVendorProfile({ businessDescription });
      setAiGeneratedProfile(result.profile);
      toast({
        title: "AI Profile Generated",
        description: "Review the AI-generated profile text below.",
      });
    } catch (error) {
      console.error("AI Profile Generation Error:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate profile. Please try again.",
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
      industryFocus: data.industryFocus?.split(',').map(s => s.trim()).filter(s => s) || [],
      awardsAndCertifications: data.awardsAndCertifications?.split(',').map(s => s.trim()).filter(s => s) || [],
      aiGeneratedProfile,
    };
    console.log("Vendor data submitted:", processedData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Vendor Profile Created",
      description: `${data.name} has been successfully added.`,
    });
    setIsLoading(false);
    // router.push('/vendors'); // Commented out to allow viewing console log
  }

  return (
    <>
      <PageTitle 
        title="Create New Vendor Profile"
        description="Showcase your business expertise, services, and portfolio."
        action={
          <Button variant="outline" asChild>
            <Link href="/vendors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors</Link>
          </Button>
        }
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Vendor Details</CardTitle>
                <CardDescription>Fill in the information about the vendor.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Innovate Solutions Ltd." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your business, its mission, and key strengths..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Years of Experience</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Building2 className="mr-2 h-4 w-4 text-muted-foreground" /> Company Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Solo">Solo</SelectItem>
                            <SelectItem value="Small (2-10)">Small (2-10 employees)</SelectItem>
                            <SelectItem value="Medium (11-50)">Medium (11-50 employees)</SelectItem>
                            <SelectItem value="Large (51+)">Large (51+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4 text-muted-foreground" /> Expertise (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development, UI/UX Design, Cloud Solutions" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="services"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Layers className="mr-2 h-4 w-4 text-muted-foreground" /> Services Offered (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Custom Software, Mobile Apps, Branding" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="industryFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-muted-foreground" /> Industry Focus (comma-separated, Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Fintech, Healthcare, E-commerce" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="portfolioLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Portfolio Link (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/portfolio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Available from Q3, Part-time capacity" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="awardsAndCertifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Award className="mr-2 h-4 w-4 text-muted-foreground" /> Awards & Certifications (comma-separated, Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Best Design Agency 2023, AWS Certified Developer" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>AI-Powered Profile</CardTitle>
                <CardDescription>Generate a compelling profile using AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" onClick={handleGenerateProfile} disabled={isAiLoading} className="w-full">
                  {isAiLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate with AI
                </Button>
                {aiGeneratedProfile && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-md border">
                    <h4 className="font-semibold mb-2 text-sm">AI Generated Profile Text:</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{aiGeneratedProfile}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/vendors')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Vendor Profile
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
