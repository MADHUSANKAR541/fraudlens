from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import json
import uuid
from datetime import datetime, timedelta
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FraudLens API",
    description="Advanced AI-powered fraud detection API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TransactionData(BaseModel):
    transaction_id: str
    amount: float
    timestamp: str
    user_id: str
    merchant_id: Optional[str] = None
    location: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None

class FraudPrediction(BaseModel):
    transaction_id: str
    fraud_probability: float
    risk_score: float
    risk_level: str
    features: Dict[str, float]
    explanation: Dict[str, Any]

class BatchPredictionRequest(BaseModel):
    transactions: List[TransactionData]
    model_version: Optional[str] = "latest"

class BatchPredictionResponse(BaseModel):
    predictions: List[FraudPrediction]
    batch_id: str
    processing_time: float
    total_transactions: int

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float
    confusion_matrix: Dict[str, int]

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    uptime: float

# Global variables for demo purposes
start_time = datetime.now()
model_metrics = ModelMetrics(
    accuracy=0.997,
    precision=0.985,
    recall=0.992,
    f1_score=0.988,
    auc_roc=0.995,
    confusion_matrix={
        "true_negatives": 2845000,
        "false_positives": 89,
        "false_negatives": 12,
        "true_positives": 1235
    }
)

# In-memory storage for demo (in production, use a proper database)
uploaded_files = {}
prediction_results = {}

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with health information"""
    uptime = (datetime.now() - start_time).total_seconds()
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        uptime=uptime
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = (datetime.now() - start_time).total_seconds()
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        uptime=uptime
    )

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload transaction data file for processing"""
    try:
        # Validate file type
        if not file.filename.endswith(('.csv', '.xlsx', '.xls', '.json')):
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Read file content
        content = await file.read()
        file_id = str(uuid.uuid4())
        
        # Store file metadata
        uploaded_files[file_id] = {
            "filename": file.filename,
            "size": len(content),
            "upload_time": datetime.now().isoformat(),
            "status": "uploaded"
        }
        
        logger.info(f"File uploaded: {file.filename} (ID: {file_id})")
        
        return {
            "file_id": file_id,
            "filename": file.filename,
            "size": len(content),
            "status": "uploaded",
            "message": "File uploaded successfully"
        }
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/files/{file_id}")
async def get_file_status(file_id: str):
    """Get file upload status"""
    if file_id not in uploaded_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    return uploaded_files[file_id]

@app.post("/predict/single", response_model=FraudPrediction)
async def predict_single_transaction(transaction: TransactionData):
    """Predict fraud for a single transaction"""
    try:
        # Simulate ML model prediction
        fraud_probability = np.random.beta(2, 5)  # Skewed towards lower values
        risk_score = fraud_probability * 100
        
        # Determine risk level
        if risk_score < 30:
            risk_level = "low"
        elif risk_score < 70:
            risk_level = "medium"
        else:
            risk_level = "high"
        
        # Generate feature importance
        features = {
            "amount": min(transaction.amount / 10000, 1.0),
            "time_of_day": np.random.random(),
            "location_risk": np.random.random(),
            "device_trust": np.random.random(),
            "user_behavior": np.random.random()
        }
        
        # Generate explanation
        explanation = {
            "top_features": [
                {"feature": "amount", "importance": 0.35, "value": transaction.amount},
                {"feature": "location_risk", "importance": 0.25, "value": features["location_risk"]},
                {"feature": "time_of_day", "importance": 0.20, "value": features["time_of_day"]},
                {"feature": "device_trust", "importance": 0.15, "value": features["device_trust"]},
                {"feature": "user_behavior", "importance": 0.05, "value": features["user_behavior"]}
            ],
            "reasoning": f"Transaction flagged due to {'high amount' if transaction.amount > 5000 else 'unusual pattern'}"
        }
        
        prediction = FraudPrediction(
            transaction_id=transaction.transaction_id,
            fraud_probability=fraud_probability,
            risk_score=risk_score,
            risk_level=risk_level,
            features=features,
            explanation=explanation
        )
        
        logger.info(f"Prediction generated for transaction {transaction.transaction_id}")
        return prediction
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/batch", response_model=BatchPredictionResponse)
async def predict_batch_transactions(request: BatchPredictionRequest):
    """Predict fraud for multiple transactions"""
    try:
        start_time = datetime.now()
        predictions = []
        
        # Process each transaction
        for transaction in request.transactions:
            # Simulate ML model prediction
            fraud_probability = np.random.beta(2, 5)
            risk_score = fraud_probability * 100
            
            # Determine risk level
            if risk_score < 30:
                risk_level = "low"
            elif risk_score < 70:
                risk_level = "medium"
            else:
                risk_level = "high"
            
            # Generate feature importance
            features = {
                "amount": min(transaction.amount / 10000, 1.0),
                "time_of_day": np.random.random(),
                "location_risk": np.random.random(),
                "device_trust": np.random.random(),
                "user_behavior": np.random.random()
            }
            
            # Generate explanation
            explanation = {
                "top_features": [
                    {"feature": "amount", "importance": 0.35, "value": transaction.amount},
                    {"feature": "location_risk", "importance": 0.25, "value": features["location_risk"]},
                    {"feature": "time_of_day", "importance": 0.20, "value": features["time_of_day"]},
                    {"feature": "device_trust", "importance": 0.15, "value": features["device_trust"]},
                    {"feature": "user_behavior", "importance": 0.05, "value": features["user_behavior"]}
                ],
                "reasoning": f"Transaction flagged due to {'high amount' if transaction.amount > 5000 else 'unusual pattern'}"
            }
            
            prediction = FraudPrediction(
                transaction_id=transaction.transaction_id,
                fraud_probability=fraud_probability,
                risk_score=risk_score,
                risk_level=risk_level,
                features=features,
                explanation=explanation
            )
            
            predictions.append(prediction)
        
        # Simulate processing time
        await asyncio.sleep(0.1)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        batch_id = str(uuid.uuid4())
        
        # Store results
        prediction_results[batch_id] = {
            "predictions": predictions,
            "processing_time": processing_time,
            "timestamp": datetime.now().isoformat()
        }
        
        response = BatchPredictionResponse(
            predictions=predictions,
            batch_id=batch_id,
            processing_time=processing_time,
            total_transactions=len(predictions)
        )
        
        logger.info(f"Batch prediction completed: {len(predictions)} transactions processed")
        return response
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/predict/batch/{batch_id}")
async def get_batch_results(batch_id: str):
    """Get batch prediction results"""
    if batch_id not in prediction_results:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    return prediction_results[batch_id]

@app.get("/model/metrics", response_model=ModelMetrics)
async def get_model_metrics():
    """Get current model performance metrics"""
    return model_metrics

@app.post("/model/retrain")
async def retrain_model():
    """Trigger model retraining (demo endpoint)"""
    try:
        # Simulate retraining process
        await asyncio.sleep(2)
        
        # Update metrics with slight variations
        model_metrics.accuracy = min(0.999, model_metrics.accuracy + np.random.normal(0, 0.001))
        model_metrics.precision = min(0.999, model_metrics.precision + np.random.normal(0, 0.001))
        model_metrics.recall = min(0.999, model_metrics.recall + np.random.normal(0, 0.001))
        model_metrics.f1_score = min(0.999, model_metrics.f1_score + np.random.normal(0, 0.001))
        model_metrics.auc_roc = min(0.999, model_metrics.auc_roc + np.random.normal(0, 0.001))
        
        logger.info("Model retraining completed")
        
        return {
            "status": "success",
            "message": "Model retraining completed",
            "new_metrics": model_metrics,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Model retraining error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Model retraining failed: {str(e)}")

@app.get("/analytics/summary")
async def get_analytics_summary():
    """Get fraud detection analytics summary"""
    try:
        # Generate mock analytics data
        summary = {
            "total_transactions": np.random.randint(2000000, 3000000),
            "fraud_detected": np.random.randint(1000, 1500),
            "false_positives": np.random.randint(80, 120),
            "accuracy_rate": 0.997,
            "fraud_rate": np.random.uniform(0.0004, 0.0006),
            "top_fraud_types": [
                {"type": "Credit Card Fraud", "count": 450, "percentage": 35.2},
                {"type": "Identity Theft", "count": 280, "percentage": 21.9},
                {"type": "Account Takeover", "count": 190, "percentage": 14.8},
                {"type": "Synthetic Identity", "count": 120, "percentage": 9.4},
                {"type": "Other", "count": 240, "percentage": 18.7}
            ],
            "trends": {
                "fraud_trend": "decreasing",
                "accuracy_trend": "increasing",
                "volume_trend": "increasing"
            },
            "timestamp": datetime.now().isoformat()
        }
        
        return summary
        
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analytics failed: {str(e)}")

@app.get("/explain/{transaction_id}")
async def explain_prediction(transaction_id: str):
    """Get detailed explanation for a specific transaction prediction"""
    try:
        # Generate mock explanation data
        explanation = {
            "transaction_id": transaction_id,
            "shap_values": {
                "amount": 0.35,
                "time_of_day": 0.20,
                "location_risk": 0.25,
                "device_trust": 0.15,
                "user_behavior": 0.05
            },
            "feature_importance": [
                {"feature": "amount", "value": 2500.0, "importance": 0.35, "description": "Transaction amount is above average"},
                {"feature": "location_risk", "value": 0.8, "importance": 0.25, "description": "High-risk geographical location"},
                {"feature": "time_of_day", "value": 0.3, "importance": 0.20, "description": "Unusual transaction time"},
                {"feature": "device_trust", "value": 0.2, "importance": 0.15, "description": "Low device trust score"},
                {"feature": "user_behavior", "value": 0.1, "importance": 0.05, "description": "Deviates from normal behavior"}
            ],
            "decision_path": [
                "Amount > $2000 threshold",
                "Location risk score > 0.7",
                "Time of day outside normal hours",
                "Device not previously seen"
            ],
            "confidence": 0.87,
            "timestamp": datetime.now().isoformat()
        }
        
        return explanation
        
    except Exception as e:
        logger.error(f"Explanation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
