import asyncio
from backend.services.auditor import auditor_service

async def test():
    props = await auditor_service.fetch_real_properties(limit=200)
    print("Found properties:", len(props))
    if props:
        print("First property:", props[0])

if __name__ == "__main__":
    asyncio.run(test())
