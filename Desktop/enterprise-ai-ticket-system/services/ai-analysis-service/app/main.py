import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .config import settings
from .logging_config import setup_logging
from .middleware import CorrelationIdMiddleware, install_log_filter

setup_logging()
install_log_filter()
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("ai-service starting version=%s", settings.app_version)
    yield
    log.info("ai-service shutting down")


app = FastAPI(
    title="AI Analysis Service",
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(CorrelationIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Correlation-Id"],
)


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)


class AnalyzeResponse(BaseModel):
    urgency_score: float
    tag: str


def simple_urgency_score(text: str) -> float:
    t = text.lower()
    keywords = [
        "acil", "kritik", "hemen", "yavaş", "iş yapamıyorum",
        "çöktü", "erişemiyorum", "kesildi", "bozuk",
    ]
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
def health() -> dict:
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    score = simple_urgency_score(req.text)
    tag = tag_from_score(score)
    log.info("analyze textLen=%d score=%.2f tag=%s", len(req.text), score, tag)
    return AnalyzeResponse(urgency_score=score, tag=tag)