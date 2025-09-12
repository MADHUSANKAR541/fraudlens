'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Search, 
  Filter, 
  Download, 
  Eye,
  ArrowLeft,
  BarChart3,
  Clock,
  DollarSign,
  User,
  MapPin,
  Smartphone,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';

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

const FraudDetectionPage: React.FC = () => {
  const [results, setResults] = useState<FraudResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<FraudResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockResults: FraudResult[] = [];
      const merchants = ['Amazon', 'Apple Store', 'Starbucks', 'Uber', 'Netflix', 'Spotify'];
      const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
      
      for (let i = 0; i < 50; i++) {
        const fraudProbability = Math.random();
        const riskScore = fraudProbability * 100;
        let riskLevel: 'low' | 'medium' | 'high';
        
        if (riskScore < 30) riskLevel = 'low';
        else if (riskScore < 70) riskLevel = 'medium';
        else riskLevel = 'high';
        
        mockResults.push({
          id: `fraud-${i + 1}`,
          transactionId: `TXN-${String(i + 1).padStart(6, '0')}`,
          amount: Math.random() * 10000 + 10,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          userId: `USER-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
          merchantId: merchants[Math.floor(Math.random() * merchants.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          deviceId: `DEV-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          fraudProbability,
          riskScore,
          riskLevel,
          status: Math.random() > 0.7 ? 'pending' : Math.random() > 0.5 ? 'approved' : 'blocked',
          features: {
            amount: Math.random(),
            timeOfDay: Math.random(),
            locationRisk: Math.random(),
            deviceTrust: Math.random(),
            userBehavior: Math.random()
          }
        });
      }
      
      return mockResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    // Simulate loading
    setTimeout(() => {
      setResults(generateMockData());
      setIsLoading(false);
    }, 2000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = results;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Risk level filter
    if (selectedRisk !== 'all') {
      filtered = filtered.filter(result => result.riskLevel === selectedRisk);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(result => result.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
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
    // Implement bulk actions here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Fraud Detection Results</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

        {/* Filters and Search */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
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

              {/* Risk Level Filter */}
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

              {/* Status Filter */}
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
              {/* Sort */}
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

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
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

        {/* Results Table */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
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
      </main>
    </div>
  );
};

export default FraudDetectionPage;
