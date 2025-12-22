import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface Cryptocurrency {
  id: number;
  name: string;
  wallet: string;
  enabled: boolean;
  network: string;
}

const AdminCrypto = () => {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [editingCrypto, setEditingCrypto] = useState<Cryptocurrency | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('cryptocurrencies').select('*').order('id');
      if (error) throw error;
      setCryptos(data || []);
    } catch (error: any) {
      toast({ title: "Error fetching data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (wallet: string, id: number) => {
    navigator.clipboard.writeText(wallet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('cryptocurrencies').update({ enabled: !currentStatus }).eq('id', id);
      if (error) throw error;
      toast({ title: "Updated", description: "Cryptocurrency status updated." });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const dataToSave = {
      name: formData.get("name") as string,
      wallet: formData.get("wallet") as string,
      network: formData.get("network") as string,
    };

    try {
      const { error } = await supabase.from('cryptocurrencies').upsert(
        isAddingNew
          ? dataToSave
          : { id: editingCrypto?.id, ...dataToSave }
      );

      if (error) throw error;
      toast({ title: "Saved", description: "Cryptocurrency settings saved successfully." });
      setEditingCrypto(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error saving data", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('cryptocurrencies').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Cryptocurrency removed.", variant: "destructive" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error deleting data", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            title="Cryptocurrency Management"
            subtitle="Manage supported cryptocurrencies and wallet addresses"
          />

          <div className="flex justify-end mb-6">
            <Button variant="hero" onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Cryptocurrency
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="glass"><CardContent className="p-6"><Loader2 className="w-8 h-8 animate-spin" /></CardContent></Card>
              <Card variant="glass"><CardContent className="p-6"><Loader2 className="w-8 h-8 animate-spin" /></CardContent></Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {cryptos.map((crypto) => (
                <Card key={crypto.id} variant="glass" className={!crypto.enabled ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">{crypto.name.charAt(0)}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{crypto.name}</CardTitle>
                          <span className="text-sm text-muted-foreground">{crypto.network}</span>
                        </div>
                      </div>
                      <Switch checked={crypto.enabled} onCheckedChange={() => handleToggle(crypto.id, crypto.enabled)} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Wallet Address</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-secondary/50 px-2 py-1 rounded flex-1 truncate">{crypto.wallet}</code>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(crypto.wallet, crypto.id)}>
                          {copiedId === crypto.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingCrypto(crypto)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(crypto.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={!!editingCrypto || isAddingNew} onOpenChange={() => { setEditingCrypto(null); setIsAddingNew(false); }}>
            <DialogContent className="glass-strong border-border">
              <DialogHeader>
                <DialogTitle>{isAddingNew ? "Add Cryptocurrency" : `Edit ${editingCrypto?.name}`}</DialogTitle>
                <DialogDescription>Configure cryptocurrency settings</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input name="name" defaultValue={editingCrypto?.name || ""} placeholder="Bitcoin" />
                </div>
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Input name="network" defaultValue={editingCrypto?.network || ""} placeholder="e.g., BTC, ERC20, TRC20" />
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address</Label>
                  <Input name="wallet" defaultValue={editingCrypto?.wallet || ""} placeholder="Enter wallet address" />
                </div>
                <Button type="submit" variant="hero" className="w-full">
                  {isAddingNew ? "Add Cryptocurrency" : "Save Changes"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default AdminCrypto;
