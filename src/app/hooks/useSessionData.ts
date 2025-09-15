'use client';

import { useState, useEffect, useCallback } from 'react';
import { sessionService, SessionData } from '../services/sessionService';
import { FraudPrediction, TransactionData } from '../services/fraudDetectionService';

export interface DashboardData {
  predictions: Array<FraudPrediction & { originalData: TransactionData }>;
  modelMetrics: {
    rocAuc: number;
    prAuc: number;
    f1Score: number;
    recall: number;
    precision: number;
    accuracy: number;
  };
  processingTime: number;
  totalRecords: number;
  fraudCount: number;
}

export interface SessionInfo {
  hasUploadedData: boolean;
  lastUpdated: string;
  dataSource: 'mock' | 'real';
  totalRecords: number;
  fraudCount: number;
}

export function useSessionData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        const currentData = sessionService.getCurrentData();
        const info = sessionService.getSessionInfo();
        
        setDashboardData(currentData);
        setSessionInfo(info);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load session data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update with real upload data
  const updateWithRealData = useCallback((realData: DashboardData) => {
    try {
      sessionService.updateWithRealData(realData);
      setDashboardData(realData);
      setSessionInfo(sessionService.getSessionInfo());
    } catch (error) {
      console.error('Failed to update with real data:', error);
    }
  }, []);

  // Reset to mock data
  const resetToMockData = useCallback(() => {
    try {
      sessionService.resetToMockData();
      const currentData = sessionService.getCurrentData();
      const info = sessionService.getSessionInfo();
      
      setDashboardData(currentData);
      setSessionInfo(info);
    } catch (error) {
      console.error('Failed to reset to mock data:', error);
    }
  }, []);

  // Refresh mock data
  const refreshMockData = useCallback(() => {
    try {
      sessionService.refreshMockData();
      const currentData = sessionService.getCurrentData();
      const info = sessionService.getSessionInfo();
      
      setDashboardData(currentData);
      setSessionInfo(info);
    } catch (error) {
      console.error('Failed to refresh mock data:', error);
    }
  }, []);

  // Clear all session data
  const clearSession = useCallback(() => {
    try {
      sessionService.clearSession();
      const currentData = sessionService.getCurrentData();
      const info = sessionService.getSessionInfo();
      
      setDashboardData(currentData);
      setSessionInfo(info);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }, []);

  // Check if showing real data
  const isShowingRealData = useCallback(() => {
    return sessionService.isShowingRealData();
  }, []);

  return {
    dashboardData,
    sessionInfo,
    isLoading,
    updateWithRealData,
    resetToMockData,
    refreshMockData,
    clearSession,
    isShowingRealData
  };
}
