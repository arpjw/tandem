
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { mockVendors } from '@/lib/mockData';
import type { Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';

export default function VendorsPage() {
  const vendors: Vendor[] = mockVendors;

  return (
    <>
      <PageTitle 
        title="Small Business Vendors (SMBs)"
        description="Discover and connect with verified small businesses and diverse suppliers."
        action={
          <Button asChild>
            <Link href="/vendors/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Register/Update SMB Profile
            </Link>
          </Button>
        }
      />
      
      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No SMB Vendors Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Are you an SMB? Get started by creating your profile to get matched with opportunities.
          </p>
          <Button asChild className="mt-4">
            <Link href="/vendors/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create SMB Profile
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="block group">
              <Card className="flex flex-col h-full transition-all duration-200 ease-in-out group-hover:shadow-xl group-hover:border-primary/50">
                <CardHeader>
                  {vendor.imageUrl && (
                    <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image 
                        src={vendor.imageUrl} 
                        alt={vendor.name} 
                        layout="fill" 
                        objectFit="cover" 
                        data-ai-hint="business team diverse" /* Updated hint */
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardTitle className="group-hover:text-primary transition-colors flex items-center">
                    {vendor.name}
                    {vendor.isVerified && <ShieldCheck className="ml-2 h-5 w-5 text-green-500" title="Verified Vendor" />}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{vendor.businessDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  {vendor.certifications && vendor.certifications.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Certifications</h4>
                      <div className="flex flex-wrap gap-1">
                        {vendor.certifications.slice(0, 3).map((cert) => (
                          <Badge key={cert} variant="default" className="bg-accent/80 hover:bg-accent text-accent-foreground">{cert}</Badge>
                        ))}
                        {vendor.certifications.length > 3 && <Badge variant="outline">+{vendor.certifications.length - 3} more</Badge>}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Core Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {vendor.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                      {vendor.expertise.length > 3 && <Badge variant="outline">+{vendor.expertise.length - 3} more</Badge>}
                    </div>
                  </div>
                   {vendor.industryFocus && vendor.industryFocus.length > 0 && (
                     <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Industry Focus</h4>
                       <div className="flex flex-wrap gap-1">
                        {vendor.industryFocus.slice(0,2).map((industry) => (
                          <Badge key={industry} variant="outline">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                   )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full text-primary group-hover:text-primary/80" tabIndex={-1}>
                    View Profile <ArrowUpRight className="ml-2 h-4 w-4" />
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
