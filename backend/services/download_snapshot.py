import asyncio
import httpx
import json
from urllib.parse import quote

async def download_snapshot():
    limit = 200
    query = "assesstot > 500000 AND assesstot < 100000000 AND latitude IS NOT NULL"
    url = f"https://data.cityofnewyork.us/resource/64uk-42ks.json?$where={quote(query)}&$limit={limit}&$order=assesstot%20DESC"
    
    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        data = r.json()
        print("Downloaded:", len(data))
        
        with open("pluto_snapshot.json", "w") as f:
            json.dump(data, f)
            
if __name__ == "__main__":
    asyncio.run(download_snapshot())
