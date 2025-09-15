'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWakeUp } from '../hooks/useWakeUp';

interface WakeUpContextType {
  isBackendAlive: boolean | null;
  isWakingUp: boolean;
  manualWakeUp: () => Promise<boolean>;
  checkHealth: () => Promise<boolean>;
  backendUrl: string;
}

const WakeUpContext = createContext<WakeUpContextType | undefined>(undefined);

export function useWakeUpContext() {
  const context = useContext(WakeUpContext);
  if (context === undefined) {
    throw new Error('useWakeUpContext must be used within a WakeUpProvider');
  }
  return context;
}

interface WakeUpProviderProps {
  children: React.ReactNode;
}

export default function WakeUpProvider({ children }: WakeUpProviderProps) {
  const wakeUpData = useWakeUp();

  return (
    <WakeUpContext.Provider value={wakeUpData}>
      {children}
    </WakeUpContext.Provider>
  );
}
