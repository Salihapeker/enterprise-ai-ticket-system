import logging
import uuid
from contextvars import ContextVar

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.types import ASGIApp

HEADER = "X-Correlation-Id"
correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="")


class CorrelationIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.correlation_id = correlation_id_var.get()
        return True


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        cid = request.headers.get(HEADER) or str(uuid.uuid4())
        token = correlation_id_var.set(cid)
        try:
            response = await call_next(request)
            response.headers[HEADER] = cid
            return response
        finally:
            correlation_id_var.reset(token)


def install_log_filter() -> None:
    logging.getLogger().addFilter(CorrelationIdFilter())