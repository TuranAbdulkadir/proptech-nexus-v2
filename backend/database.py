import asyncpg
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")

async def init_db_pool():
    """
    Initialize the connection pool to the Supabase PostgreSQL database.
    """
    pool = await asyncpg.create_pool(
        dsn=DATABASE_URL,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )
    return pool

async def close_db_pool(pool):
    """
    Close the database connection pool gracefully.
    """
    if pool:
        await pool.close()
