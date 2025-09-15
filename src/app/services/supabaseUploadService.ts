import supabase from '../../lib/supabaseClient';
import { TransactionData } from './fraudDetectionService';

export interface StoredTransaction extends TransactionData {
  id?: string;
  user_id?: string | null;
  created_at?: string;
}

const TABLE = 'transactions';

export const supabaseUploadService = {
  async replaceAll(userId: string | null, rows: StoredTransaction[]) {
    if (!supabase) throw new Error('Supabase client not initialized');
    if (!rows.length) return { success: true } as const;

    if (userId) {
      await supabase.from(TABLE).delete().eq('user_id', userId);
    } else {
      await supabase.from(TABLE).delete().is('user_id', null);
    }

    const { error } = await supabase.from(TABLE).insert(
      rows.map(r => ({ ...r, user_id: userId }))
    );
    if (error) throw error;
    return { success: true } as const;
  },

  async upsert(userId: string | null, rows: StoredTransaction[]) {
    if (!supabase) throw new Error('Supabase client not initialized');
    if (!rows.length) return { success: true } as const;

    const { error } = await supabase.from(TABLE).upsert(
      rows.map(r => ({ ...r, user_id: userId }))
    );
    if (error) throw error;
    return { success: true } as const;
  },

  async subscribe(userId: string | null, onChange: () => void) {
    const channel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLE,
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        () => onChange()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  async fetchAll(userId: string | null) {
    const query = supabase.from(TABLE).select('*');
    const { data, error } = userId
      ? await query.eq('user_id', userId)
      : await query.is('user_id', null);
    if (error) throw error;
    return data as StoredTransaction[];
  },

  async deleteById(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw error;
    return { success: true } as const;
  }
};

export default supabaseUploadService;


