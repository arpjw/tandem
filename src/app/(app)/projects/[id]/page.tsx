import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, DollarSign, CalendarDays, ListChecks, Brain, Users, MessageSquare } from 'lucide-react';
import { mockProjects, mockVendors } from '@/lib/mockData';
import type { Project, Vendor } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';
import { Separator } from '@/components/ui/separator';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = mockProjects.find(p => p.id === params.id);
  // Simulate matched vendors - in a real app this would be dynamic
  const matchedVendors: Vendor[] = project ? mockVendors.slice(0, 2) : [];

  if (!project) {
    return (
      <div className="text-center py-12">
        <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-semibold">Project not found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The project you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageTitle 
        title={project.title}
        description="Detailed project information and requirements."
        action={
           <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects</Link>
            </Button>
             <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Project
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
             {project.imageUrl && (
              <div className="relative h-60 w-full rounded-t-lg overflow-hidden" data-ai-hint="collaboration project">
                <Image src={project.imageUrl} alt={`${project.title} cover image`} layout="fill" objectFit="cover" />
              </div>
            )}
            <CardHeader className={project.imageUrl ? "border-t" : ""}>
              <CardTitle className="text-2xl">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" /> Budget</h4>
                  <p className="text-muted-foreground">{project.budget}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Timeline</h4>
                  <p className="text-muted-foreground">{project.timeline}</p>
                </div>
              </div>
               <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" /> Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">{skill}</Badge>
                  ))}
                </div>
              </div>

              {project.aiSuggestedSkills && project.aiSuggestedExperience && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><Brain className="mr-2 h-5 w-5 text-primary" /> AI Analysis</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-md font-semibold mb-1">AI Suggested Skills:</h4>
                         <div className="flex flex-wrap gap-2">
                          {project.aiSuggestedSkills.map(skill => (
                            <Badge key={skill} variant="default">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold mb-1">AI Suggested Experience:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.aiSuggestedExperience}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
                <Button variant="default" size="lg">
                    Apply for this Project
                </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Matched Vendors</CardTitle>
              <CardDescription>Vendors suggested for this project based on skills and experience.</CardDescription>
            </CardHeader>
            <CardContent>
              {matchedVendors.length > 0 ? (
                <ul className="space-y-4">
                  {matchedVendors.map((vendor) => (
                    <li key={vendor.id} className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
                      {vendor.imageUrl && <Image src={vendor.imageUrl} alt={vendor.name} width={48} height={48} className="rounded-full h-12 w-12 object-cover" data-ai-hint="person portrait"/>}
                      {!vendor.imageUrl && <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-semibold">{vendor.name.charAt(0)}</div>}
                      <div>
                        <Link href={`/vendors/${vendor.id}`} className="font-semibold text-primary hover:underline" prefetch={false}>
                          {vendor.name}
                        </Link>
                        <p className="text-xs text-muted-foreground line-clamp-2">{vendor.businessDescription}</p>
                        <div className="mt-1">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/communication?projectId=${project.id}&vendorId=${vendor.id}`}>
                                    <MessageSquare className="mr-1.5 h-3 w-3" /> Message
                                </Link>
                            </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No vendors matched yet. AI matching is in progress.</p>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="link" className="w-full">View all vendor matches</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
