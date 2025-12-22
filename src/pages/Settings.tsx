import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save, Loader2, Lock, Eye, EyeOff, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  full_name: string;
  username: string;
}

const Settings = () => {
  // Profile Update State
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Password Change State
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found", handled by null profile
      
      if (data) {
        setCurrentProfile(data);
        setFullName(data.full_name);
        setUsername(data.username);
      } else {
        toast.warning("Profile not found", { description: "Your profile data could not be loaded. Please ensure you have completed signup."});
      }

    } catch (error: any) {
      toast.error("Failed to load profile", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSubmittingProfile(true);
    try {
      if (username.length < 3) {
        toast.error("Validation Error", { description: "Username must be at least 3 characters long." });
        return;
      }
      const { error } = await supabase.rpc('update_profile', {
        full_name_arg: fullName,
        username_arg: username,
      });

      if (error) throw error;
      
      toast.success("Profile updated!", { description: "Your profile has been saved successfully." });
      fetchProfile(); 

    } catch (error: any) {
      let errorMessage = error.message;
      if (error.message && error.message.includes('is already taken')) {
        errorMessage = `Username "${username}" is already taken. Please choose another.`;
      }
      toast.error("Failed to update profile", { description: errorMessage });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: newPassword.length >= 8 },
    { text: "Contains a number", met: /\d/.test(newPassword) },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
  ];
  
  const allPasswordReqsMet = passwordRequirements.every(req => req.met);

  const handleChangePassword = async () => {
    setIsSubmittingPassword(true);
    try {
      if (!allPasswordReqsMet) {
        toast.error("Password is not strong enough", { description: "Please meet all the password requirements." });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        toast.error("Passwords do not match", { description: "Please ensure the new password and confirmation match." });
        return;
      }
      if (newPassword === currentProfile?.username || newPassword === currentProfile?.full_name) {
        toast.error("Weak Password", { description: "Password cannot be your username or full name." });
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast.success("Password Updated!", { description: "Your password has been changed successfully. You will remain logged in." });
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (error: any) {
      toast.error("Failed to update password", { description: error.message });
    } finally {
      setIsSubmittingPassword(false);
    }
  };


  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <DashboardHeader 
            title="Settings" 
            subtitle="Manage your account preferences"
          />

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar - Placeholder for now */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-display font-bold text-2xl">
                      {loading ? '...' : (fullName ? fullName.charAt(0) : (username ? username.charAt(0) : 'U')).toUpperCase()}
                    </span>
                  </div>
                  {/* <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button> */}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isSubmittingProfile}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSubmittingProfile}
                      />
                    )}
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  onClick={handleSaveProfile}
                  disabled={isSubmittingProfile || loading}
                >
                  {isSubmittingProfile ? (
                    <Loader2 className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Password Change Settings */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isSubmittingPassword}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                   {newPassword && (
                    <div className="space-y-1 mt-2">
                      {passwordRequirements.map((req) => (
                        <div key={req.text} className="flex items-center gap-2 text-xs">
                          <Check className={`w-3 h-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={isSubmittingPassword}
                  />
                </div>

                <Button 
                  variant="hero" 
                  onClick={handleChangePassword}
                  disabled={isSubmittingPassword || loading || !newPassword || !confirmNewPassword}
                >
                  {isSubmittingPassword ? (
                    <Loader2 className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
