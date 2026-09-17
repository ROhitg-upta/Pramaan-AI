# Multi-stage Dockerfile for Pramaan AI Backend
# -------------------------------------------------------------
# Stage 1: Build Dependencies
# -------------------------------------------------------------
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy and build Python wheels
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# -------------------------------------------------------------
# Stage 2: Production Runtime
# -------------------------------------------------------------
FROM python:3.11-slim AS runner

WORKDIR /app

# Install runtime system dependencies (git, libpq5, curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built wheels from builder stage and install
COPY --from=builder /build/wheels /wheels
COPY --from=builder /build/requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir --no-index --find-links=/wheels -r requirements.txt \
    && rm -rf /wheels

# Create app user and directories for temporary git clones
RUN useradd -m -u 1001 -s /bin/bash pramaan \
    && mkdir -p /app/tmp/repos \
    && chown -R pramaan:pramaan /app

# Copy application source code
COPY --chown=pramaan:pramaan . .

USER pramaan

# Expose backend API port
EXPOSE 8000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Production Entrypoint
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
