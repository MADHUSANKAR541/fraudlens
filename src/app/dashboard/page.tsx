'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Activity,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const kpiData = [
    {
      title: 'Total Transactions',
      value: '2,847,392',
      change: '+12.5%',
      changeType: 'positive',
      icon: <Activity className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Fraud Detected',
      value: '1,247',
      change: '-8.2%',
      changeType: 'negative',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'False Positives',
      value: '89',
      change: '-15.3%',
      changeType: 'negative',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      title: 'Accuracy Rate',
      value: '99.7%',
      change: '+0.3%',
      changeType: 'positive',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    }
  ];

  const fraudTrendData = [
    { name: 'Jan', fraud: 120, transactions: 240000 },
    { name: 'Feb', fraud: 98, transactions: 260000 },
    { name: 'Mar', fraud: 156, transactions: 280000 },
    { name: 'Apr', fraud: 134, transactions: 300000 },
    { name: 'May', fraud: 189, transactions: 320000 },
    { name: 'Jun', fraud: 167, transactions: 340000 },
    { name: 'Jul', fraud: 145, transactions: 360000 },
    { name: 'Aug', fraud: 178, transactions: 380000 },
    { name: 'Sep', fraud: 201, transactions: 400000 },
    { name: 'Oct', fraud: 189, transactions: 420000 },
    { name: 'Nov', fraud: 156, transactions: 440000 },
    { name: 'Dec', fraud: 134, transactions: 460000 }
  ];

  const fraudTypeData = [
    { name: 'Credit Card Fraud', value: 45, color: '#FF6B6B' },
    { name: 'Identity Theft', value: 25, color: '#4ECDC4' },
    { name: 'Account Takeover', value: 15, color: '#45B7D1' },
    { name: 'Synthetic Identity', value: 10, color: '#96CEB4' },
    { name: 'Other', value: 5, color: '#FFEAA7' }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'high',
      message: 'Suspicious transaction detected: $2,500 withdrawal from account 1234',
      time: '2 minutes ago',
      amount: '$2,500'
    },
    {
      id: 2,
      type: 'medium',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      time: '15 minutes ago',
      amount: null
    },
    {
      id: 3,
      type: 'high',
      message: 'Unusual spending pattern detected: $15,000 in 1 hour',
      time: '1 hour ago',
      amount: '$15,000'
    },
    {
      id: 4,
      type: 'low',
      message: 'New device login from unknown location',
      time: '2 hours ago',
      amount: null
    }
  ];

  const sidebarItems = [
    { name: 'Dashboard', icon: <BarChart3 className="w-5 h-5" />, href: '/dashboard', active: true },
    { name: 'Upload Data', icon: <Download className="w-5 h-5" />, href: '/dashboard/upload' },
    { name: 'Fraud Detection', icon: <Shield className="w-5 h-5" />, href: '/dashboard/detect' },
    { name: 'Insights', icon: <PieChart className="w-5 h-5" />, href: '/dashboard/insights' },
    { name: 'Explainability', icon: <Eye className="w-5 h-5" />, href: '/dashboard/explain' },
    { name: 'What-If Analysis', icon: <LineChart className="w-5 h-5" />, href: '/dashboard/whatif' },
    { name: 'Alerts', icon: <Bell className="w-5 h-5" />, href: '/dashboard/alerts' },
    { name: 'About', icon: <Users className="w-5 h-5" />, href: '/dashboard/about' }
  ];

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Preparing your fraud detection insights...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FraudLens</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    item.active
                      ? 'bg-gradient-to-r from-blue-50 to-teal-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Analyst</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* KPI Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.color} text-white`}>
                    {kpi.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</h3>
                <p className="text-gray-600">{kpi.title}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Fraud Trend Chart */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Fraud Trend</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">7D</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">30D</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">90D</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={fraudTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fraud" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Fraud Types Pie Chart */}
            <motion.div 
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Fraud Types Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={fraudTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {fraudTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {fraudTypeData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Alerts */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    alert.type === 'high' ? 'bg-red-500' :
                    alert.type === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                  {alert.amount && (
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{alert.amount}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
