
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Users as UsersIcon } from 'lucide-react'; // UsersIcon to avoid conflict with local component
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
          <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
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
                        data-ai-hint="business team"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardTitle className="group-hover:text-primary transition-colors">{vendor.name}</CardTitle>
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
