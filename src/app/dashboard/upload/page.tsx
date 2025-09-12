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
  ArrowLeft,
  Shield,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

const UploadPage: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
                <h1 className="text-2xl font-bold text-gray-900">Data Upload</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Transaction Data</h2>
                  <p className="text-gray-600">
                    Upload your transaction data in CSV, Excel, or JSON format for fraud analysis
                  </p>
                </div>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
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
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                    </h3>
                    <p className="text-gray-600 mb-4">
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
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
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
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Download Template</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">View Sample Data</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Clear All Files</span>
                </button>
              </div>
            </motion.div>

            {/* Upload Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
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

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border border-blue-200 p-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Upload your transaction data files</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Review data quality and schema validation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Run fraud detection analysis</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Review results and insights</span>
                </div>
              </div>
              <Link
                href="/dashboard/detect"
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Analysis
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
