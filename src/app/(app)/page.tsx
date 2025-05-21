import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Users, Briefcase, MessageSquare } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';

export default function DashboardPage() {
  return (
    <>
      <PageTitle title="Dashboard" description="Welcome to Inertia, your platform for B2B collaboration." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+5 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Vendors</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">+20 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Messages</CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 unread</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/projects/new">
                <Briefcase className="mr-2 h-4 w-4" /> Post a New Project
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link href="/vendors/new">
                <Users className="mr-2 h-4 w-4" /> Create Vendor Profile
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link href="/communication">
                <MessageSquare className="mr-2 h-4 w-4" /> Go to Communication Hub
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
             <CardDescription>Overview of recent platform activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span>New project "AI Chatbot Integration" posted.</span>
                <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View</Link>
              </li>
              <li className="flex items-center justify-between">
                <span>Vendor "Tech Solutions Inc." updated their profile.</span>
                 <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View</Link>
              </li>
              <li className="flex items-center justify-between">
                <span>3 new vendor matches for "Mobile App Development".</span>
                 <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View</Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
