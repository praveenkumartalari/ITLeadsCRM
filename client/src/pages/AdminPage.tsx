
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Users, Target, Settings } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard">
              <Target className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
        
        <TabsContent value="dashboard" className="m-0">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="team" className="m-0">
          <div className="rounded-md border shadow-sm p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Team Management Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              Detailed team management functionality will be available in the next update. Stay tuned!
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="m-0">
          <div className="rounded-md border shadow-sm p-8 text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Admin Settings Coming Soon</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              Advanced administrative settings will be available in the next update. Stay tuned!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
