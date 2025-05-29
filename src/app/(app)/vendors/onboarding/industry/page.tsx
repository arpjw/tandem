
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Industries, type Industry } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export default function VendorIndustryPage() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedIndustry) {
      setError('Please select an industry to continue.');
      return;
    }
    setError(null);
    router.push(`/vendors/onboarding/documents?industry=${encodeURIComponent(selectedIndustry)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <PageTitle title="Welcome to Tandem!" description="Let's get your vendor profile started." />
          <CardTitle className="text-xl pt-2">What is your primary industry?</CardTitle>
          <CardDescription>
            This helps us match you with the most relevant subcontracting opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select onValueChange={(value) => setSelectedIndustry(value as Industry)} value={selectedIndustry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {Industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!selectedIndustry}>
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      <ProgressIndicator currentStep={1} totalSteps={3} />
    </div>
  );
}
