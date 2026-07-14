# Use the highly optimized Python 3.11 slim variant
FROM python:3.11-slim

# Enforce secure and unbuffered execution
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for Playwright and network operations
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies definition
COPY requirements.txt /app/

# Install Python packages securely without caching
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright Chromium binary along with all necessary OS-level dependencies
# (libnss3, libasound2, etc.) for headless browser execution
RUN playwright install chromium --with-deps

# Copy the entire FastAPI application
COPY . /app/

# Expose standard container port
EXPOSE 8000

# Execute the application via Uvicorn ASGI server optimized for async workflows
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
