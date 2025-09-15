'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  BarChart3,
  RefreshCw,
  Eye,
  Download,
  Trash2,
  FileText
} from 'lucide-react';
import { FraudPrediction, TransactionData } from '../../services/fraudDetectionService';
import { backendService } from '../../services/backendService';
import { useSessionData } from '../../hooks/useSessionData';

export default function AIContent() {
  const [processedData, setProcessedData] = useState<(FraudPrediction & { originalData: TransactionData })[]>([]);
  const [explanationLoading, setExplanationLoading] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  
  const { dashboardData, sessionInfo } = useSessionData();

  useEffect(() => {
    if (dashboardData?.predictions && dashboardData.predictions.length > 0) {
      setProcessedData(dashboardData.predictions);
      setShowResults(true);
    }
  }, [dashboardData]);

  const generateExplanationForTransaction = async (index: number) => {
    const transaction = processedData[index];
    if (!transaction) return;

    
    console.log('🔍 Transaction data for index', index, ':', transaction);
    console.log('🔍 Original data:', transaction.originalData);

    setExplanationLoading(prev => new Set(prev).add(index));

    try {
      if (!backendService.isAvailable()) {
        console.log('🔄 Backend not available, attempting to reconnect...');
        const isHealthy = await backendService.checkHealth();
        if (!isHealthy) {
          throw new Error('Backend is not available. Please ensure the API is reachable at https://npn-kh8l.onrender.com');
        }
      }

      let transactionData = transaction.originalData;
      if (!transactionData || Object.keys(transactionData).length === 0) {
        console.log('⚠️ Original data is missing, generating mock data for explanation');
        transactionData = {
          customer_age: 35,
          income: 0.8,
          name_email_similarity: 0.5,
          prev_address_months_count: 12,
          current_address_months_count: 24,
          days_since_request: 0,
          intended_balcon_amount: 1000,
          proposed_credit_limit: 2000,
          payment_type: 'AA',
          bank_months_count: 12,
          has_other_cards: 1,
          foreign_request: 0,
          velocity_6h: transaction.topFeatures.find(f => f.feature === 'velocity_6h')?.value || 5000,
          velocity_24h: 10000,
          velocity_4w: 50000,
          zip_count_4w: 1,
          bank_branch_count_8w: 1,
          date_of_birth_distinct_emails_4w: 1,
          credit_risk_score: transaction.topFeatures.find(f => f.feature === 'credit_risk_score')?.value || 150,
          employment_status: 'CA',
          housing_status: 'BA',
          email_is_free: 0,
          phone_home_valid: 1,
          phone_mobile_valid: 1,
          source: 'INTERNET',
          session_length_in_minutes: transaction.topFeatures.find(f => f.feature === 'session_length_in_minutes')?.value || 5,
          device_os: 'windows',
          keep_alive_session: 1,
          device_distinct_emails_8w: 1,
          device_fraud_count: transaction.topFeatures.find(f => f.feature === 'device_fraud_count')?.value || 0,
          month: 0,
          fraud_bool: transaction.isFraud ? 1 : 0
        };
        console.log('🔧 Generated mock transaction data:', transactionData);
      }

      console.log('🚀 Generating explanation for transaction:', index);
      
      const result = await backendService.generateExplanation(
        transactionData,
        {
          isFraud: transaction.isFraud,
          fraudProbability: transaction.fraudProbability,
          riskScore: transaction.riskScore,
          confidence: transaction.confidence,
          explanation: '', // Empty explanation initially
          topFeatures: transaction.topFeatures
        }
      );

      if (result.success && result.data) {
        console.log('✅ Explanation generated successfully');
        
        let cleanExplanation = result.data.explanation;
        
        cleanExplanation = cleanExplanation
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
          .replace(/\*(.*?)\*/g, '$1')     // Remove *italic* formatting
          .replace(/`(.*?)`/g, '$1')       // Remove `code` formatting
          .replace(/#{1,6}\s*/g, '')       // Remove markdown headers
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
          .replace(/Transaction Risk Assessment: TXN-\d+\s*/g, '') // Remove TXN prefix
          .replace(/Transaction Risk Assessment:\s*/g, '') // Remove generic prefix
          .replace(/\n{3,}/g, '\n\n')      // Limit multiple newlines to double
          .replace(/(\d+\.\s)/g, '\n$1')  // Add line breaks before numbered points
          .replace(/([.!?])\s+([A-Z])/g, '$1\n\n$2') // Add breaks after sentences
          .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up excessive spacing
          .trim();
        
        console.log('🧹 Cleaned explanation:', cleanExplanation);
        
        setProcessedData(prev => prev.map((item, i) => 
          i === index 
            ? { ...item, explanation: cleanExplanation }
            : item
        ));
      } else {
        console.log('❌ Failed to generate explanation:', result.error);
        alert(`Failed to generate explanation: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error generating explanation:', error);
      alert(`Error generating explanation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExplanationLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const downloadResults = () => {
    if (processedData.length === 0) return;

    const csvHeaders = [
      'Customer ID',
      'Risk Score',
      'Prediction',
      'Confidence',
      'Fraud Probability',
      'Key Features',
      'AI Explanation'
    ];

    const csvRows = processedData.map((item, index) => [
      `USER_${String(index + 1).padStart(4, '0')}`,
      (item.riskScore * 100).toFixed(1) + '%',
      item.isFraud ? 'FRAUD' : 'LEGITIMATE',
      (item.confidence * 100).toFixed(1) + '%',
      (item.fraudProbability * 100).toFixed(1) + '%',
      item.topFeatures.slice(0, 3).map(f => f.feature).join(', '),
      item.explanation || 'Not generated'
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud_analysis_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearResults = () => {
    setProcessedData([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-4 md:space-y-8 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-8 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">AI Fraud Analysis</h1>
            <p className="text-purple-100 text-sm sm:text-base">Intelligent fraud detection with AI-powered explanations</p>
          </div>
        </div>
        
        {sessionInfo?.dataSource === 'real' && (
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>Analyzing real uploaded data</span>
          </div>
        )}
      </motion.div>

      {processedData.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Data Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload and process transaction data first to see AI-powered fraud analysis and explanations here.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>Go to</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">Upload</span>
            <span>page to get started</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {processedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                Fraud Detection Results
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Total Records:</span>
                <span className="font-semibold text-gray-900">{processedData.length}</span>
              </div>
            </div>
            
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Fraud Detected</p>
                    <p className="text-2xl font-bold text-red-600">
                      {processedData.filter(item => item.isFraud).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Legitimate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {processedData.filter(item => !item.isFraud).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Fraud Rate</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {((processedData.filter(item => item.isFraud).length / processedData.length) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4 md:mb-6">
              <button 
                onClick={() => setShowResults(!showResults)}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{showResults ? 'Hide Details' : 'Show Details'}</span>
              </button>
              <button 
                onClick={downloadResults}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Results</span>
              </button>
              <button 
                onClick={clearResults}
                className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Results</span>
              </button>
            </div>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Risk Score
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Prediction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key Features
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AI Explanation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processedData.slice(0, 10).map((item, index) => (
                          <tr key={index} className={item.isFraud ? 'bg-red-50' : 'bg-green-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              USER_{String(index + 1).padStart(4, '0')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      item.riskScore > 0.7 ? 'bg-red-500' : 
                                      item.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${item.riskScore * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-600">
                                  {(item.riskScore * 100).toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                item.isFraud 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {item.isFraud ? 'FRAUD' : 'LEGITIMATE'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {(item.confidence * 100).toFixed(1)}%
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs truncate">
                                {item.topFeatures.slice(0, 2).map(f => f.feature).join(', ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-sm">
                                {item.explanation ? (
                                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 shadow-sm">
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                        {item.explanation}
                                      </div>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                                      <Brain className="w-3 h-3" />
                                      <span>AI Generated</span>
                                    </div>
                                  </div>
                                ) : explanationLoading.has(index) ? (
                                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 shadow-sm">
                                    <div className="flex items-start space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                          </div>
                                          <span className="text-xs text-blue-600 font-medium">AI is thinking...</span>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                          </div>
                                          <div className="text-xs text-gray-500 italic">Analyzing transaction patterns and generating explanation...</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                                      <Brain className="w-3 h-3 animate-pulse" />
                                      <span>Generating AI Insight</span>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => generateExplanationForTransaction(index)}
                                    disabled={explanationLoading.has(index)}
                                    className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {explanationLoading.has(index) ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        <span>Generating...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Brain className="w-3 h-3" />
                                        <span>Get Reason</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="lg:hidden space-y-3">
                    {processedData.slice(0, 10).map((item, index) => (
                      <div key={index} className={`rounded-lg border p-4 ${item.isFraud ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              USER_{String(index + 1).padStart(4, '0')}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.isFraud 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {item.isFraud ? 'FRAUD' : 'LEGITIMATE'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {(item.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Risk Score</span>
                              <span>{(item.riskScore * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.riskScore > 0.7 ? 'bg-red-500' : 
                                  item.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${item.riskScore * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Key Features</div>
                            <div className="text-sm text-gray-900">
                              {item.topFeatures.slice(0, 2).map(f => f.feature).join(', ')}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-gray-600 mb-1">AI Explanation</div>
                            <div className="max-w-full">
                              {item.explanation ? (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 shadow-sm">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                                      {item.explanation}
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                                    <Brain className="w-3 h-3" />
                                    <span>AI Generated</span>
                                  </div>
                                </div>
                              ) : explanationLoading.has(index) ? (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200 shadow-sm">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <div className="flex space-x-1">
                                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                        </div>
                                        <span className="text-xs text-blue-600 font-medium">AI is thinking...</span>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <div className="text-xs text-gray-500 italic">Analyzing transaction patterns...</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-2 flex items-center space-x-1 text-xs text-blue-600">
                                    <Brain className="w-3 h-3 animate-pulse" />
                                    <span>Generating AI Insight</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => generateExplanationForTransaction(index)}
                                  disabled={explanationLoading.has(index)}
                                  className="w-full flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {explanationLoading.has(index) ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>Generating...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="w-3 h-3" />
                                      <span>Get Reason</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {processedData.length > 10 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">
                        Showing first 10 results of {processedData.length} total records
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {processedData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm"
        >
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center">
            <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mr-2" />
            AI Insights
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Model Performance</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Accuracy:</span>
                  <span className="font-medium">{dashboardData?.modelMetrics?.accuracy ? `${(dashboardData.modelMetrics.accuracy * 100).toFixed(1)}%` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <span className="font-medium">{dashboardData?.modelMetrics?.precision ? `${(dashboardData.modelMetrics.precision * 100).toFixed(1)}%` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recall:</span>
                  <span className="font-medium">{dashboardData?.modelMetrics?.recall ? `${(dashboardData.modelMetrics.recall * 100).toFixed(1)}%` : 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Processing Info</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Records:</span>
                  <span className="font-medium">{dashboardData?.totalRecords || processedData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Time:</span>
                  <span className="font-medium">{dashboardData?.processingTime ? `${dashboardData.processingTime}s` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fraud Count:</span>
                  <span className="font-medium">{dashboardData?.fraudCount || processedData.filter(item => item.isFraud).length}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
