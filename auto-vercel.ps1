Write-Host "========================================="
Write-Host "VERCEL AUTONOMOUS CLOUD DEPLOYMENT"
Write-Host "========================================="

Write-Host "[*] Vercel Authentication found! User: turanabdulkadir"
Write-Host "[*] Uploading Next.js architecture directly to Vercel Edge Network..."

# Dizin değişikliğini güvenli yapmak için
Set-Location -Path "C:\Users\MSI\.gemini\antigravity\scratch\proptech-nexus-v2\frontend"

# Vercel'e tüm çevresel değişkenleri (API anahtarları) doğrudan enjekte ederek otonom production build alıyoruz.
npx vercel --yes --prod -e NEXT_PUBLIC_SUPABASE_URL="https://yyaykimfcglhrcbhhli.supabase.co" -e NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5YXlraW1mY2dsaHJjYmhoaGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMjk5NTEsImV4cCI6MjA5OTYwNTk1MX0.mkK5Kmo6V8KmTdB5nj1XbJK2ZKuNa2uOiiGHwe9fh4A" -e NEXT_PUBLIC_BACKEND_URL="https://proptech-backend.up.railway.app" -e DATABASE_URL="postgres://postgres.yyaykimfcglhrcbhhli:UxnKq5y6G5xL95aQ@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[+] SUCCESS! Vercel Deployment Completed!"
} else {
    Write-Host "[!] Deployment encountered an issue. See logs above."
}
