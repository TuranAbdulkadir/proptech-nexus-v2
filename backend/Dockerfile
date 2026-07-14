# Use the official Microsoft Playwright image (pre-loaded with Chromium and all OS dependencies)
# This completely eliminates Debian dependency resolution crashes (like ttf-unifont)
FROM mcr.microsoft.com/playwright/python:v1.43.0-jammy

# Enforce secure and unbuffered execution
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy backend dependencies definition
COPY requirements.txt /app/

# Install Python packages securely without caching
RUN pip install --no-cache-dir -r requirements.txt

# (Playwright browsers are already pre-installed in the base image, so we skip the installation step)

# Copy the entire FastAPI application
COPY . /app/

# Expose standard container port
EXPOSE 8000

# Execute the application via Uvicorn ASGI server optimized for async workflows
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
