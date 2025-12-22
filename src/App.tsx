import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import InvestNow from "./pages/InvestNow";

import Withdraw from "./pages/Withdraw";
import Referrals from "./pages/Referrals";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import Settings from "./pages/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInvestmentManagement from "./pages/admin/AdminInvestmentManagement";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminCrypto from "./pages/admin/AdminCrypto";
import AdminKYC from "./pages/admin/AdminKYC";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();



interface UserProfile {
  id: string;
  role: string;
}

import { Loader2 } from "lucide-react"; // Import Loader2

const ProtectedRoute = ({ session, userRole, allowedRoles, children }: { session: Session | null, userRole: string | null, allowedRoles: string[], children: React.ReactNode }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />; // Redirect non-admin users from admin routes
  }
  return <>{children}</>;
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setUserRole(null);
        } else if (profileData) {
          setUserRole(profileData.role);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Re-fetch profile if session changes
      if (session) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data: profileData, error }) => {
            if (error) {
              console.error("Error fetching user profile on auth change:", error);
              setUserRole(null);
            } else if (profileData) {
              setUserRole(profileData.role);
            }
          });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Wait until session and role are loaded
  if (loading || (session && userRole === null)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" />} />

            {/* Protected Dashboard Routes */}
            <Route
              element={
                <ProtectedRoute session={session} userRole={userRole} allowedRoles={['user', 'admin']}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/wallet" element={<Wallet />} />
              <Route path="/dashboard/investments" element={<InvestNow />} />
              <Route path="/dashboard/withdraw" element={<Withdraw />} />
              <Route path="/dashboard/referrals" element={<Referrals />} />
              <Route path="/dashboard/support" element={<Support />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              element={
                <ProtectedRoute session={session} userRole={userRole} allowedRoles={['admin']}>
                  <Outlet />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/investments" element={<AdminInvestmentManagement />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/crypto" element={<AdminCrypto />} />
              <Route path="/admin/kyc" element={<AdminKYC />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

