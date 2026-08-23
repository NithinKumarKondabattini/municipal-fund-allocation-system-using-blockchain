from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import IsolationForest
import numpy as np
app=FastAPI(title='Municipal AI Risk Service')
class Transaction(BaseModel):
 amount:int=Field(gt=0); allocated_amount:int=Field(gt=0); frequency:int=1; repeated_vendor:int=0; progress:int=0
@app.get('/health')
def health(): return {'ok':True}
@app.post('/analyze/transaction')
def analyze(x:Transaction):
 ratio=x.amount/x.allocated_amount; X=np.array([[ratio,x.frequency,x.repeated_vendor],[.02,1,0],[.04,2,0],[.07,1,0],[.1,3,1],[.15,2,0]])
 model=IsolationForest(contamination=.2,random_state=42).fit(X); anomaly=model.predict(X[:1])[0]==-1
 score=min(100,round(ratio*220+x.frequency*4+x.repeated_vendor*20+(30 if anomaly else 0)))
 return {'risk_score':score,'risk_level':'HIGH' if score>=60 else 'MEDIUM' if score>=30 else 'LOW','anomaly':anomaly,'recommendation':'Review expenditure against project progress.' if score>=60 else 'Continue routine monitoring.'}
@app.post('/analyze/project')
def project(x:Transaction):
 spent=x.amount/x.allocated_amount*100; delay='Delayed' if x.progress<spent*.65 else 'At Risk' if x.progress<spent else 'On Track'
 return {'utilization_percent':round(spent,2),'budget_warning':f'Project has spent {spent:.0f}% of its allocated budget.' if spent>=80 else None,'schedule_risk':delay}
