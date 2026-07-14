import { db } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  console.log('Testing connection to Supabase and PostGIS extension...');
  try {
    // Execute a raw SQL query to verify PostGIS is active and accessible
    const result = await db.execute(sql`SELECT PostGIS_version();`);
    
    console.log('✅ DATABASE CONNECTION SUCCESSFUL!');
    console.log('✅ POSTGIS STATUS:', result[0].postgis_version);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ DATABASE CONNECTION FAILED:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
