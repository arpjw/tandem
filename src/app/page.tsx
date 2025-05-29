
'use client';

import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
        <header className="absolute top-6 left-6">
          <Logo />
        </header>
        
        <main className="flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-12">
            Who are you?
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="lg" className="w-full py-8 text-lg">
                  <Link href="/opportunities/new">
                    Supplier
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
                   <Link href="/vendors/new">
                    Vendor
                    <HelpCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-sm">
                  Businesses offering services or goods
                  <br />
                  (e.g., SMBs, subcontractors).
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <p className="mt-16 text-muted-foreground max-w-lg">
            Tandem is an AI-powered matchmaking platform designed to connect businesses with the best vendors for their projects.
          </p>
        </main>

        <footer className="absolute bottom-6 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Tandem. All rights reserved.
        </footer>
      </div>
    </TooltipProvider>
  );
}
