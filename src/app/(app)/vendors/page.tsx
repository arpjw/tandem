import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle } from 'lucide-react';
import { mockVendors } from '@/lib/mockData';
import type { Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';

export default function VendorsPage() {
  const vendors: Vendor[] = mockVendors;

  return (
    <>
      <PageTitle 
        title="Vendors"
        description="Browse and manage vendor profiles."
        action={
          <Button asChild>
            <Link href="/vendors/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Vendor
            </Link>
          </Button>
        }
      />
      
      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No vendors found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new vendor profile.
          </p>
          <Button asChild className="mt-4">
            <Link href="/vendors/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Vendor
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="flex flex-col">
              <CardHeader>
                {vendor.imageUrl && (
                  <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image 
                      src={vendor.imageUrl} 
                      alt={vendor.name} 
                      layout="fill" 
                      objectFit="cover" 
                      data-ai-hint="business team" 
                    />
                  </div>
                )}
                <CardTitle>{vendor.name}</CardTitle>
                <CardDescription className="line-clamp-2">{vendor.businessDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-2">
                  <h4 className="text-sm font-semibold mb-1">Expertise:</h4>
                  <div className="flex flex-wrap gap-1">
                    {vendor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {vendor.expertise.length > 3 && <Badge variant="outline">+{vendor.expertise.length - 3} more</Badge>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-1">Services:</h4>
                   <div className="flex flex-wrap gap-1">
                    {vendor.services.slice(0, 3).map((service) => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                    {vendor.services.length > 3 && <Badge variant="outline">+{vendor.services.length - 3} more</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full text-primary">
                  <Link href={`/vendors/${vendor.id}`}>
                    View Profile <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// Placeholder icon if needed and not available in Lucide.
const Users = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
