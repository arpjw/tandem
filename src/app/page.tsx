
'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <TooltipProvider>
      {/* Outermost container: full screen, centers its single child (the content_block) */}
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        {/* Inner container: holds all content, centers its own items, centers its text, and has padding */}
        <div className="flex flex-col items-center text-center p-6">
          
          <div className="mb-12">
            <Logo />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-12">
            Who are you?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md mb-16">
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
                  <Link href="/vendors/onboarding/industry">
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

          <p className="text-muted-foreground max-w-lg mb-8 text-center">
            Tandem is an AI-powered matchmaking platform designed to connect businesses with the best vendors for their projects.
          </p>

          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Tandem. All rights reserved.
          </p>

        </div> {/* End of inner content block */}
      </div> {/* End of outermost centering container */}
    </TooltipProvider>
  );
}
