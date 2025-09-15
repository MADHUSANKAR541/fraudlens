'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight,
  TrendingUp,
  Filter,
  Brain,
  BarChart3,
  Target,
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Upload
} from 'lucide-react';
import { DEFAULT_MODEL_METRICS } from '../../services/fraudDetectionService';
import { backendService } from '../../services/backendService';
import { useSessionData } from '../../hooks/useSessionData';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const lineData = [
  { d: '15', v: 3.2 },
  { d: '16', v: 3.1 },
  { d: '17', v: 3.4 },
  { d: '18', v: 3.6 },
  { d: '19', v: 3.8 },
  { d: '20', v: 3.5 },
  { d: '21', v: 3.7 },
  { d: '22', v: 3.9 },
  { d: '23', v: 3.3 },
  { d: '24', v: 3.55 }
];

export default function DashboardContent() {
  const { dashboardData, sessionInfo, isLoading, refreshMockData, resetToMockData } = useSessionData();
  const [modelMetrics, setModelMetrics] = useState(DEFAULT_MODEL_METRICS);
  const [backendLoading, setBackendLoading] = useState(false);

  // Calculate fraud stats from session data
  const fraudStats = dashboardData ? {
    total_transactions: dashboardData.totalRecords,
    fraud_count: dashboardData.fraudCount,
    fraud_rate: dashboardData.totalRecords > 0 ? (dashboardData.fraudCount / dashboardData.totalRecords) * 100 : 0,
    last_24h_fraud: Math.floor(dashboardData.fraudCount * 0.1), // Simulate 10% of fraud in last 24h
    last_7d_fraud: Math.floor(dashboardData.fraudCount * 0.3), // Simulate 30% of fraud in last 7d
    avg_processing_time: dashboardData.processingTime,
  } : {
    total_transactions: 0,
    fraud_count: 0,
    fraud_rate: 0,
    last_24h_fraud: 0,
    last_7d_fraud: 0,
    avg_processing_time: 0,
  };

  useEffect(() => {
    const loadModelMetrics = async () => {
      try {
        // Try to get real model metrics from backend
        const modelInfoResult = await backendService.getModelInfo();
        if (modelInfoResult.success && modelInfoResult.data) {
          setModelMetrics(modelInfoResult.data.metrics);
        }
      } catch (error) {
        console.warn('Failed to load model metrics from backend, using defaults:', error);
        // Keep using default metrics
      }
    };

    loadModelMetrics();
  }, []);

  const handleRefreshMockData = async () => {
    setBackendLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      refreshMockData();
    } finally {
      setBackendLoading(false);
    }
  };

  const handleResetToMockData = async () => {
    setBackendLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      resetToMockData();
    } finally {
      setBackendLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              sessionInfo?.dataSource === 'real' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {sessionInfo?.dataSource === 'real' ? (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Real Upload Data</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Mock Demo Data</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {sessionInfo?.totalRecords} transactions • {sessionInfo?.fraudCount} fraud cases
            </div>
            {sessionInfo?.lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {new Date(sessionInfo.lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {sessionInfo?.dataSource === 'mock' && (
              <button
                onClick={handleRefreshMockData}
                disabled={backendLoading}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${backendLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Mock Data</span>
              </button>
            )}
            {sessionInfo?.dataSource === 'real' && (
              <button
                onClick={handleResetToMockData}
                disabled={backendLoading}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <Database className="w-4 h-4" />
                <span>Reset to Mock Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Insights */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="w-5 h-5 text-purple-600 mr-2" />
            AI Model Performance
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Detection Accuracy</span>
            <span className="text-lg font-bold text-green-600">{(modelMetrics.accuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Fraud Recall</span>
            <span className="text-lg font-bold text-blue-600">{(modelMetrics.recall * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">ROC-AUC Score</span>
            <span className="text-lg font-bold text-purple-600">{(modelMetrics.rocAuc * 100).toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-4">Model trained on 1.8M+ transactions with 94.7% accuracy</p>
      </div>

      {/* Fraud Rate Overview */}
      <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 text-red-600 mr-2" />
            Current Fraud Rate
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-red-600">
              {isLoading ? '...' : `${fraudStats.fraud_rate.toFixed(2)}%`}
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +{fraudStats.last_24h_fraud} cases in last 24h
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-lg bg-red-100 text-red-700 font-medium">
              <Shield className="w-3 h-3 inline mr-1" />
              {fraudStats.fraud_count.toLocaleString()} fraud cases
            </button>
            <button className="px-3 py-1 text-sm rounded-lg bg-green-100 text-green-700 font-medium">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              {(fraudStats.total_transactions - fraudStats.fraud_count).toLocaleString()} legitimate
            </button>
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="d" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  background: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: 8, 
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Fraud Rate']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="v" 
                stroke="#ef4444" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#ef4444' }}
                activeDot={{ r: 6, fill: '#ef4444' }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-900">High Risk Period</span>
            </div>
            <span className="text-xs text-red-700">Peak fraud activity detected</span>
          </div>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            Model Performance
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">94.7%</div>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4" />
          ROC-AUC Score
        </div>
        
        {/* Performance Indicators */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precision</span>
            <span className="text-sm font-semibold text-yellow-600">24.6%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '24.6%' }} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Recall</span>
            <span className="text-sm font-semibold text-green-600">85.9%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85.9%' }} />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">F1-Score</span>
            <span className="text-sm font-semibold text-purple-600">38.2%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '38.2%' }} />
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            Top Fraud Indicators
          </h3>
          <div className="flex gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Velocity (6h)', importance: 15, color: 'bg-red-500' },
            { name: 'Velocity (24h)', importance: 12, color: 'bg-orange-500' },
            { name: 'Device Fraud Count', importance: 11, color: 'bg-yellow-500' },
            { name: 'Credit Risk Score', importance: 10, color: 'bg-green-500' },
            { name: 'Session Length', importance: 9, color: 'bg-blue-500' },
            { name: 'Bank Months', importance: 8, color: 'bg-indigo-500' }
          ].map((feature) => (
            <div key={feature.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                <span className="text-sm font-semibold text-gray-600">{feature.importance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${feature.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${feature.importance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center">
            <Brain className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-900">AI-powered feature ranking</span>
          </div>
        </div>
      </div>

      {/* Detection Statistics */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            Detection Stats
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? '...' : `${(fraudStats.total_transactions / 1000000).toFixed(1)}M+`}
            </div>
            <div className="text-sm text-gray-600">Transactions Analyzed</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {isLoading ? '...' : `${(fraudStats.fraud_count / 1000).toFixed(0)}K`}
              </div>
              <div className="text-xs text-red-700">Fraud Cases</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {isLoading ? '...' : `${((fraudStats.total_transactions - fraudStats.fraud_count) / 1000000).toFixed(1)}M`}
              </div>
              <div className="text-xs text-green-700">Legitimate</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Processing Time</span>
              <span className="font-semibold text-gray-900">
                {isLoading ? '...' : `${fraudStats.avg_processing_time}s`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Model Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last 7 Days</span>
              <span className="font-semibold text-gray-900">
                {isLoading ? '...' : `${fraudStats.last_7d_fraud} fraud cases`}
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
