"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateVendorProfile } from '@/ai/flows/vendor-profile-generator';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';

const vendorFormSchema = z.object({
  name: z.string().min(3, { message: "Business name must be at least 3 characters." }),
  businessDescription: z.string().min(20, { message: "Description must be at least 20 characters." }),
  expertise: z.string().min(3, { message: "Please list at least one expertise area." }), // Simplified to comma-separated string
  services: z.string().min(3, { message: "Please list at least one service." }), // Simplified to comma-separated string
  portfolioLinks: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
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
    // Here you would typically save the data to your backend
    console.log("Vendor data submitted:", { ...data, aiGeneratedProfile });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Vendor Profile Created",
      description: `${data.name} has been successfully added.`,
    });
    setIsLoading(false);
    router.push('/vendors'); 
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
                <FormField
                  control={form.control}
                  name="expertise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expertise (comma-separated)</FormLabel>
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
                      <FormLabel>Services Offered (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Custom Software, Mobile Apps, Branding" {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
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
