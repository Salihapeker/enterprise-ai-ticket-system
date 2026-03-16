from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Analysis Service", version="0.1.0")


class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    urgency_score: float
    tag: str


def simple_urgency_score(text: str) -> float:
    t = text.lower()
    keywords = ["acil", "kritik", "hemen", "yavaş", "iş yapamıyorum", "çöktü", "erişemiyorum"]
    score = 0.2
    for k in keywords:
        if k in t:
            score += 0.15
    score += min(text.count("!"), 3) * 0.1
    return max(0.0, min(1.0, score))


def tag_from_score(score: float) -> str:
    if score > 0.8:
        return "KRITIK_ACIL"
    if score > 0.6:
        return "ACIL"
    return "NORMAL"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    score = simple_urgency_score(req.text)
    return AnalyzeResponse(urgency_score=score, tag=tag_from_score(score))