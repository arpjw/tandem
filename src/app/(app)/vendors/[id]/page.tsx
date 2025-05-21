
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Globe, Briefcase, UsersIcon as Users, Building2, Clock, Award, Layers, Lightbulb } from 'lucide-react';
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
          The vendor profile you are looking for does not exist.
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
        title={vendor.name}
        description="Detailed vendor profile and information."
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/vendors"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors</Link>
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 p-6 bg-muted/30 border-b md:border-r md:border-b-0">
            {vendor.imageUrl && (
              <div className="relative aspect-square w-full max-w-[200px] mx-auto mb-4 rounded-lg overflow-hidden" data-ai-hint="business professional">
                <Image src={vendor.imageUrl} alt={`${vendor.name} logo`} layout="fill" objectFit="cover" />
              </div>
            )}
            <h2 className="text-2xl font-semibold text-center mb-1">{vendor.name}</h2>
            {vendor.companySize && <p className="text-sm text-muted-foreground text-center mb-1 flex items-center justify-center"><Building2 className="mr-1.5 h-4 w-4" />{vendor.companySize}</p>}
            {vendor.yearsOfExperience !== undefined && <p className="text-sm text-muted-foreground text-center mb-4 flex items-center justify-center"><Clock className="mr-1.5 h-4 w-4" />{vendor.yearsOfExperience} years of experience</p>}
             {vendor.availability && (
              <>
                <Separator className="my-4"/>
                <div>
                  <h4 className="text-sm font-semibold mb-1 text-primary">Availability</h4>
                  <p className="text-sm text-muted-foreground">{vendor.availability}</p>
                </div>
              </>
            )}
            {vendor.portfolioLinks && vendor.portfolioLinks.length > 0 && (
              <>
                <Separator className="my-4"/>
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-primary flex items-center"><Globe className="mr-2 h-4 w-4" /> Portfolio</h4>
                  {vendor.portfolioLinks.map((link, index) => (
                    <Button key={index} variant="link" asChild className="p-0 h-auto block text-primary text-sm break-all">
                       <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="md:col-span-2 p-6">
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-primary flex items-center">
                <Briefcase className="mr-2 h-5 w-5" /> Business Overview
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{vendor.businessDescription}</p>
            </section>
            
            {vendor.aiGeneratedProfile && (
              <>
                <Separator className="my-6" />
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-primary flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" /> AI Generated Summary
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap italic">{vendor.aiGeneratedProfile}</p>
                </section>
              </>
            )}

            <Separator className="my-6" />
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                ))}
              </div>
            </section>

            <Separator className="my-6" />
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center"><Layers className="mr-2 h-5 w-5 text-primary" /> Services Offered</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {vendor.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </section>
            
            {vendor.industryFocus && vendor.industryFocus.length > 0 && (
              <>
                <Separator className="my-6" />
                <section className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" /> Industry Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.industryFocus.map((industry) => (
                      <Badge key={industry} variant="outline" className="text-sm">{industry}</Badge>
                    ))}
                  </div>
                </section>
              </>
            )}

            {vendor.awardsAndCertifications && vendor.awardsAndCertifications.length > 0 && (
              <>
                <Separator className="my-6" />
                <section>
                  <h3 className="text-xl font-semibold mb-3 flex items-center"><Award className="mr-2 h-5 w-5 text-primary" /> Awards & Certifications</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {vendor.awardsAndCertifications.map((award) => (
                      <li key={award}>{award}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>
        </div>
        <CardFooter className="bg-muted/30 p-6 border-t flex justify-end">
            <Button variant="default" size="lg">
                Contact Vendor
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
