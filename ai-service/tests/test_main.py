from main import analyze,Transaction
def test_analyze_returns_risk():
 assert analyze(Transaction(amount=10000,allocated_amount=100000))['risk_score']>=0
