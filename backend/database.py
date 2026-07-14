import asyncpg
import os
from urllib.parse import urlparse, urlunparse

raw_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")

def fix_supabase_url(url: str) -> str:
    # Supabase IPv4 Pooler routing often fails with asyncpg (tenant/user not found)
    # We dynamically rewrite it to a direct connection to bypass the pooler entirely.
    if "pooler.supabase.com" in url:
        parsed = urlparse(url)
        if parsed.username and "." in parsed.username:
            user, project_ref = parsed.username.split(".", 1)
            new_netloc = f"{user}:{parsed.password}@db.{project_ref}.supabase.co:5432"
            return urlunparse((parsed.scheme, new_netloc, parsed.path, parsed.params, "", parsed.fragment))
    return url

DATABASE_URL = fix_supabase_url(raw_url)

async def init_db_pool():
    """
    Initialize the connection pool to the Supabase PostgreSQL database.
    """
    try:
        pool = await asyncpg.create_pool(
            dsn=DATABASE_URL,
            min_size=2,
            max_size=10,
            command_timeout=60,
        )
        return pool
    except Exception as e:
        print(f"CRITICAL: Failed to connect to Supabase: {e}. Running in Mock Mode.")
        return None

async def close_db_pool(pool):
    """
    Close the database connection pool gracefully.
    """
    if pool:
        await pool.close()
