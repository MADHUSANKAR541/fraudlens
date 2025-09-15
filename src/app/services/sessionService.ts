// Session management service for dashboard data
// Handles mock data initially, then real data after uploads

import { FraudPrediction, TransactionData } from './fraudDetectionService';

export interface SessionData {
  hasUploadedData: boolean;
  mockData: {
    predictions: Array<FraudPrediction & { originalData: TransactionData }>;
    modelMetrics: {
      rocAuc: number;
      prAuc: number;
      f1Score: number;
      recall: number;
      precision: number;
      accuracy: number;
    };
    processingTime: number;
    totalRecords: number;
    fraudCount: number;
  };
  realData: {
    predictions: Array<FraudPrediction & { originalData: TransactionData }>;
    modelMetrics: {
      rocAuc: number;
      prAuc: number;
      f1Score: number;
      recall: number;
      precision: number;
      accuracy: number;
    };
    processingTime: number;
    totalRecords: number;
    fraudCount: number;
  } | null;
  lastUpdated: string;
}

class SessionService {
  private sessionKey = 'fraudlens_dashboard_session';
  private sessionData: SessionData;

  constructor() {
    this.sessionData = this.loadSession();
  }

  // Generate realistic mock data
  private generateMockData(): SessionData['mockData'] {
    const mockPredictions: Array<FraudPrediction & { originalData: TransactionData }> = [];
    
    // Generate 25 mock transactions
    for (let i = 0; i < 25; i++) {
      const isFraud = Math.random() < 0.15; // 15% fraud rate
      const riskScore = isFraud ? 0.6 + Math.random() * 0.4 : Math.random() * 0.4;
      const confidence = 0.7 + Math.random() * 0.3;
      
      const mockTransaction: TransactionData = {
        customer_age: 25 + Math.floor(Math.random() * 50),
        income: Math.random(),
        name_email_similarity: Math.random(),
        prev_address_months_count: Math.floor(Math.random() * 60) - 1,
        current_address_months_count: Math.floor(Math.random() * 120),
        days_since_request: Math.random() * 30,
        intended_balcon_amount: Math.random() * 10000,
        proposed_credit_limit: 1000 + Math.random() * 5000,
        payment_type: ['AA', 'AB', 'AC', 'AD'][Math.floor(Math.random() * 4)],
        bank_months_count: Math.floor(Math.random() * 60) - 1,
        has_other_cards: Math.random() > 0.5 ? 1 : 0,
        foreign_request: Math.random() > 0.8 ? 1 : 0,
        velocity_6h: Math.random() * 10000,
        velocity_24h: Math.random() * 20000,
        velocity_4w: Math.random() * 50000,
        zip_count_4w: Math.floor(Math.random() * 10),
        bank_branch_count_8w: Math.floor(Math.random() * 20),
        date_of_birth_distinct_emails_4w: Math.floor(Math.random() * 5),
        credit_risk_score: Math.floor(Math.random() * 300),
        employment_status: ['CA', 'CB', 'CC', 'CD'][Math.floor(Math.random() * 4)],
        housing_status: ['BA', 'BB', 'BC', 'BD'][Math.floor(Math.random() * 4)],
        email_is_free: Math.random() > 0.6 ? 1 : 0,
        phone_home_valid: Math.random() > 0.1 ? 1 : 0,
        phone_mobile_valid: Math.random() > 0.05 ? 1 : 0,
        source: ['INTERNET', 'MOBILE', 'BRANCH', 'ATM'][Math.floor(Math.random() * 4)],
        session_length_in_minutes: Math.random() * 60,
        device_os: ['windows', 'mac', 'linux', 'android', 'ios'][Math.floor(Math.random() * 5)],
        keep_alive_session: Math.random() > 0.3 ? 1 : 0,
        device_distinct_emails_8w: Math.floor(Math.random() * 10),
        device_fraud_count: isFraud ? Math.floor(Math.random() * 3) : 0,
        month: Math.floor(Math.random() * 12),
        fraud_bool: isFraud ? 1 : 0
      };

      const topFeatures = [
        { feature: 'velocity_6h', importance: 0.18, value: mockTransaction.velocity_6h },
        { feature: 'device_fraud_count', importance: 0.12, value: mockTransaction.device_fraud_count },
        { feature: 'credit_risk_score', importance: 0.11, value: mockTransaction.credit_risk_score },
        { feature: 'session_length_in_minutes', importance: 0.09, value: mockTransaction.session_length_in_minutes },
        { feature: 'bank_months_count', importance: 0.08, value: mockTransaction.bank_months_count }
      ];

      const explanation = isFraud 
        ? `High risk transaction detected. Key factors: unusually high transaction velocity (${mockTransaction.velocity_6h.toFixed(1)}), device has previous fraud history (${mockTransaction.device_fraud_count} cases), low credit risk score (${mockTransaction.credit_risk_score}).`
        : `Low risk transaction. Normal customer patterns and transaction characteristics detected. Customer age: ${mockTransaction.customer_age}, credit score: ${mockTransaction.credit_risk_score}, velocity within normal range.`;

      mockPredictions.push({
        isFraud,
        fraudProbability: riskScore,
        riskScore,
        confidence,
        explanation,
        topFeatures,
        originalData: mockTransaction
      });
    }

    const fraudCount = mockPredictions.filter(p => p.isFraud).length;

    return {
      predictions: mockPredictions,
      modelMetrics: {
        rocAuc: 0.9465,
        prAuc: 0.5476,
        f1Score: 0.3823,
        recall: 0.8586,
        precision: 0.2459,
        accuracy: 0.9016
      },
      processingTime: 0.045,
      totalRecords: 25,
      fraudCount
    };
  }

  // Load session from localStorage
  private loadSession(): SessionData {
    if (typeof window === 'undefined') {
      // Server-side rendering fallback
      return {
        hasUploadedData: false,
        mockData: this.generateMockData(),
        realData: null,
        lastUpdated: new Date().toISOString()
      };
    }

    try {
      const stored = localStorage.getItem(this.sessionKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure we have mock data even if session exists
        if (!parsed.mockData) {
          parsed.mockData = this.generateMockData();
        }
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load session data:', error);
    }

    // Return fresh session with mock data
    return {
      hasUploadedData: false,
      mockData: this.generateMockData(),
      realData: null,
      lastUpdated: new Date().toISOString()
    };
  }

  // Save session to localStorage
  private saveSession(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(this.sessionData));
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  }

  // Get current dashboard data (mock or real)
  getCurrentData(): SessionData['mockData'] | SessionData['realData'] {
    return this.sessionData.hasUploadedData && this.sessionData.realData 
      ? this.sessionData.realData 
      : this.sessionData.mockData;
  }

  // Check if we're showing real data
  isShowingRealData(): boolean {
    return this.sessionData.hasUploadedData && this.sessionData.realData !== null;
  }

  // Update with real upload data
  updateWithRealData(realData: SessionData['realData']): void {
    this.sessionData.hasUploadedData = true;
    this.sessionData.realData = realData;
    this.sessionData.lastUpdated = new Date().toISOString();
    this.saveSession();
  }

  // Reset to mock data
  resetToMockData(): void {
    this.sessionData.hasUploadedData = false;
    this.sessionData.realData = null;
    this.sessionData.mockData = this.generateMockData(); // Generate fresh mock data
    this.sessionData.lastUpdated = new Date().toISOString();
    this.saveSession();
  }

  // Get session info
  getSessionInfo(): {
    hasUploadedData: boolean;
    lastUpdated: string;
    dataSource: 'mock' | 'real';
    totalRecords: number;
    fraudCount: number;
  } {
    const currentData = this.getCurrentData();
    return {
      hasUploadedData: this.sessionData.hasUploadedData,
      lastUpdated: this.sessionData.lastUpdated,
      dataSource: this.isShowingRealData() ? 'real' : 'mock',
      totalRecords: currentData?.totalRecords || 0,
      fraudCount: currentData?.fraudCount || 0
    };
  }

  // Clear all session data
  clearSession(): void {
    this.sessionData = {
      hasUploadedData: false,
      mockData: this.generateMockData(),
      realData: null,
      lastUpdated: new Date().toISOString()
    };
    this.saveSession();
  }

  // Refresh mock data (generate new mock data)
  refreshMockData(): void {
    this.sessionData.mockData = this.generateMockData();
    this.sessionData.lastUpdated = new Date().toISOString();
    this.saveSession();
  }
}

// Export singleton instance
export const sessionService = new SessionService();
export default sessionService;
