'use client';

import { useEffect } from 'react';
import { supabaseUploadService } from '../services/supabaseUploadService';
import { TransactionData } from '../services/fraudDetectionService';
import { backendService } from '../services/backendService';
import { useSessionData } from './useSessionData';

export function useSupabaseDashboardSync(userId: string | null) {
  const { updateWithRealData } = useSessionData();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const syncFromDb = async () => {
      try {
        const rows = await supabaseUploadService.fetchAll(userId);
        const transactions: TransactionData[] = rows as unknown as TransactionData[];
        if (!transactions.length) return;
        // Disabled backend batch analysis from dashboard
        return;
      } catch (e) {
        console.warn('Supabase sync failed', e);
      }
    };

    syncFromDb();

    supabaseUploadService.subscribe(userId, () => {
      syncFromDb();
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, updateWithRealData]);
}

export default useSupabaseDashboardSync;


