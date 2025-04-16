
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Users, CheckCircle, AlertCircle, Zap, PhoneCall, Mail, TrendingUp } from "lucide-react";
import { LeadActivity } from "@/components/dashboard/LeadActivity";
import { PipelineChart } from "@/components/dashboard/PipelineChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Lead</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-gray-500">+18% from last month</p>
            <Progress value={65} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,264</div>
            <p className="text-xs text-gray-500">+7% from last month</p>
            <Progress value={45} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.2%</div>
            <p className="text-xs text-gray-500">+2.4% from last month</p>
            <Progress value={18} className="h-1 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-gray-500">12 urgent tasks</p>
            <Progress value={75} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
            <CardDescription>
              Lead distribution across sales pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PipelineChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest lead interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LeadActivity />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>
              Leads added in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentLeads />
          </CardContent>
        </Card>
        
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Tasks</CardTitle>
              <Tabs defaultValue="calls">
                <TabsList>
                  <TabsTrigger value="calls">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Calls
                  </TabsTrigger>
                  <TabsTrigger value="emails">
                    <Mail className="h-4 w-4 mr-2" />
                    Emails
                  </TabsTrigger>
                  <TabsTrigger value="follow-ups">
                    <Zap className="h-4 w-4 mr-2" />
                    Follow-ups
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calls">
              <TabsContent value="calls">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="font-medium">Call with Jane Smith</div>
                        <div className="text-sm text-gray-500">Today, 2:00 PM</div>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button size="sm">Call</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="emails">
                <div className="p-8 text-center text-muted-foreground">
                  No email tasks scheduled for today
                </div>
              </TabsContent>
              <TabsContent value="follow-ups">
                <div className="p-8 text-center text-muted-foreground">
                  No follow-ups scheduled for today
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
