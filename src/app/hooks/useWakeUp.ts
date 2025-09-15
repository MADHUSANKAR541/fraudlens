'use client';

import { useEffect, useState } from 'react';
import { wakeUpService } from '../services/wakeUpService';

export function useWakeUp() {
  const [isBackendAlive, setIsBackendAlive] = useState<boolean | null>(null);
  const [isWakingUp, setIsWakingUp] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeWakeUp = async () => {
      try {
        setIsWakingUp(true);
        
        // Initialize the wake-up service
        await wakeUpService.initialize();
        
        if (mounted) {
          setIsBackendAlive(true);
          setIsWakingUp(false);
        }
      } catch (error) {
        console.error('Failed to initialize wake-up service:', error);
        if (mounted) {
          setIsBackendAlive(false);
          setIsWakingUp(false);
        }
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      initializeWakeUp();
    }

    // Cleanup function
    return () => {
      mounted = false;
      wakeUpService.stopPeriodicWakeUp();
    };
  }, []);

  const manualWakeUp = async (): Promise<boolean> => {
    setIsWakingUp(true);
    try {
      const success = await wakeUpService.wakeUpBackend();
      setIsBackendAlive(success);
      return success;
    } catch (error) {
      console.error('Manual wake-up failed:', error);
      setIsBackendAlive(false);
      return false;
    } finally {
      setIsWakingUp(false);
    }
  };

  const checkHealth = async (): Promise<boolean> => {
    try {
      const isHealthy = await wakeUpService.checkBackendHealth();
      setIsBackendAlive(isHealthy);
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      setIsBackendAlive(false);
      return false;
    }
  };

  return {
    isBackendAlive,
    isWakingUp,
    manualWakeUp,
    checkHealth,
    backendUrl: wakeUpService.getBackendUrl(),
  };
}
