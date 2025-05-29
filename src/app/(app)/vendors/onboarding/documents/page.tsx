
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { getSuggestedDocuments, type Industry } from '@/lib/mockData';
import { UploadCloud, CheckCircle, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

function DocumentUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const industry = searchParams.get('industry') as Industry | null;
  const [suggestedDocs, setSuggestedDocs] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false); // Simulate upload state
  const [isUploaded, setIsUploaded] = useState(false); // Simulate upload completion

  useEffect(() => {
    if (industry) {
      setSuggestedDocs(getSuggestedDocuments(industry));
    }
  }, [industry]);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      // In a real app, you'd handle file uploads here.
      // For now, we just mark as uploaded and navigate.
      // The 'verified=true' flag will be set upon completing this step.
    }, 1500);
  };

  const handleContinue = () => {
    if (industry) {
      router.push(`/vendors/onboarding/complete?industry=${encodeURIComponent(industry)}&verified=true`);
    } else {
      // Fallback if industry is missing, though it shouldn't be
      router.push('/vendors/onboarding/complete?verified=true');
    }
  };

  if (!industry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-destructive">
              <AlertTriangle className="mr-2 h-6 w-6" />
              Missing Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Industry information was not provided. Please start over.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/vendors/onboarding/industry">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <PageTitle title="Document Upload (Simulated)" description={`For ${industry} industry`} />
          <CardDescription>
            To get verified, businesses in your industry typically provide documents like these. For this demo, clicking "Upload" will simulate the process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-md font-semibold mb-2">Suggested Documents:</h3>
            {suggestedDocs.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md">
                {suggestedDocs.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No specific documents suggested for this industry, general business documents may be required.</p>
            )}
          </div>

          <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
            {isUploaded ? (
              <div className="flex flex-col items-center text-green-600">
                <CheckCircle className="h-12 w-12 mb-2" />
                <p className="font-semibold">Documents "Uploaded" Successfully!</p>
              </div>
            ) : (
              <>
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  In a real application, you would drag & drop files here or click to browse.
                </p>
                <Button onClick={handleSimulateUpload} disabled={isUploading || isUploaded} variant="outline">
                  {isUploading ? 'Uploading...' : 'Simulate File Upload'}
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            This is a simulated upload for demo purposes. No actual files are stored.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleContinue} disabled={!isUploaded}>
            Complete Verification <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <ProgressIndicator currentStep={2} totalSteps={3} />
    </div>
  );
}

export default function DocumentUploadPage() {
  return (
    <Suspense fallback={<div>Loading industry details...</div>}>
      <DocumentUploadContent />
    </Suspense>
  )
}
