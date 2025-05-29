
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Briefcase as BriefcaseIcon, AlertTriangle, Lock, CheckCircle } from 'lucide-react';
import { mockOpportunities } from '@/lib/mockData';
import type { Opportunity } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const isUserVerified = searchParams.get('verified') === 'true';
  const opportunities: Opportunity[] = mockOpportunities;

  const PageAction = () => (
    <div className="flex items-center gap-3">
      <Button asChild>
        <Link href="/opportunities/new">
          <PlusCircle className="mr-2 h-4 w-4" /> Post New Opportunity
        </Link>
      </Button>
      {!isUserVerified ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Link href="/vendors/onboarding/industry">
                  <Lock className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Get Verified to fully access opportunities!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white py-2 px-3">
          <CheckCircle className="mr-1.5 h-4 w-4" /> Verified Access
        </Badge>
      )}
    </div>
  );

  return (
    <>
      <PageTitle
        title="Subcontracting Opportunities"
        description="Browse and manage subcontracting opportunities and RFPs."
        action={<PageAction />}
      />

      {!isUserVerified && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            Please complete your vendor profile and verification to fully access and apply for opportunities.
            <Button variant="link" asChild className="p-0 h-auto ml-1 text-destructive hover:text-destructive/80">
              <Link href="/vendors/onboarding/industry">Start Verification</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {opportunities.length === 0 ? (
         <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No Opportunities Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enterprises and Prime Contractors: Get started by posting a new opportunity.
            <br />
            Small Businesses: Check back soon for new listings, or complete your verification to see all available projects.
          </p>
          <Button asChild className="mt-4">
            <Link href="/opportunities/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post New Opportunity
            </Link>
          </Button>
        </div>
      ) : (
        <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${!isUserVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          {opportunities.map((opportunity) => (
            <Link
              key={opportunity.id}
              href={isUserVerified ? `/opportunities/${opportunity.id}?verified=true` : '#'}
              className={`block group ${!isUserVerified ? 'cursor-not-allowed' : ''}`}
              onClick={(e) => !isUserVerified && e.preventDefault()}
              aria-disabled={!isUserVerified}
            >
              <Card className={`flex flex-col h-full transition-all duration-200 ease-in-out ${isUserVerified ? 'group-hover:shadow-xl group-hover:border-primary/50' : 'bg-muted/30 border-dashed'}`}>
                <CardHeader>
                  {opportunity.imageUrl && (
                     <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image
                        src={opportunity.imageUrl}
                        alt={opportunity.title}
                        width={600}
                        height={400}
                        className={`object-cover transition-transform duration-300 ${isUserVerified ? 'group-hover:scale-105' : ''}`}
                        data-ai-hint="business collaboration contract"
                      />
                    </div>
                  )}
                  <CardTitle className={`${isUserVerified ? 'group-hover:text-primary' : 'text-muted-foreground/70'} transition-colors`}>{opportunity.title}</CardTitle>
                  {opportunity.setAsideStatus && <Badge variant="secondary" className="mt-1 w-fit">{opportunity.setAsideStatus}</Badge>}
                  <CardDescription className="line-clamp-3 mt-2">{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Budget & Timeline</h4>
                    <p className="text-sm">{opportunity.budget} &bull; {opportunity.timeline}</p>
                  </div>
                  {opportunity.diversityGoals && opportunity.diversityGoals.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Diversity Goals</h4>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.diversityGoals.slice(0,2).map((goal, index) => (
                          <Badge key={index} variant="outline" className="bg-accent/10 text-accent-foreground border-accent/30">{goal.type} {goal.percentage ? `(${goal.percentage}%)` : ''}</Badge>
                        ))}
                         {opportunity.diversityGoals.length > 2 && <Badge variant="outline">+{opportunity.diversityGoals.length - 2} more</Badge>}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.requiredSkills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                      {opportunity.requiredSkills.length > 3 && <Badge variant="outline">+{opportunity.requiredSkills.length - 3} more</Badge>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className={`w-full ${isUserVerified ? 'text-primary group-hover:text-primary/80' : 'text-muted-foreground'}`} tabIndex={-1} disabled={!isUserVerified}>
                      View Details {isUserVerified && <ArrowUpRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div>Loading opportunities...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
