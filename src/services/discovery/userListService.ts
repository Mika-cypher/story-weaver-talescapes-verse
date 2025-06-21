
import { supabase } from "@/integrations/supabase/client";
import { UserList } from "./types";

export const userListService = {
  async getUserList(userId: string, contentType: string): Promise<UserList[]> {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as UserList[];
  },

  async addToList(listItem: Omit<UserList, 'id' | 'created_at'>): Promise<UserList> {
    const { data, error } = await supabase
      .from('user_lists')
      .upsert(listItem)
      .select()
      .single();

    if (error) throw error;
    return data as UserList;
  },

  async removeFromList(userId: string, contentId: string, contentType: string): Promise<void> {
    const { error } = await supabase
      .from('user_lists')
      .delete()
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType);

    if (error) throw error;
  },

  async getUserListStatus(userId: string, contentId: string, contentType: string): Promise<UserList | null> {
    const { data, error } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .maybeSingle();

    if (error) throw error;
    return data as UserList | null;
  }
};
