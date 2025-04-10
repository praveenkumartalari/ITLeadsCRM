import { useQuery } from "@tanstack/react-query";
import StatsCard from "@/components/dashboard/stats-card";
import SalesFunnel from "@/components/dashboard/sales-funnel";
import MonthlyLeadsChart from "@/components/dashboard/monthly-leads-chart";
import RecentLeadsTable from "@/components/dashboard/recent-leads-table";
import TopPerformers from "@/components/dashboard/top-performers";
import UpcomingActivities from "@/components/dashboard/upcoming-activities";
import { 
  UserSearch, 
  Building2, 
  PieChart, 
  DollarSign 
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch dashboard stats
  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 60000 // Refresh every minute
  });
  
  // Fetch recent leads
  const { data: recentLeads, isLoading: isLoadingLeads } = useQuery({
    queryKey: ["/api/leads"],
  });
  
  // Fetch upcoming activities
  const { data: upcomingActivities, isLoading: isLoadingActivities } = useQuery({
    queryKey: [`/api/activities/upcoming/${user?.id}`, user?.id],
    enabled: !!user?.id
  });
  
  return (
    <>
      {/* Dashboard Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Leads"
          value={isLoadingStats ? "..." : dashboardStats?.totalLeads || 0}
          icon={<UserSearch className="text-xl" />}
          iconBgColor="bg-primary-100"
          iconColor="text-primary"
          trend={12}
          trendLabel="this month"
        />
        
        <StatsCard
          title="Active Clients"
          value={isLoadingStats ? "..." : dashboardStats?.activeClients || 0}
          icon={<Building2 className="text-xl" />}
          iconBgColor="bg-secondary-100"
          iconColor="text-secondary-600"
          trend={4}
          trendLabel="this month"
        />
        
        <StatsCard
          title="Conversion Rate"
          value={`${isLoadingStats ? "..." : dashboardStats?.conversionRate.toFixed(1) || 0}%`}
          icon={<PieChart className="text-xl" />}
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
          trend={-2}
          trendLabel="this month"
        />
        
        <StatsCard
          title="Deals Closed"
          value={isLoadingStats ? "..." : `$${(dashboardStats?.dealsClosed / 1000 || 0).toFixed(0)}K`}
          icon={<DollarSign className="text-xl" />}
          iconBgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          trend={18}
          trendLabel="this month"
        />
      </div>

      {/* Sales Funnel & Monthly Lead Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <SalesFunnel
          data={dashboardStats?.salesFunnel || []}
          conversionRate={dashboardStats?.conversionRate || 0}
          avgDealSize={24500}
          isLoading={isLoadingStats}
        />
        
        <div className="lg:col-span-2">
          <MonthlyLeadsChart
            data={dashboardStats?.monthlySummary || []}
            isLoading={isLoadingStats}
          />
        </div>
      </div>

      {/* Recent Leads & Top Performers + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeadsTable
            leads={recentLeads || []}
            isLoading={isLoadingLeads}
          />
        </div>
        
        <div className="space-y-6 lg:col-span-1">
          <TopPerformers
            performers={dashboardStats?.topPerformers || []}
            isLoading={isLoadingStats}
          />
          
          <UpcomingActivities
            activities={upcomingActivities || []}
            isLoading={isLoadingActivities}
          />
        </div>
      </div>
    </>
  );
}
