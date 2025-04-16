
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Lock, User, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="push-notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push Notifications
              </Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your security preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="2fa" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Two-Factor Authentication
              </Label>
              <Switch id="2fa" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="activity-log" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Activity Logging
              </Label>
              <Switch id="activity-log" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="h-12 w-12 rounded-full bg-secondary p-2" />
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">
                  Update your profile picture
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
