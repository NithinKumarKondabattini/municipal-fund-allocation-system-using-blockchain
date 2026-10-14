"""Deterministic Isolation Forest service using a documented synthetic development baseline."""
from datetime import date
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import IsolationForest
import numpy as np

app = FastAPI(title="Municipal AI Risk Service", version="1.0.0")

class Transaction(BaseModel):
    amount: int = Field(gt=0)
    allocated_amount: int = Field(gt=0)
    frequency: int = Field(default=1, ge=0)
    vendor_frequency: int = Field(default=0, ge=0)
    project_progress: int = Field(default=0, ge=0, le=100)
    amount_deviation: float = Field(default=0, ge=0)

class ProjectRisk(BaseModel):
    allocated_amount: int = Field(gt=0)
    spent_amount: int = Field(ge=0)
    progress: int = Field(ge=0, le=100)
    start_date: date | None = None
    expected_end_date: date | None = None

def level(score: int) -> str:
    return "CRITICAL" if score >= 81 else "HIGH" if score >= 61 else "MEDIUM" if score >= 31 else "LOW"

def analyze(x: Transaction) -> dict:
    ratio = x.amount / x.allocated_amount
    baseline = np.array([[.01,1,0,3],[.02,1,0,5],[.04,2,1,8],[.06,2,0,10],[.09,3,1,12],[.12,2,1,15],[.15,3,2,18]])
    observation = np.array([[ratio,x.frequency,x.vendor_frequency,x.amount_deviation]])
    anomaly = bool(IsolationForest(contamination=.15,random_state=42).fit(baseline).predict(observation)[0] == -1)
    gap=max(0,ratio*100-x.project_progress*.35)
    score=min(100,round(ratio*200+x.frequency*3+x.vendor_frequency*6+x.amount_deviation*.4+gap+(25 if anomaly else 0)))
    recommendation="Require auditor review and supporting invoices before approval." if score>=61 else "Continue monitoring against project progress and vendor history."
    return {"riskScore":score,"risk_score":score,"riskLevel":level(score),"risk_level":level(score),"anomaly":anomaly,"explanation":"Transaction differs materially from historical municipal spending patterns." if anomaly else "Transaction is within the expected local spending pattern.","recommendations":[recommendation],"syntheticBaseline":True}

@app.get("/health")
def health(): return {"ok":True,"model":"IsolationForest","syntheticBaseline":True}

@app.post("/predict-risk")
@app.post("/detect-anomaly")
@app.post("/analyze/transaction")
def predict_risk(x:Transaction): return analyze(x)

@app.post("/budget-risk")
def budget_risk(x:ProjectRisk):
    utilization=round(x.spent_amount/x.allocated_amount*100,2); score=min(100,max(0,round((utilization-x.progress)*1.5+(20 if utilization>=90 else 10 if utilization>=80 else 0))))
    return {"budgetUtilization":utilization,"riskScore":score,"riskLevel":level(score),"explanation":f"Budget utilization is {utilization}% while completion is {x.progress}%.","recommendations":["Review spending and delivery milestones before committing further funds."] if score>=31 else ["Budget usage is consistent with current project progress."]}

@app.post("/project-delay")
def project_delay(x:ProjectRisk):
    if not x.start_date or not x.expected_end_date:return {"status":"ON_TRACK","expectedProgress":None,"actualProgress":x.progress,"explanation":"Schedule dates are required for calendar-based delay analysis."}
    span=max(1,(x.expected_end_date-x.start_date).days);expected=min(100,max(0,round((date.today()-x.start_date).days/span*100)));status="DELAYED" if x.progress<expected-20 else "AT_RISK" if x.progress<expected-8 else "ON_TRACK"
    return {"status":status,"expectedProgress":expected,"actualProgress":x.progress,"explanation":f"Expected progress is {expected}% and reported progress is {x.progress}%."}

@app.post("/recommendation")
def recommendation(x:Transaction): return {"recommendations":analyze(x)["recommendations"]}

@app.post("/analyze/project")
def legacy_project(x:Transaction): return budget_risk(ProjectRisk(allocated_amount=x.allocated_amount,spent_amount=x.amount,progress=x.project_progress))
