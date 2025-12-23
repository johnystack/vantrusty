import { useState, useEffect } from "react";
import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const DashboardHeader = ({ title, subtitle, action }: DashboardHeaderProps) => {
  const [profile, setProfile] = useState<{ full_name: string; username: string } | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', authUser.id)
          .single();

        // Gracefully handle the case where a profile doesn't exist (PGRST116)
        // This can happen for users created before the profile trigger was active.
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error.message);
        } else if (data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed", { description: error.message });
    } else {
      navigate('/login');
      toast.success("You have been logged out.");
    }
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {action}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
            3
          </span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-foreground">
                  {profile?.full_name || user?.email || 'User'}
                </div>
                <div className="text-xs text-muted-foreground">
                  @{profile?.username || '...'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;