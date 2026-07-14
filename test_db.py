import asyncio
import asyncpg

DATABASE_URL = "postgres://postgres.yyaykimfcglhrcbhhli:UxnKq5y6G5xL95aQ@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"

async def test_conn():
    try:
        print(f"Connecting to {DATABASE_URL}...")
        conn = await asyncpg.connect(DATABASE_URL)
        print("Success!")
        await conn.close()
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(test_conn())
