
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <div className="w-full max-w-xl p-8 sm:p-12 md:p-16 text-center">
          
          <div className="flex justify-center mb-12">
            <Logo />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-12">
            Who are you?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="lg" className="w-full py-8 text-lg">
                  <Link href="/buy/select-industry">
                    Buyer
                    <HelpCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm text-center">
                  Organizations looking to procure services or goods
                  <br />
                  (e.g., large enterprises, prime contractors).
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="lg" variant="secondary" className="w-full py-8 text-lg">
                  <Link href="/suppliers/onboarding/industry">
                    Supplier
                    <HelpCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm text-center">
                  Businesses offering services or goods
                  <br />
                  (e.g., SMBs, subcontractors, vendors).
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <p className="text-muted-foreground mb-8">
            Tandem is an AI-powered matchmaking platform designed to connect businesses with the best vendors for their projects.
          </p>

          <p className="text-xs text-muted-foreground">
            &copy; {currentYear !== null ? currentYear : '...'} Tandem. All rights reserved.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
