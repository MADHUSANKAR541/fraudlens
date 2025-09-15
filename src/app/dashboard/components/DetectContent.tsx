'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Search, 
  Download, 
  Eye,
  Clock,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { FraudPrediction, TransactionData, DEFAULT_MODEL_METRICS } from '../../services/fraudDetectionService';
import { backendService } from '../../services/backendService';
import { supabaseUploadService } from '../../services/supabaseUploadService';

interface FraudResult {
  id: string;
  transactionId: string;
  amount: number;
  timestamp: string;
  userId: string;
  merchantId: string;
  location: string;
  deviceId: string;
  ipAddress: string;
  fraudProbability: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'blocked' | 'investigating';
  features: {
    amount: number;
    timeOfDay: number;
    locationRisk: number;
    deviceTrust: number;
    userBehavior: number;
  };
}

export default function DetectContent() {
  const [results, setResults] = useState<FraudResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<FraudResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mlPredictions, setMlPredictions] = useState<(FraudPrediction & { originalData: TransactionData })[]>([]);
  const [showModelMetrics, setShowModelMetrics] = useState(false);
  const [modelMetrics, setModelMetrics] = useState(DEFAULT_MODEL_METRICS);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadAndScore = async () => {
      try {
        setIsLoading(true);
        const modelInfoResult = await backendService.getModelInfo();
        if (modelInfoResult.success && modelInfoResult.data) {
          setModelMetrics(modelInfoResult.data.metrics);
        }

        const rows = await supabaseUploadService.fetchAll(null);
        const transactions = rows as unknown as TransactionData[];

        if (transactions.length === 0) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        const analyzed = await backendService.analyzeTransactions(transactions);
        if (analyzed.success && analyzed.data) {
          const preds = analyzed.data.predictions;
          const mapped: FraudResult[] = preds.map((p, idx) => {
            const t = p.originalData as TransactionData;
            const riskScore = Math.round((p.riskScore || p.fraudProbability || 0) * 100);
            const riskLevel: 'low' | 'medium' | 'high' = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
            return {
              id: `${idx}`,
              transactionId: `TX-${idx + 1}`,
              amount: Number(t?.proposed_credit_limit ?? t?.intended_balcon_amount ?? 0),
              timestamp: new Date().toISOString(),
              userId: 'N/A',
              merchantId: 'N/A',
              location: 'N/A',
              deviceId: 'N/A',
              ipAddress: 'N/A',
              fraudProbability: p.fraudProbability,
              riskScore,
              riskLevel,
              status: 'pending',
              features: {
                amount: Number(t?.proposed_credit_limit ?? 0),
                timeOfDay: 0,
                locationRisk: 0,
                deviceTrust: 0,
                userBehavior: 0
              }
            };
          });
          setResults(mapped);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Failed to load and score transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAndScore();

    supabaseUploadService.subscribe(null, () => {
      loadAndScore();
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    let filtered = results;

    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRisk !== 'all') {
      filtered = filtered.filter(result => result.riskLevel === selectedRisk);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(result => result.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'riskScore':
          aValue = a.riskScore;
          bValue = b.riskScore;
          break;
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        default:
          aValue = a.transactionId;
          bValue = b.transactionId;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredResults(filtered);
  }, [results, searchTerm, selectedRisk, selectedStatus, sortBy, sortOrder]);

  const getRiskBadge = (riskLevel: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    const icons = {
      high: <AlertTriangle className="w-3 h-3" />,
      medium: <Minus className="w-3 h-3" />,
      low: <CheckCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[riskLevel as keyof typeof styles]}`}>
        {icons[riskLevel as keyof typeof icons]}
        <span className="capitalize">{riskLevel}</span>
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredResults.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredResults.map(item => item.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Transactions</h2>
          <p className="text-gray-600">Running fraud detection algorithms...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Brain className="w-6 h-6 text-purple-600 mr-2" />
            AI Model Performance
          </h2>
          <button
            onClick={() => setShowModelMetrics(!showModelMetrics)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Eye className="w-4 h-4 mr-1" />
            {showModelMetrics ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">ROC-AUC</p>
                <p className="text-2xl font-bold text-blue-600">{(modelMetrics.rocAuc * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">Recall</p>
                <p className="text-2xl font-bold text-green-600">{(modelMetrics.recall * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center">
              <Target className="w-5 h-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Precision</p>
                <p className="text-2xl font-bold text-yellow-600">{(modelMetrics.precision * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center">
              <PieChart className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-purple-900">F1-Score</p>
                <p className="text-2xl font-bold text-purple-600">{(modelMetrics.f1Score * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {showModelMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Model Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ROC-AUC Score</span>
                    <span className="font-medium text-gray-900">{(modelMetrics.rocAuc * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PR-AUC Score</span>
                    <span className="font-medium text-gray-900">{(modelMetrics.prAuc * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <span className="font-medium text-gray-900">{(modelMetrics.accuracy * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Fraud Detection</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">True Positive Rate</span>
                    <span className="font-medium text-gray-900">{(modelMetrics.recall * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">False Positive Rate</span>
                    <span className="font-medium text-gray-900">{((1 - modelMetrics.precision) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">F1-Score</span>
                    <span className="font-medium text-gray-900">{(modelMetrics.f1Score * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Analyzed</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {results.filter(r => r.riskLevel === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {results.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-green-600">
                {results.filter(r => r.status === 'blocked').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="blocked">Blocked</option>
              <option value="investigating">Investigating</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="timestamp">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="riskScore">Sort by Risk Score</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sortOrder === 'asc' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {selectedItems.length > 0 && (
        <motion.div 
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-blue-800 font-medium">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('block')}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Block All
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredResults.length && filteredResults.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredResults.map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(result.id)}
                        onChange={() => handleSelectItem(result.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{result.transactionId}</p>
                        <p className="text-xs text-gray-500">Risk: {result.riskScore.toFixed(1)}%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {result.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRiskBadge(result.riskLevel)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(result.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{result.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{result.merchantId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(result.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-700 transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
