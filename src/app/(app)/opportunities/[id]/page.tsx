
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, DollarSign, CalendarDays, ListChecks, Brain, Users, MessageSquare, Target, Milestone, Building, ShieldCheck, Flag, Award, AlertTriangle, Briefcase } from 'lucide-react';
import { mockOpportunities, mockVendors } from '@/lib/mockData';
import type { Opportunity, Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function OpportunityDetailsContent({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const isUserVerified = searchParams.get('verified') === 'true';

  const opportunity = mockOpportunities.find(p => p.id === params.id);

  const matchedVendors: Vendor[] = opportunity ? mockVendors.slice(0, 3).filter(v =>
    (opportunity.diversityGoals && opportunity.diversityGoals.length > 0 ?
      v.certifications?.some(cert => opportunity.diversityGoals?.map(dg => dg.type.toLowerCase()).includes(cert.toLowerCase())) : true) ||
    (opportunity.requiredSkills.some(skill => v.expertise.includes(skill)))
  ) : [];


  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Opportunity not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The subcontracting opportunity you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/opportunities">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={opportunity.title}
        description={opportunity.companyBackground || "Detailed opportunity information and requirements."}
        action={
           <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/opportunities${isUserVerified ? '?verified=true' : ''}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities</Link>
            </Button>
             <Button disabled> {/* Add href to edit page later, consider verification */}
              <Edit className="mr-2 h-4 w-4" /> Edit Opportunity
            </Button>
          </div>
        }
      />

      {!isUserVerified && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Required</AlertTitle>
          <AlertDescription>
            You must be a verified vendor to express interest or apply for this opportunity.
            <Button variant="link" asChild className="p-0 h-auto ml-1 text-destructive hover:text-destructive/80">
              <Link href="/vendors/onboarding/industry">Complete Verification</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!isUserVerified ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="lg:col-span-2 space-y-8">
          <Card>
             {opportunity.imageUrl && (
              <div className="relative h-60 w-full rounded-t-lg overflow-hidden">
                <Image src={opportunity.imageUrl} alt={`${opportunity.title} cover image`} layout="fill" objectFit="cover" data-ai-hint="contract agreement deal"/>
              </div>
            )}
            <CardHeader className={opportunity.imageUrl ? "pt-6 border-t" : "pt-6"}>
              <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
              {opportunity.setAsideStatus && <Badge variant="outline" className="mt-2 w-fit text-sm py-1 px-3">{opportunity.setAsideStatus}</Badge>}
            </CardHeader>
            <CardContent className="space-y-6">
              {opportunity.companyBackground && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> Posting Organization Background</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.companyBackground}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">Opportunity Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Budget / Value</h4>
                  <p className="text-muted-foreground">{opportunity.budget}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Timeline / Duration</h4>
                  <p className="text-muted-foreground">{opportunity.timeline}</p>
                </div>
              </div>
               {opportunity.opportunityType && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Opportunity Type</h3>
                    <p className="text-muted-foreground">{opportunity.opportunityType}</p>
                  </div>
                </>
              )}
              {opportunity.keyDeliverables && opportunity.keyDeliverables.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Milestone className="mr-2 h-5 w-5 text-primary" /> Key Deliverables</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {opportunity.keyDeliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
               <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Required Skills & Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </div>

              {opportunity.diversityGoals && opportunity.diversityGoals.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Supplier Diversity Goals</h3>
                    <div className="space-y-2">
                      {opportunity.diversityGoals.map((goal, index) => (
                        <div key={index} className="p-2 border rounded-md bg-muted/30">
                          <p className="font-medium">{goal.type}
                            {goal.percentage && <span className="ml-2 text-sm text-muted-foreground">({goal.percentage}% target)</span>}
                          </p>
                          {goal.description && <p className="text-xs text-muted-foreground">{goal.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {opportunity.complianceRequirements && opportunity.complianceRequirements.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Compliance Requirements</h3>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.complianceRequirements.map((compliance, index) => (
                        <Badge key={index} variant="outline" className="text-sm">{compliance}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {(opportunity.aiSuggestedSkills || opportunity.aiSuggestedExperience || opportunity.aiSuggestedVendorQualifications) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Brain className="mr-2 h-5 w-5 text-primary" /> AI Analysis & Insights</h3>
                    <div className="space-y-4 p-4 bg-secondary/30 rounded-md border">
                      {opportunity.aiSuggestedSkills && opportunity.aiSuggestedSkills.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-1">AI Suggested Skills:</h4>
                           <div className="flex flex-wrap gap-2">
                            {opportunity.aiSuggestedSkills.map(skill => (
                              <Badge key={skill} variant="default">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {opportunity.aiSuggestedExperience && (
                        <div>
                          <h4 className="text-md font-semibold mb-1 mt-2">AI Suggested Experience:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.aiSuggestedExperience}</p>
                        </div>
                      )}
                      {opportunity.aiSuggestedVendorQualifications && (
                        <div>
                          <h4 className="text-md font-semibold mb-1 mt-2">AI Suggested Vendor Qualifications:</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{opportunity.aiSuggestedVendorQualifications}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
                <Button variant="default" size="lg" disabled={!isUserVerified}>
                    Bid
                </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Matched SMB Vendors</CardTitle>
              <CardDescription>Vendors suggested for this opportunity by Tandem AI.</CardDescription>
            </CardHeader>
            <CardContent>
              {matchedVendors.length > 0 ? (
                <ul className="space-y-4">
                  {matchedVendors.map((vendor) => (
                    <li key={vendor.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/10 transition-colors">
                      {vendor.imageUrl && <Image src={vendor.imageUrl} alt={vendor.name} width={48} height={48} className="rounded-full h-12 w-12 object-cover" data-ai-hint="business team logo"/>}
                      {!vendor.imageUrl && <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold">{vendor.name.charAt(0)}</div>}
                      <div>
                        <Link href={`/vendors/${vendor.id}${isUserVerified ? '?verified=true' : ''}`} className="font-semibold text-primary hover:underline" prefetch={false}>
                          {vendor.name} {vendor.isVerified && <ShieldCheck className="inline h-4 w-4 ml-1 text-green-500" title="Verified Vendor"/>}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2">{vendor.businessDescription}</p>
                        {vendor.certifications && vendor.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {vendor.certifications.slice(0,2).map(cert => <Badge key={cert} variant="secondary" className="text-xs">{cert}</Badge>)}
                          </div>
                        )}
                        <div className="mt-2">
                            <Button variant="outline" size="sm" asChild disabled={!isUserVerified}>
                                <Link href={`/communication?opportunityId=${opportunity.id}&vendorId=${vendor.id}${isUserVerified ? '&verified=true' : ''}`}>
                                    <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                                </Link>
                            </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No specific vendors matched yet. AI matching is in progress or broaden criteria.</p>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="link" className="w-full text-primary hover:text-primary/80" disabled={!isUserVerified}>View all AI matches</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}


export default function OpportunityDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading opportunity details...</div>}>
      <OpportunityDetailsContent params={params} />
    </Suspense>
  );
}
