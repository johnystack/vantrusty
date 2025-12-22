import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Save, Shield, Bell, Globe, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const handleSave = (section: string) => {
    toast({ title: "Settings saved", description: `${section} settings have been updated.` });
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />
      
      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <DashboardHeader 
            title="Platform Settings" 
            subtitle="Configure platform-wide settings and preferences"
          />

          <div className="space-y-6">
            {/* General Settings */}
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic platform configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input defaultValue="VanTrusty" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input type="email" defaultValue="support@vantrusty.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Platform Description</Label>
                  <Textarea 
                    rows={3}
                    defaultValue="VanTrusty - Smart Digital Asset Investing. Your trusted partner for secure cryptocurrency investments."
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="hero" onClick={() => handleSave("General")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Platform security configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Require 2FA for Withdrawals</p>
                    <p className="text-sm text-muted-foreground">Users must verify with 2FA before withdrawing</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Require KYC for Large Withdrawals</p>
                    <p className="text-sm text-muted-foreground">Verify identity for withdrawals over $10,000</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Auto-lock Suspicious Accounts</p>
                    <p className="text-sm text-muted-foreground">Automatically suspend accounts with suspicious activity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <Button variant="hero" onClick={() => handleSave("Security")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure admin notifications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Get notified when new users sign up</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Withdrawal Requests</p>
                    <p className="text-sm text-muted-foreground">Get notified for pending withdrawals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">KYC Submissions</p>
                    <p className="text-sm text-muted-foreground">Alert when users submit KYC documents</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="hero" onClick={() => handleSave("Notification")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>SMTP and email configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input defaultValue="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input type="number" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input defaultValue="noreply@vantrusty.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input type="password" defaultValue="••••••••" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Use TLS</p>
                    <p className="text-sm text-muted-foreground">Enable TLS encryption for emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="hero" onClick={() => handleSave("Email")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
