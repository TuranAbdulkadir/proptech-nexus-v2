from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import redis.asyncio as redis
import os
import time
import logging

from database import init_db_pool, close_db_pool
from routers import properties, audits

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the application lifespan: initialize and teardown connection pools.
    """
    logger.info("Initializing application resources...")
    app.state.db_pool = await init_db_pool()
    app.state.redis = redis.from_url(REDIS_URL, decode_responses=True)
    yield
    logger.info("Tearing down application resources...")
    await close_db_pool(app.state.db_pool)
    await app.state.redis.close()

app = FastAPI(title="PropTech-Nexus v2", lifespan=lifespan)

# CORS Middleware - Hardened for Production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-cyan-one-71.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Custom Redis-Backed Rate Limiting Middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Exclude health checks from rate limiting
    if request.url.path == "/health":
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown_ip"
    redis_client = getattr(request.app.state, "redis", None)
    
    if redis_client:
        try:
            current_time = int(time.time())
            window_start = current_time - (current_time % RATE_LIMIT_WINDOW)
            key = f"rate_limit:{client_ip}:{window_start}"
            
            requests_count = await redis_client.incr(key)
            if requests_count == 1:
                await redis_client.expire(key, RATE_LIMIT_WINDOW)
                
            if requests_count > RATE_LIMIT_REQUESTS:
                return Response(
                    content="Rate limit exceeded. Please try again later.", 
                    status_code=429
                )
        except Exception as e:
            logger.error(f"Redis rate limiting error: {e}")
            # Fail open if Redis is down so we don't break the application
            pass

    response = await call_next(request)
    return response

# Include Routers
app.include_router(properties.router)
app.include_router(audits.router)

@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "service": "proptech-nexus-v2-backend"}
