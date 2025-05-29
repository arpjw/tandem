
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Industries, type Industry } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export default function BuyerSelectIndustryPage() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedIndustry) {
      setError('Please select an industry to continue.');
      return;
    }
    setError(null);
    // For now, new opportunities don't directly depend on this buyer-selected industry in their creation form
    // but it's captured for the flow.
    router.push(`/buy/inventory-input?industry=${encodeURIComponent(selectedIndustry)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <PageTitle title="Buyer: Opportunity Setup" description="Let's get started defining your needs." />
          <CardTitle className="text-xl pt-2">What is your primary industry?</CardTitle>
          <CardDescription>
            This helps us understand the context of the opportunity you're creating.
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
      <ProgressIndicator currentStep={1} totalSteps={4} /> {/* Assuming 4 steps total for buyer */}
    </div>
  );
}
