import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

// IPv4 destekli pooler adresi ve tamamen düzeltilmiş tek "b"li kullanıcı adı
const sql = postgres({
  host: "aws-0-eu-west-1.pooler.supabase.com",
  port: 6543,
  database: "postgres",
  username: "postgres.yyaykimfcglhrcbhhli", // TEK "b" - ARTIK HATASIZ!
  password: "UxnKq5y6G5xL95aQ",
  ssl: "require",
  prepare: false // Transaction Mode için kritik ayar
});

async function main() {
  console.log("[*] Executing direct pg migration bypass...");
  
  try {
    // Şema dosyasını oku ve çalıştır
    const schemaPath = path.join(__dirname, "database", "schema.sql");
    if (fs.existsSync(schemaPath)) {
      console.log("[*] Pushing PropTech-Nexus PostGIS schemas to live database...");
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      await sql.unsafe(schemaSql);
      console.log("[+] Schema synced successfully!");
    }

    // RLS politikalarını oku ve çalıştır
    const rlsPath = path.join(__dirname, "database", "rls_policies.sql");
    if (fs.existsSync(rlsPath)) {
      console.log("[*] Applying RLS Policies...");
      const rlsSql = fs.readFileSync(rlsPath, "utf8");
      await sql.unsafe(rlsSql);
      console.log("[+] RLS Policies applied successfully!");
    }

    console.log("[=============================]");
    console.log("[🎉] VICTORY! DATABASE IS READY!");
    console.log("[=============================]");
  } catch (error) {
    console.error("[ERROR] Migration bypass failed:", error);
  } finally {
    await sql.end();
  }
}

main();