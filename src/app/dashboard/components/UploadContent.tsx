'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Download,
  Eye,
  Trash2,
  BarChart3,
  Brain,
  Shield,
  RefreshCw
} from 'lucide-react';
import { FraudPrediction, TransactionData } from '../../services/fraudDetectionService';
import { backendService } from '../../services/backendService';
import { useSessionData } from '../../hooks/useSessionData';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface UploadContentProps {
  onNavigateToAI?: () => void;
}

export default function UploadContent({ onNavigateToAI }: UploadContentProps = {}) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ totalRecords: number; fraudCount: number; processingTime: number } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Get session data hook
  const { updateWithRealData, sessionInfo } = useSessionData();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload progress
    newFiles.forEach(fileObj => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { ...f, progress: Math.min(f.progress + Math.random() * 30, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileObj.id 
              ? { 
                  ...f, 
                  status: Math.random() > 0.1 ? 'success' : 'error',
                  progress: 100,
                  error: Math.random() > 0.1 ? undefined : 'File format not supported'
                }
              : f
          )
        );
        setIsUploading(false);
      }, 2000 + Math.random() * 3000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };


  const processFilesForFraudDetection = async () => {
    setIsProcessing(true);
    
    try {
      // Process the first uploaded file
      const fileToProcess = uploadedFiles.find(f => f.status === 'success');
      
      if (!fileToProcess) {
        throw new Error('No files uploaded. Please upload a CSV file first.');
      }

      // Use backend service to process the file
      const result = await backendService.uploadAndAnalyze(fileToProcess.file);
      
      if (result.success && result.data) {
        // Update session with real data
        updateWithRealData({
          predictions: result.data.predictions,
          modelMetrics: result.data.model_metrics,
          processingTime: result.data.processing_time,
          totalRecords: result.data.total_records,
          fraudCount: result.data.fraud_count
        });
        
        // Show success modal
        setResultInfo({
          totalRecords: result.data.total_records,
          fraudCount: result.data.fraud_count,
          processingTime: result.data.processing_time
        });
        setShowResultModal(true);
      } else {
        throw new Error(result.error || 'Backend processing failed');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSample = () => {
    // Create a sample CSV with the correct headers based on TransactionData interface
    const headers = [
      'customer_age', 'income', 'name_email_similarity',
      'prev_address_months_count', 'current_address_months_count',
      'days_since_request', 'intended_balcon_amount', 'proposed_credit_limit',
      'payment_type', 'bank_months_count', 'has_other_cards', 'foreign_request',
      'velocity_6h', 'velocity_24h', 'velocity_4w',
      'zip_count_4w', 'bank_branch_count_8w', 'date_of_birth_distinct_emails_4w',
      'credit_risk_score', 'employment_status', 'housing_status',
      'email_is_free', 'phone_home_valid', 'phone_mobile_valid',
      'source', 'session_length_in_minutes', 'device_os', 'keep_alive_session',
      'device_distinct_emails_8w', 'device_fraud_count', 'month'
    ];
    
    const csvContent = headers.join(',') + '\n';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_fraud_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'json':
        return <FileText className="w-8 h-8 text-yellow-600" />;
      default:
        return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Upload Section */}
      <div className="md:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Transaction Data</h2>
              <p className="text-gray-600">
                Upload your transaction data in CSV, Excel, or JSON format for fraud analysis
              </p>
              {sessionInfo?.dataSource === 'real' && (
                <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Dashboard showing real upload data</span>
                </div>
              )}
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 md:p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={{ scale: isDragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  or click to select files
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">CSV</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">Excel</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">JSON</span>
                </div>
              </motion.div>
            </div>

            {/* File Requirements */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-3">File Requirements</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Maximum file size: 100MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Supported formats: CSV, Excel (.xlsx, .xls), JSON</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Required columns: transaction_id, amount, timestamp, user_id</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Data should be in chronological order</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Uploaded Files */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                <div className="space-y-4">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {getFileIcon(file.file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {file.status === 'uploading' && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-blue-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(file.progress)}% uploaded
                            </p>
                          </div>
                        )}
                        {file.error && (
                          <p className="text-xs text-red-600 mt-1">{file.error}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={processFilesForFraudDetection}
              disabled={uploadedFiles.length === 0 || isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isProcessing ? 'Processing...' : 'Run Fraud Detection'}
              </span>
            </button>
            <button 
              onClick={downloadSample}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Download Sample</span>
            </button>
            <button 
              onClick={onNavigateToAI}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">View AI Analysis</span>
            </button>
            <button 
              onClick={() => {
                setUploadedFiles([]);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">Clear All Files</span>
            </button>
          </div>
        </motion.div>

        {/* Upload Statistics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Files</span>
              <span className="text-lg font-semibold text-gray-900">{uploadedFiles.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Successful</span>
              <span className="text-lg font-semibold text-green-600">
                {uploadedFiles.filter(f => f.status === 'success').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Failed</span>
              <span className="text-lg font-semibold text-red-600">
                {uploadedFiles.filter(f => f.status === 'error').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Processing</span>
              <span className="text-lg font-semibold text-blue-600">
                {uploadedFiles.filter(f => f.status === 'uploading').length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
      {showResultModal && resultInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowResultModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fraud Detection Complete</h3>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setShowResultModal(false)} aria-label="Close">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Records</span>
                <span className="font-medium text-gray-900">{resultInfo.totalRecords}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fraud Count</span>
                <span className="font-medium text-red-600">{resultInfo.fraudCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Processing Time</span>
                <span className="font-medium text-gray-900">{resultInfo.processingTime}s</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowResultModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {onNavigateToAI && (
                <button
                  onClick={() => { setShowResultModal(false); onNavigateToAI(); }}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  View AI Analysis
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowErrorModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Processing Error</h3>
              <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setShowErrorModal(false)} aria-label="Close">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-700">{errorMessage || 'An unexpected error occurred while processing the file.'}</p>
            <div className="mt-6">
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
