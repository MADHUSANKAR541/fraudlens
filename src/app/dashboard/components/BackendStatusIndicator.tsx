'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { useWakeUpContext } from '../../components/WakeUpProvider';

export default function BackendStatusIndicator() {
  const { isBackendAlive, isWakingUp, manualWakeUp, checkHealth, backendUrl } = useWakeUpContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = () => {
    if (isBackendAlive === null) return 'text-gray-500';
    if (isBackendAlive) return 'text-green-500';
    return 'text-red-500';
  };

  const getStatusIcon = () => {
    if (isWakingUp) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (isBackendAlive === null) return <Wifi className="w-4 h-4" />;
    if (isBackendAlive) return <CheckCircle className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isWakingUp) return 'Waking up backend...';
    if (isBackendAlive === null) return 'Checking backend...';
    if (isBackendAlive) return 'Backend online';
    return 'Backend offline';
  };

  const handleManualWakeUp = async () => {
    await manualWakeUp();
  };

  const handleHealthCheck = async () => {
    await checkHealth();
  };

  return (
    <>
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 ${getStatusColor()}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium hidden sm:inline">
            {getStatusText()}
          </span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed top-16 right-4 z-50 w-80 bg-white rounded-xl border border-gray-200 shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <h3 className="font-semibold text-gray-900">Backend Status</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Backend URL:</span>
                  <span className="text-sm font-mono text-gray-800 truncate max-w-48">
                    {backendUrl}
                  </span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleManualWakeUp}
                    disabled={isWakingUp}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isWakingUp ? 'animate-spin' : ''}`} />
                    <span>Wake Up</span>
                  </button>

                  <button
                    onClick={handleHealthCheck}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Check Health</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showDetails ? 'Hide' : 'Show'} details
                  </button>
                  
                  {showDetails && (
                    <motion.div
                      className="mt-2 p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>• Automatic wake-up every 5 minutes</div>
                        <div>• Pings /docs, /health, and / endpoints</div>
                        <div>• Prevents Render.com sleep mode</div>
                        <div>• 10-second timeout per request</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
