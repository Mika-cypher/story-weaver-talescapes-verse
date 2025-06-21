
import { supabase } from "@/integrations/supabase/client";

export interface Commission {
  id: string;
  client_id: string;
  artist_id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const commissionService = {
  // Create a new commission request
  async createCommission(commissionData: Omit<Commission, 'id' | 'created_at' | 'updated_at'>): Promise<Commission> {
    const { data, error } = await supabase
      .from('commissions')
      .insert(commissionData)
      .select()
      .single();
    
    if (error) throw error;
    return data as Commission;
  },

  // Get commissions for a user (as client or artist)
  async getUserCommissions(userId: string): Promise<Commission[]> {
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .or(`client_id.eq.${userId},artist_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Commission[];
  },

  // Update commission status
  async updateCommissionStatus(id: string, status: Commission['status']): Promise<Commission> {
    const { data, error } = await supabase
      .from('commissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Commission;
  },

  // Get commissions available for an artist
  async getAvailableCommissions(): Promise<Commission[]> {
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as Commission[];
  }
};
