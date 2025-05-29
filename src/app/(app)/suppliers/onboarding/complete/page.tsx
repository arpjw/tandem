
'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PageTitle } from '@/components/PageTitle';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react';

function OnboardingCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get('verified') === 'true';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <PageTitle title="Onboarding Complete!" />
          <div className="flex justify-center mt-4">
            <PartyPopper className="h-16 w-16 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerified ? (
            <div className="flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/30 rounded-md border border-green-300 dark:border-green-700">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
              <span className="font-semibold text-green-700 dark:text-green-300">You are now Verified!</span>
            </div>
          ) : (
             <p className="text-muted-foreground">Your initial profile setup is done.</p>
          )}
          <CardDescription>
            You can now explore subcontracting opportunities and further enhance your supplier profile. {/* Renamed */}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={() => router.push(isVerified ? '/opportunities?verified=true' : '/opportunities')}
            className="w-full"
            size="lg"
          >
            Explore Opportunities <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/suppliers/new">Manage Your Supplier Profile</Link> {/* Path/Text Updated */}
          </Button>
        </CardFooter>
      </Card>
      <ProgressIndicator currentStep={3} totalSteps={3} />
    </div>
  );
}

export default function SupplierCompletePage() { // Renamed
  return (
    <Suspense fallback={<div>Loading completion status...</div>}>
      <OnboardingCompleteContent />
    </Suspense>
  );
}
