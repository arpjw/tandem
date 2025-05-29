
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Globe, Briefcase, UsersIcon as Users, Building2, Clock, Award, Layers, Lightbulb, ShieldCheck, FileText, Star, CheckCircle, Tag, Landmark, MessageSquare, AlertTriangle } from 'lucide-react';
import { mockSuppliers } from '@/lib/mockData'; // Renamed
import type { Supplier } from '@/lib/types'; // Renamed
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function SupplierProfileContent({ params }: { params: { id: string } }) { // Renamed
  const searchParams = useSearchParams();
  const isCurrentUserVerified = searchParams.get('verified') === 'true';
  const opportunityIdContext = searchParams.get('opportunityId'); // For "Accept/Reject Bid" context

  const supplier = mockSuppliers.find(v => v.id === params.id); // Renamed

  // Placeholder: In a real app, fetch bid details for this supplier and opportunityIdContext
  const relevantBid = opportunityIdContext && supplier ? 
    mockOpportunities.find(opp => opp.id === opportunityIdContext)?.bids?.find(b => b.supplierId === supplier.id && b.status === 'pending') 
    : null;


  if (!supplier) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Supplier not found</h3> {/* Renamed */}
        <p className="mt-1 text-sm text-muted-foreground">
          The SMB supplier profile you are looking for does not exist. {/* Renamed */}
        </p>
        <Button asChild className="mt-4">
          <Link href={`/suppliers${isCurrentUserVerified ? '?verified=true' : ''}`}> {/* Path Updated */}
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers {/* Renamed */}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={
          <div className="flex items-center gap-2">
            {supplier.name}
            {supplier.isVerified && <ShieldCheck className="h-7 w-7 text-green-500" title="Verified Supplier"/>} {/* Text Updated */}
          </div>
        }
        description="Detailed Small Business (SMB) profile and capabilities."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/suppliers${isCurrentUserVerified ? '?verified=true' : ''}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers</Link> {/* Path Updated */}
            </Button>
            <Button asChild> {/* Assuming only owners or admins can edit */}
              <Link href={`/suppliers/new?id=${supplier.id}${isCurrentUserVerified ? '&verified=true' : ''}`}> {/* Path Updated */}
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        }
      />

      {!supplier.isVerified && (
        <Alert variant="warning" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Profile Incomplete or Unverified</AlertTitle>
          <AlertDescription>
            This supplier's profile may not be fully verified. If this is your profile, please complete the verification process.
            <Button variant="link" asChild className="p-0 h-auto ml-1">
               <Link href={`/suppliers/onboarding/documents?industry=${encodeURIComponent(supplier.industry || '')}`}>Complete Verification</Link> {/* Path Updated */}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
             <CardHeader className="p-0">
              {supplier.imageUrl && (
                <div className="relative aspect-video w-full" data-ai-hint="business team office">
                  <Image src={supplier.imageUrl} alt={`${supplier.name} visual representation`} layout="fill" objectFit="cover" />
                </div>
              )}
             </CardHeader>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold">{supplier.name}</h2>
              {supplier.isVerified && <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white w-fit"><CheckCircle className="mr-1.5 h-4 w-4"/> Verified SMB</Badge>}

              {supplier.industry && <p className="text-sm text-muted-foreground flex items-center"><Briefcase className="mr-1.5 h-4 w-4 text-primary" />Industry: {supplier.industry}</p>}
              {supplier.companySize && <p className="text-sm text-muted-foreground flex items-center"><Building2 className="mr-1.5 h-4 w-4 text-primary" />{supplier.companySize}</p>}
              {supplier.yearsOfExperience !== undefined && <p className="text-sm text-muted-foreground flex items-center"><Clock className="mr-1.5 h-4 w-4 text-primary" />{supplier.yearsOfExperience} years of experience</p>}
              {supplier.availability && <p className="text-sm text-muted-foreground flex items-center"><Star className="mr-1.5 h-4 w-4 text-primary" />{supplier.availability}</p>}

              {supplier.dunsNumber && <p className="text-sm text-muted-foreground flex items-center"><Landmark className="mr-1.5 h-4 w-4 text-primary" />DUNS: {supplier.dunsNumber}</p>}

              {supplier.portfolioLinks && supplier.portfolioLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Portfolio/Website</h4>
                  {supplier.portfolioLinks.map((link, index) => (
                     <Button key={index} variant="link" asChild className="p-0 h-auto block text-primary text-sm break-all hover:underline">
                       <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer">{link} <Globe className="inline ml-1 h-3 w-3"/></a>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
           {supplier.certifications && supplier.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications.map((cert) => (
                    <Badge key={cert} variant="default" className="text-sm bg-accent/80 hover:bg-accent text-accent-foreground">{cert}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {supplier.naicsCodes && supplier.naicsCodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" /> NAICS Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.naicsCodes.map((code) => (
                    <Badge key={code} variant="outline">{code}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
               <CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Business Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{supplier.businessDescription}</p>
              {supplier.capacitySummary && (
                <div className="mt-4 p-3 bg-muted/20 rounded-md border">
                  <h4 className="font-semibold text-sm mb-1">Capacity Summary:</h4>
                  <p className="text-sm text-muted-foreground">{supplier.capacitySummary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {supplier.aiGeneratedProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" /> AI Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap italic">{supplier.aiGeneratedProfile}</p>
                </CardContent>
              </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Layers className="mr-2 h-5 w-5 text-primary" /> Core Expertise & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <section>
                <h3 className="text-md font-semibold mb-2">Expertise Areas:</h3>
                <div className="flex flex-wrap gap-2">
                  {supplier.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </section>
              <Separator/>
              <section>
                <h3 className="text-md font-semibold mb-2">Services Offered:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {supplier.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </section>
            </CardContent>
          </Card>

          {supplier.projectHistory && supplier.projectHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Project History / Past Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplier.projectHistory.map((project, index) => (
                  <div key={index} className="p-4 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-md text-primary">{project.title} ({project.year})</h4>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Client/Prime:</span> {project.client}</p>
                    <p className="text-sm mt-1 text-muted-foreground"><span className="font-medium text-foreground">Description:</span> {project.description}</p>
                    <p className="text-sm mt-1 text-accent-foreground/80 bg-accent/20 p-1 rounded-sm inline-block"><span className="font-medium text-accent">Outcome:</span> {project.outcome}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {supplier.industryFocus && supplier.industryFocus.length > 0 && (
            <Card>
              <CardHeader>
                 <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Industry Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.industryFocus.map((industryItem) => (
                    <Badge key={industryItem} variant="outline" className="text-sm">{industryItem}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {supplier.awardsAndCertifications && supplier.awardsAndCertifications.length > 0 && (
            <Card>
              <CardHeader>
                 <CardTitle className="text-xl flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Additional Awards & Professional Certs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {supplier.awardsAndCertifications.map((awardItem) => (
                    <li key={awardItem}>{awardItem}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CardFooter className="mt-6 bg-muted/30 p-6 border-t flex flex-col sm:flex-row justify-end gap-3">
          {relevantBid && opportunityIdContext && (
            <>
              <Button variant="destructive" size="lg" onClick={() => alert('Bid Rejected (Simulated)')} disabled={!isCurrentUserVerified}>
                Reject Bid
              </Button>
              <Button variant="default" size="lg" asChild disabled={!isCurrentUserVerified}>
                 <Link href={`/buy/contract/${opportunityIdContext}/${supplier.id}?verified=true`}>
                    Accept Bid
                </Link>
              </Button>
            </>
          )}
          {!relevantBid && (
            <Button variant="default" size="lg" asChild disabled={!isCurrentUserVerified}>
              <Link href={`/communication?supplierId=${supplier.id}${isCurrentUserVerified ? '&verified=true' : ''}${opportunityIdContext ? `&opportunityId=${opportunityIdContext}` : ''}`}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Contact Supplier {/* Renamed */}
              </Link>
            </Button>
          )}
      </CardFooter>
    </>
  );
}

export default function SupplierProfilePage({ params }: { params: { id: string } }) { // Renamed
  // Import mockOpportunities here for the relevantBid logic if needed, or pass it down differently
  const { mockOpportunities } = require('@/lib/mockData');

  return (
    <Suspense fallback={<div>Loading supplier profile...</div>}> {/* Renamed */}
      <SupplierProfileContent params={params} /> {/* Renamed */}
    </Suspense>
  );
}
