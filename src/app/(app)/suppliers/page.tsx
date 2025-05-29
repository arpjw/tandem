
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { mockSuppliers } from '@/lib/mockData'; // Renamed
import type { Supplier } from '@/lib/types'; // Renamed
import { PageTitle } from '@/components/PageTitle';

export default function SuppliersPage() { // Renamed
  const suppliers: Supplier[] = mockSuppliers; // Renamed

  return (
    <>
      <PageTitle 
        title="Small Business Suppliers (SMBs)" // Renamed
        description="Discover and connect with verified small businesses and diverse suppliers."
        action={
          <Button asChild>
            <Link href="/suppliers/new"> {/* Path updated */}
              <PlusCircle className="mr-2 h-4 w-4" /> Register/Update SMB Profile
            </Link>
          </Button>
        }
      />
      
      {suppliers.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No SMB Suppliers Found</h3> {/* Renamed */}
          <p className="mt-1 text-sm text-muted-foreground">
            Are you an SMB? Get started by creating your profile to get matched with opportunities.
          </p>
          <Button asChild className="mt-4">
            <Link href="/suppliers/new"> {/* Path updated */}
              <PlusCircle className="mr-2 h-4 w-4" /> Create SMB Profile
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => ( // Renamed
            <Link key={supplier.id} href={`/suppliers/${supplier.id}`} className="block group"> {/* Path updated */}
              <Card className="flex flex-col h-full transition-all duration-200 ease-in-out group-hover:shadow-xl group-hover:border-primary/50">
                <CardHeader>
                  {supplier.imageUrl && (
                    <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                      <Image 
                        src={supplier.imageUrl} 
                        alt={supplier.name} 
                        layout="fill" 
                        objectFit="cover" 
                        data-ai-hint="business team diverse"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardTitle className="group-hover:text-primary transition-colors flex items-center">
                    {supplier.name}
                    {supplier.isVerified && <ShieldCheck className="ml-2 h-5 w-5 text-green-500" title="Verified Supplier" />} {/* Text updated */}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">{supplier.businessDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  {supplier.certifications && supplier.certifications.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Key Certifications</h4>
                      <div className="flex flex-wrap gap-1">
                        {supplier.certifications.slice(0, 3).map((cert) => (
                          <Badge key={cert} variant="default" className="bg-accent/80 hover:bg-accent text-accent-foreground">{cert}</Badge>
                        ))}
                        {supplier.certifications.length > 3 && <Badge variant="outline">+{supplier.certifications.length - 3} more</Badge>}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Core Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {supplier.expertise.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                      {supplier.expertise.length > 3 && <Badge variant="outline">+{supplier.expertise.length - 3} more</Badge>}
                    </div>
                  </div>
                   {supplier.industryFocus && supplier.industryFocus.length > 0 && (
                     <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Industry Focus</h4>
                       <div className="flex flex-wrap gap-1">
                        {supplier.industryFocus.slice(0,2).map((industry) => (
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
