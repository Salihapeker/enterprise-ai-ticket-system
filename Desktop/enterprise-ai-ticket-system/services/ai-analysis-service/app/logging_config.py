import logging
import sys

from pythonjsonlogger import jsonlogger

from .config import settings


def setup_logging() -> None:
    root = logging.getLogger()
    root.setLevel(settings.log_level)

    # Remove default handlers
    for h in list(root.handlers):
        root.removeHandler(h)

    handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter(
        fmt="%(asctime)s %(levelname)s %(name)s %(message)s %(correlation_id)s",
        rename_fields={"asctime": "timestamp", "levelname": "level"},
    )
    handler.setFormatter(formatter)
    root.addHandler(handler)

    # Quieten uvicorn defaults
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)