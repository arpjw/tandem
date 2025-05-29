
'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <TooltipProvider>
      {/* Root container centers everything */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">

        {/* Logo - will be at the top of the centered block */}
        <div className="mb-12"> {/* Added margin for spacing */}
          <Logo />
        </div>

        {/* Question */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-12">
          Who are you?
        </h1>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md mb-16"> {/* Added margin */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="lg" className="w-full py-8 text-lg">
                <Link href="/opportunities/new">
                  Buyer
                  <HelpCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-sm">
                Organizations looking to procure services or goods
                <br />
                (e.g., large enterprises, prime contractors).
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="lg" variant="secondary" className="w-full py-8 text-lg">
                 <Link href="/vendors/onboarding/industry">
                  Supplier
                  <HelpCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-sm">
                Businesses offering services or goods
                <br />
                (e.g., SMBs, subcontractors, vendors).
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Tagline */}
        <p className="text-muted-foreground max-w-lg mb-8"> {/* Added margin */}
          Tandem is an AI-powered matchmaking platform designed to connect businesses with the best vendors for their projects.
        </p>

        {/* Copyright - now part of the centered block */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Tandem. All rights reserved.
        </p>
      </div>
    </TooltipProvider>
  );
}

