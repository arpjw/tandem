import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, PlusCircle, Briefcase as BriefcaseIcon } from 'lucide-react'; // Renamed to avoid conflict
import { mockProjects } from '@/lib/mockData';
import type { Project } from '@/lib/types';
import { PageTitle } from '@/components/PageTitle';

export default function ProjectsPage() {
  const projects: Project[] = mockProjects;

  return (
    <>
      <PageTitle 
        title="Projects"
        description="Browse and manage project postings."
        action={
          <Button asChild>
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post New Project
            </Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
         <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-semibold">No projects found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by posting a new project.
          </p>
          <Button asChild className="mt-4">
            <Link href="/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Post New Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                {project.imageUrl && (
                   <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
                    <Image 
                      src={project.imageUrl} 
                      alt={project.title} 
                      layout="fill" 
                      objectFit="cover"
                      data-ai-hint="project meeting"
                    />
                  </div>
                )}
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Budget & Timeline</h4>
                  <p className="text-sm">{project.budget} &bull; {project.timeline}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Required Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {project.requiredSkills.length > 4 && <Badge variant="outline">+{project.requiredSkills.length - 4} more</Badge>}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="w-full text-primary">
                  <Link href={`/projects/${project.id}`}>
                    View Details <ArrowUpRight className="ml-2 h-4 w-4" />
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
