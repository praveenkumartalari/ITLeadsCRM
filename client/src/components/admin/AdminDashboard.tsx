
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent 
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart, 
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { 
  Users, 
  Target, 
  ArrowUpRight, 
  Clock, 
  DollarSign, 
  BarChart4,
  Calendar,
  Award,
  UserPlus
} from "lucide-react";

// Mock data for targets
const targetData = {
  monthly: {
    target: 100000,
    reached: 65000,
    pending: 35000,
    estimatedDays: 12,
  },
  quarterly: {
    target: 300000,
    reached: 180000,
    pending: 120000,
    estimatedDays: 42,
  },
  yearly: {
    target: 1200000,
    reached: 720000,
    pending: 480000,
    estimatedDays: 180,
  },
};

// Mock data for the charts
const monthlyPerformanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Target",
      data: [80000, 85000, 90000, 95000, 100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000],
      borderColor: "#F97316",
      backgroundColor: "rgba(249, 115, 22, 0.1)",
      tension: 0.4,
      borderDash: [5, 5],
    },
    {
      label: "Actual",
      data: [85000, 88000, 92000, 89000, 102000, 100000, 108000, 120000, 118000, 0, 0, 0],
      borderColor: "#2563EB",
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      tension: 0.4,
    },
  ],
};

const teamPerformanceData = {
  labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  datasets: [
    {
      label: "Revenue Generated",
      data: [120000, 98000, 85000, 72000, 65000],
      backgroundColor: ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"],
      borderColor: ["#F97316", "#FB923C", "#FDBA74", "#FED7AA", "#FFEDD5"],
      borderWidth: 1,
    },
  ],
};

// Mock team member data
const teamMembers = [
  { id: 1, name: "John Smith", position: "Sales Lead", target: 25000, reached: 21500, leads: 42 },
  { id: 2, name: "Emma Davis", position: "Sales Rep", target: 20000, reached: 18200, leads: 36 },
  { id: 3, name: "Michael Brown", position: "Sales Rep", target: 20000, reached: 16500, leads: 33 },
  { id: 4, name: "Sarah Wilson", position: "Sales Rep", target: 20000, reached: 15000, leads: 30 },
  { id: 5, name: "Robert Miller", position: "Sales Lead", target: 25000, reached: 18000, leads: 35 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <TabsContent value="monthly" className="m-0 col-span-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TargetCard data={targetData.monthly} />
            </div>
          </TabsContent>
          <TabsContent value="quarterly" className="m-0 col-span-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TargetCard data={targetData.quarterly} />
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="m-0 col-span-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TargetCard data={targetData.yearly} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>
              Comparison of target vs. actual sales performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformanceData.labels.map((month, index) => ({
                month,
                target: monthlyPerformanceData.datasets[0].data[index],
                actual: monthlyPerformanceData.datasets[1].data[index]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#F97316" 
                  strokeDasharray="5 5" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563EB" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>
              Revenue generated by team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={teamPerformanceData.labels.map((team, index) => ({
                    name: team,
                    value: teamPerformanceData.datasets[0].data[index]
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {teamPerformanceData.labels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={teamPerformanceData.datasets[0].backgroundColor[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Individual performance and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="grid grid-cols-12 gap-4 p-4 border rounded-lg items-center">
                <div className="col-span-3">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.position}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-sm text-gray-500">Target</div>
                  <div className="font-medium">{formatCurrency(member.target)}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-sm text-gray-500">Reached</div>
                  <div className="font-medium">{formatCurrency(member.reached)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Leads</div>
                  <div className="font-medium">{member.leads}</div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button variant="ghost" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TargetCard({ data }: { data: typeof targetData.monthly }) {
  const progressPercentage = Math.round((data.reached / data.target) * 100);
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Target</CardTitle>
          <Target className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.target)}</div>
          <p className="text-xs text-gray-500">Total target amount</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Reached</CardTitle>
          <Award className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.reached)}</div>
          <div className="mt-1">
            <Progress value={progressPercentage} className="h-1" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{progressPercentage}% of target</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <DollarSign className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(data.pending)}</div>
          <p className="text-xs text-gray-500">Remaining to reach target</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Estimated Time</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.estimatedDays} days</div>
          <p className="text-xs text-gray-500">To achieve target</p>
        </CardContent>
      </Card>
    </>
  );
}
