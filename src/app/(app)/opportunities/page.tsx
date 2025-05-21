
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Briefcase as BriefcaseIcon, AlertTriangle } from 'lucide-react'; 
import { mockOpportunities } from '@/lib/mockData';
import type { Opportunity } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';

export default function OpportunitiesPage() {
  const opportunities: Opportunity[] = mockOpportunities;

  return (
    <>
      <PageTitle 
        title="Subcontracting Opportunities"
        description="Browse and manage subcontracting opportunities and RFPs."
        action={
          <Button asChild>
            <Link href="/opportunities/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post New Opportunity
            </Link>
          </Button>
        }
      />

      {opportunities.length === 0 ? (
         <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No Opportunities Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Enterprises and Prime Contractors: Get started by posting a new opportunity.
            <br />
            Small Businesses: Check back soon for new listings.
          </p>
          <Button asChild className="mt-4">
            <Link href="/opportunities/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post New Opportunity
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <Link key={opportunity.id} href={`/opportunities/${opportunity.id}`} className="block group">
              <Card className="flex flex-col h-full transition-all duration-200 ease-in-out group-hover:shadow-xl group-hover:border-primary/50">
                <CardHeader>
                  {opportunity.imageUrl && (
                     <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image 
                        src={opportunity.imageUrl} 
                        alt={opportunity.title} 
                        layout="fill" 
                        objectFit="cover"
                        data-ai-hint="business collaboration contract" /* Updated hint */
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardTitle className="group-hover:text-primary transition-colors">{opportunity.title}</CardTitle>
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
                  <Button variant="ghost" size="sm" className="w-full text-primary group-hover:text-primary/80" tabIndex={-1}>
                      View Details <ArrowUpRight className="ml-2 h-4 w-4" />
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
