
export interface FraudPrediction {
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
}

export interface TransactionData {
  customer_age: number;
  income: number;
  name_email_similarity: number;
  
  prev_address_months_count: number;
  current_address_months_count: number;
  
  days_since_request: number;
  intended_balcon_amount: number;
  proposed_credit_limit: number;
  
  payment_type: string; // AA, AB, AC, etc.
  bank_months_count: number;
  has_other_cards: number; // 0/1
  foreign_request: number; // 0/1
  
  velocity_6h: number;
  velocity_24h: number;
  velocity_4w: number;
  
  zip_count_4w: number;
  bank_branch_count_8w: number;
  date_of_birth_distinct_emails_4w: number;
  
  credit_risk_score: number;
  employment_status: string; // CA, CB, CC, etc.
  housing_status: string; // BA, BB, BC, etc.
  
  email_is_free: number; // 0/1
  phone_home_valid: number; // 0/1
  phone_mobile_valid: number; // 0/1
  
  source: string; // INTERNET, MOBILE, BRANCH, ATM
  session_length_in_minutes: number;
  device_os: string; // windows, mac, linux, android, ios, other
  keep_alive_session: number; // 0/1
  device_distinct_emails_8w: number;
  device_fraud_count: number;
  
  month: number; // 0-11
  
  fraud_bool?: number; // 0/1 - optional, only present in training data
}

export interface ModelMetrics {
  rocAuc: number;
  prAuc: number;
  f1Score: number;
  recall: number;
  precision: number;
  accuracy: number;
}

export const DEFAULT_MODEL_METRICS: ModelMetrics = {
  rocAuc: 0.9465,
  prAuc: 0.5476,
  f1Score: 0.3823,
  recall: 0.8586,
  precision: 0.2459,
  accuracy: 0.9016
};

export const FEATURE_IMPORTANCE = [
  { feature: 'velocity_6h', importance: 0.18 },
  { feature: 'velocity_24h', importance: 0.15 },
  { feature: 'device_fraud_count', importance: 0.12 },
  { feature: 'credit_risk_score', importance: 0.11 },
  { feature: 'session_length_in_minutes', importance: 0.09 },
  { feature: 'bank_months_count', importance: 0.08 },
  { feature: 'customer_age', importance: 0.07 },
  { feature: 'proposed_credit_limit', importance: 0.06 },
  { feature: 'velocity_4w', importance: 0.05 },
  { feature: 'zip_count_4w', importance: 0.04 },
  { feature: 'income', importance: 0.03 },
  { feature: 'name_email_similarity', importance: 0.02 },
  { feature: 'current_address_months_count', importance: 0.02 },
  { feature: 'bank_branch_count_8w', importance: 0.02 },
  { feature: 'device_distinct_emails_8w', importance: 0.02 },
  { feature: 'payment_type', importance: 0.02 },
  { feature: 'employment_status', importance: 0.01 },
  { feature: 'housing_status', importance: 0.01 },
  { feature: 'source', importance: 0.01 },
  { feature: 'device_os', importance: 0.01 }
];
