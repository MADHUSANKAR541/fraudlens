import { TransactionData, FraudPrediction, ModelMetrics } from './fraudDetectionService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://npn-kh8l.onrender.com';

export interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FraudDetectionRequest {
  data: TransactionData[];
  model_version?: string;
  include_explanations?: boolean;
}

export interface FraudDetectionResponse {
  predictions: Array<{
    isFraud: boolean;
    fraudProbability: number;
    riskScore: number;
    confidence: number;
    explanation: string;
    topFeatures: Array<{
      feature: string;
      importance: number;
      value: number;
    }>;
  }>;
  model_metrics: ModelMetrics;
  processing_time: number;
  total_records: number;
  fraud_count: number;
}

export interface ModelInfoResponse {
  model_version: string;
  model_type: string;
  training_date: string;
  features: string[];
  metrics: ModelMetrics;
  last_updated: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BackendResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async uploadAndAnalyze(file: File): Promise<BackendResponse<FraudDetectionResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async analyzeTransactions(
    data: TransactionData[],
    includeExplanations: boolean = true
  ): Promise<BackendResponse<FraudDetectionResponse>> {
    return this.makeRequest<FraudDetectionResponse>('/analyze', {
      method: 'POST',
      body: JSON.stringify({
        data,
        include_explanations: includeExplanations,
      }),
    });
  }

  async getModelInfo(): Promise<BackendResponse<ModelInfoResponse>> {
    return this.makeRequest<ModelInfoResponse>('/model/info');
  }

  async getFraudStats(): Promise<BackendResponse<{
    total_transactions: number;
    fraud_count: number;
    fraud_rate: number;
    last_24h_fraud: number;
    last_7d_fraud: number;
    avg_processing_time: number;
  }>> {
    return this.makeRequest('/stats/fraud');
  }

  async getFeatureImportance(): Promise<BackendResponse<Array<{
    feature: string;
    importance: number;
    category: string;
  }>>> {
    return this.makeRequest('/model/features');
  }

  async healthCheck(): Promise<BackendResponse<{
    status: string;
    model_loaded: boolean;
    version: string;
    uptime: number;
  }>> {
    return this.makeRequest('/health');
  }

  async getFraudCases(
    page: number = 1,
    limit: number = 20,
    filters?: {
      risk_level?: 'low' | 'medium' | 'high';
      status?: 'pending' | 'approved' | 'blocked' | 'investigating';
      date_from?: string;
      date_to?: string;
    }
  ): Promise<BackendResponse<{
    cases: Array<{
      id: string;
      transaction_id: string;
      fraud_probability: number;
      risk_score: number;
      status: string;
      created_at: string;
      explanation: string;
      top_features: Array<{
        feature: string;
        importance: number;
        value: number;
      }>;
    }>;
    total: number;
    page: number;
    limit: number;
  }>> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return this.makeRequest(`/fraud-cases?${queryParams}`);
  }

  async updateFraudCaseStatus(
    caseId: string,
    status: 'pending' | 'approved' | 'blocked' | 'investigating'
  ): Promise<BackendResponse<{ success: boolean }>> {
    return this.makeRequest(`/fraud-cases/${caseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getModelPerformanceHistory(
    days: number = 30
  ): Promise<BackendResponse<Array<{
    date: string;
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  }>>> {
    return this.makeRequest(`/model/performance?days=${days}`);
  }

  async downloadReport(
    format: 'csv' | 'excel' | 'pdf' = 'csv',
    filters?: {
      date_from?: string;
      date_to?: string;
      risk_level?: string;
    }
  ): Promise<BackendResponse<{ download_url: string }>> {
    const queryParams = new URLSearchParams({
      format,
      ...filters,
    });

    return this.makeRequest(`/reports/download?${queryParams}`);
  }
}

export const apiService = new ApiService();
export default apiService;
