
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, MessageSquare, CheckCircle, Award } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="w-full max-w-4xl px-4 text-center"> {/* Added text-center here */}
        <PageTitle
          title="Tandem Dashboard"
          description="Welcome to Tandem, your AI-powered vendor matchmaking platform."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+8 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Suppliers</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">350</div>
              <p className="text-xs text-muted-foreground">+15 verified this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-Powered Matches</CardTitle>
              <Award className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78</div>
              <p className="text-xs text-muted-foreground">Successful pairings this quarter</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Key actions for businesses and suppliers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link href="/opportunities/new">
                  <Briefcase className="mr-2 h-4 w-4" /> Post New Project/Opportunity
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start">
                <Link href="/suppliers/new">
                  <Users className="mr-2 h-4 w-4" /> Build/Update Supplier Profile
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full justify-start">
                <Link href="/opportunities">
                  <CheckCircle className="mr-2 h-4 w-4" /> View Opportunity Feed
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
              <CardDescription>Latest platform updates and matches.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span>New Opportunity: "Enterprise Software Upgrade" posted.</span>
                  <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View</Link>
                </li>
                <li className="flex items-center justify-between">
                  <span>Supplier "Innovatech Solutions" achieved 'Verified' status.</span>
                  <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View</Link>
                </li>
                <li className="flex items-center justify-between">
                  <span>AI matched 3 suppliers to "Marketing Campaign Project".</span>
                  <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View Matches</Link>
                </li>
                <li className="flex items-center justify-between">
                  <span>"BuildRight Contractors" updated their portfolio.</span>
                  <Link href="#" className="text-primary hover:underline text-xs" prefetch={false}>View Profile</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
