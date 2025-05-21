
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Globe, Briefcase, UsersIcon as Users, Building2, Clock, Award, Layers, Lightbulb, ShieldCheck, FileText, Star, CheckCircle, Tag, Landmark } from 'lucide-react';
import { mockVendors } from '@/lib/mockData';
import type { Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';

export default function VendorProfilePage({ params }: { params: { id: string } }) {
  const vendor = mockVendors.find(v => v.id === params.id);

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Vendor not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The SMB vendor profile you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/vendors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
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
            {vendor.name}
            {vendor.isVerified && <ShieldCheck className="h-7 w-7 text-green-500" title="Verified Vendor"/>}
          </div>
        }
        description="Detailed Small Business (SMB) profile and capabilities."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/vendors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors</Link>
            </Button>
            <Button asChild> {/* Add href to edit page later */}
              <Link href={`/vendors/new?id=${vendor.id}`}> {/* Assuming new page handles edits */}
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
             <CardHeader className="p-0">
              {vendor.imageUrl && (
                <div className="relative aspect-video w-full" data-ai-hint="business team office">
                  <Image src={vendor.imageUrl} alt={`${vendor.name} visual representation`} layout="fill" objectFit="cover" />
                </div>
              )}
             </CardHeader>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-xl font-semibold">{vendor.name}</h2>
              {vendor.isVerified && <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white w-fit"><CheckCircle className="mr-1.5 h-4 w-4"/> Verified SMB</Badge>}

              {vendor.companySize && <p className="text-sm text-muted-foreground flex items-center"><Building2 className="mr-1.5 h-4 w-4 text-primary" />{vendor.companySize}</p>}
              {vendor.yearsOfExperience !== undefined && <p className="text-sm text-muted-foreground flex items-center"><Clock className="mr-1.5 h-4 w-4 text-primary" />{vendor.yearsOfExperience} years of experience</p>}
              {vendor.availability && <p className="text-sm text-muted-foreground flex items-center"><Star className="mr-1.5 h-4 w-4 text-primary" />{vendor.availability}</p>}
              
              {vendor.dunsNumber && <p className="text-sm text-muted-foreground flex items-center"><Landmark className="mr-1.5 h-4 w-4 text-primary" />DUNS: {vendor.dunsNumber}</p>}

              {vendor.portfolioLinks && vendor.portfolioLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Portfolio/Website</h4>
                  {vendor.portfolioLinks.map((link, index) => (
                     <Button key={index} variant="link" asChild className="p-0 h-auto block text-primary text-sm break-all hover:underline">
                       <a href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer">{link} <Globe className="inline ml-1 h-3 w-3"/></a>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
           {vendor.certifications && vendor.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendor.certifications.map((cert) => (
                    <Badge key={cert} variant="default" className="text-sm bg-accent/80 hover:bg-accent text-accent-foreground">{cert}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {vendor.naicsCodes && vendor.naicsCodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" /> NAICS Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendor.naicsCodes.map((code) => (
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
              <p className="text-muted-foreground whitespace-pre-wrap">{vendor.businessDescription}</p>
              {vendor.capacitySummary && (
                <div className="mt-4 p-3 bg-muted/20 rounded-md border">
                  <h4 className="font-semibold text-sm mb-1">Capacity Summary:</h4>
                  <p className="text-sm text-muted-foreground">{vendor.capacitySummary}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {vendor.aiGeneratedProfile && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" /> AI Generated Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap italic">{vendor.aiGeneratedProfile}</p>
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
                  {vendor.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </section>
              <Separator/>
              <section>
                <h3 className="text-md font-semibold mb-2">Services Offered:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {vendor.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </section>
            </CardContent>
          </Card>

          {vendor.projectHistory && vendor.projectHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Project History / Past Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.projectHistory.map((project, index) => (
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
          
          {vendor.industryFocus && vendor.industryFocus.length > 0 && (
            <Card>
              <CardHeader>
                 <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Industry Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {vendor.industryFocus.map((industry) => (
                    <Badge key={industry} variant="outline" className="text-sm">{industry}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {vendor.awardsAndCertifications && vendor.awardsAndCertifications.length > 0 && (
            <Card>
              <CardHeader>
                 <CardTitle className="text-xl flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Additional Awards & Professional Certs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {vendor.awardsAndCertifications.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <CardFooter className="mt-6 bg-muted/30 p-6 border-t flex justify-end">
          <Button variant="default" size="lg" asChild>
             <Link href={`/communication?vendorId=${vendor.id}`}> {/* Allow initiating communication even without specific opportunity */}
                <MessageSquare className="mr-2 h-4 w-4" /> Contact Vendor
            </Link>
          </Button>
      </CardFooter>
    </>
  );
}
