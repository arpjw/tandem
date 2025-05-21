import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Globe, Briefcase, UsersIcon } from 'lucide-react'; // UsersIcon to avoid conflict with component name
import { mockVendors } from '@/lib/mockData';
import type { Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';

export default function VendorProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch this data based on params.id
  const vendor = mockVendors.find(v => v.id === params.id);

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
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
        {vendor.imageUrl && (
          <div className="relative h-60 w-full" data-ai-hint="business professional">
            <Image src={vendor.imageUrl} alt={`${vendor.name} cover image`} layout="fill" objectFit="cover" />
          </div>
        )}
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">{vendor.name}</CardTitle>
          <CardDescription>{vendor.businessDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {vendor.aiGeneratedProfile && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> AI Generated Overview
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{vendor.aiGeneratedProfile}</p>
              </div>
            )}
             {!vendor.aiGeneratedProfile && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" /> Business Overview
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{vendor.businessDescription}</p>
              </div>
            )}
          </div>
          <div className="md:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><UsersIcon className="mr-2 h-5 w-5 text-primary" /> Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Services Offered</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {vendor.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
            {vendor.portfolioLinks && vendor.portfolioLinks.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center"><Globe className="mr-2 h-5 w-5 text-primary" /> Portfolio</h3>
                  {vendor.portfolioLinks.map((link, index) => (
                    <Button key={index} variant="link" asChild className="p-0 h-auto block text-primary">
                       <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 border-t">
            <Button variant="default">
                Contact Vendor
            </Button>
        </CardFooter>
      </Card>
    </>
  );
}
