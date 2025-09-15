// Backend service that integrates with the FastAPI backend
import { TransactionData, FraudPrediction, ModelMetrics } from './fraudDetectionService';

// This service provides a bridge between the frontend and the FastAPI backend
// All data comes from real API calls to the backend

// Backend response format (snake_case)
interface BackendFraudPrediction {
  is_fraud: boolean;
  fraud_probability: number;
  risk_score: number;
  confidence: number;
  explanation: string;
  top_features: Array<{
    feature: string;
    importance: number;
    value: number;
  }>;
}

interface BackendResponse {
  predictions: BackendFraudPrediction[];
  model_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  processing_time: number;
  total_records: number;
  fraud_count: number;
}

export interface BackendFraudResponse {
  predictions: Array<FraudPrediction & { originalData: TransactionData }>;
  model_metrics: ModelMetrics;
  processing_time: number;
  total_records: number;
  fraud_count: number;
}

export interface BackendModelInfo {
  model_version: string;
  model_type: string;
  features: string[];
  metrics: ModelMetrics;
  last_updated: string;
}

class BackendService {
  private isBackendAvailable: boolean = false;
  private backendUrl: string;

  constructor() {
    // Check if we're in development mode and backend is available
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    this.checkBackendHealth();
  }

  // Transform backend response to frontend format
  private transformBackendResponse(backendResponse: BackendResponse, originalData?: TransactionData[]): BackendFraudResponse {
    const transformedPredictions = backendResponse.predictions.map((pred, index) => ({
      isFraud: pred.is_fraud,
      fraudProbability: pred.fraud_probability,
      riskScore: pred.risk_score,
      confidence: pred.confidence,
      explanation: pred.explanation,
      topFeatures: pred.top_features,
      originalData: originalData?.[index] || {} as TransactionData
    }));

    return {
      predictions: transformedPredictions,
      model_metrics: {
        rocAuc: backendResponse.model_metrics.roc_auc,
        prAuc: backendResponse.model_metrics.precision, // Using precision as proxy for PR-AUC
        f1Score: backendResponse.model_metrics.f1_score,
        recall: backendResponse.model_metrics.recall,
        precision: backendResponse.model_metrics.precision,
        accuracy: backendResponse.model_metrics.accuracy
      },
      processing_time: backendResponse.processing_time,
      total_records: backendResponse.total_records,
      fraud_count: backendResponse.fraud_count
    };
  }

  private async checkBackendHealth(): Promise<void> {
    try {
      console.log('Checking backend health at:', `${this.backendUrl}/health`);
      // Try to ping the FastAPI backend
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Backend health response:', response.status, response.statusText);
      
      if (response.ok) {
        this.isBackendAvailable = true;
        console.log('✅ Backend is available');
      } else {
        this.isBackendAvailable = false;
        console.log('❌ Backend health check failed');
      }
    } catch (error) {
      console.warn('Backend not available:', error);
      this.isBackendAvailable = false;
    }
  }

  // Call the real backend API for batch prediction
  private async callBackendPrediction(
    data: TransactionData[]
  ): Promise<BackendFraudResponse> {
    if (!this.isBackendAvailable) {
      throw new Error('Backend is not available');
    }

    const response = await fetch(`${this.backendUrl}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions: data,
        include_explanations: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
    }

    const backendResult: BackendResponse = await response.json();
    return this.transformBackendResponse(backendResult, data);
  }

  // Upload and analyze CSV file
  async uploadAndAnalyze(file: File): Promise<{
    success: boolean;
    data?: BackendFraudResponse;
    error?: string;
  }> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend is not available. Please ensure the FastAPI server is running.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.backendUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const uploadResult = await response.json();
      
      // The upload endpoint returns { filename, file_size, results: BackendResponse }
      if (uploadResult.results) {
        const transformedResult = this.transformBackendResponse(uploadResult.results);
        return {
          success: true,
          data: transformedResult,
        };
      } else {
        throw new Error('Invalid response format from upload endpoint');
      }
    } catch (error) {
      console.error('Error processing CSV file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process CSV file',
      };
    }
  }

  // Analyze transaction data
  async analyzeTransactions(data: TransactionData[]): Promise<{
    success: boolean;
    data?: BackendFraudResponse;
    error?: string;
  }> {
    try {
      const result = await this.callBackendPrediction(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error analyzing transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze transactions',
      };
    }
  }

  // Get model information
  async getModelInfo(): Promise<{
    success: boolean;
    data?: BackendModelInfo;
    error?: string;
  }> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend is not available. Please ensure the FastAPI server is running.');
      }

      const response = await fetch(`${this.backendUrl}/model/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error getting model info:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get model info',
      };
    }
  }

  // Get fraud statistics
  async getFraudStats(): Promise<{
    success: boolean;
    data?: {
      total_transactions: number;
      fraud_count: number;
      fraud_rate: number;
      last_24h_fraud: number;
      last_7d_fraud: number;
      avg_processing_time: number;
    };
    error?: string;
  }> {
    try {
      if (!this.isBackendAvailable) {
        throw new Error('Backend is not available. Please ensure the FastAPI server is running.');
      }

      const response = await fetch(`${this.backendUrl}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error getting fraud stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get fraud statistics',
      };
    }
  }

  // Check if backend is available
  isAvailable(): boolean {
    return this.isBackendAvailable;
  }

  // Manually trigger health check
  async checkHealth(): Promise<boolean> {
    await this.checkBackendHealth();
    return this.isBackendAvailable;
  }

  // Generate LLM explanation for a specific transaction
  async generateExplanation(transactionData: TransactionData, prediction: FraudPrediction): Promise<{
    success: boolean;
    data?: { explanation: string; processing_time: number };
    error?: string;
  }> {
    try {
      console.log('🔍 generateExplanation called');
      console.log('Backend available:', this.isBackendAvailable);
      console.log('Backend URL:', this.backendUrl);
      
      if (!this.isBackendAvailable) {
        console.log('❌ Backend not available, throwing error');
        throw new Error('Backend is not available. Please ensure the FastAPI server is running.');
      }

      // Transform prediction to backend format (snake_case)
      const backendPrediction = {
        is_fraud: prediction.isFraud,
        fraud_probability: prediction.fraudProbability,
        risk_score: prediction.riskScore,
        confidence: prediction.confidence,
        explanation: prediction.explanation || '',
        top_features: prediction.topFeatures
      };

      console.log('📤 Sending request to:', `${this.backendUrl}/explain`);
      console.log('Request payload:', { transaction_data: transactionData, prediction: backendPrediction });

      const response = await fetch(`${this.backendUrl}/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_data: transactionData,
          prediction: backendPrediction
        }),
      });

      console.log('📥 Response received:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        throw new Error(`Backend API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Success response:', result);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('❌ Error generating explanation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate explanation',
      };
    }
  }

  // Get backend URL
  getBackendUrl(): string {
    return this.backendUrl;
  }
}

// Export singleton instance
export const backendService = new BackendService();
export default backendService;
