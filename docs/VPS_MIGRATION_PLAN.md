# VPS MIGRATION PLAN

İleride Firebase, Supabase ve Vercel bağımlılıklarını kaldırarak tamamen kendi Ubuntu VPS sunucularımıza geçiş planı.

## Hedef Sunucu Yapısı (Ubuntu VPS)
- **Reverse Proxy:** Nginx (SSL Sertifikası Let's Encrypt ile yönetilecek)
- **Containerization:** Docker & Docker Compose
- **Servis Dağılımı:**
  - `web-app-container` (Next.js Frontend)
  - `backend-api-container` (Node.js API)
  - `postgres-db-container` (PostgreSQL Veritabanı)
  - `redis-cache-container` (Redis Rate Limit & Session Cache)

## Kod Bağımsızlığı
- Veritabanı işlemleri `Database Adapter` üzerinden soyutlandığı için kod tarafında hiçbir SQL sorgusu veya bağlantı mantığı değişmeyecek. Sadece `.env` içerisindeki veritabanı bağlantı adresi (connection string) güncellenecektir.
- Kimlik doğrulama için Firebase Auth yerine `Custom JWT Auth Provider` adapter'ı aktif edilecektir.
- Dosya yükleme ve PDF analizi için lokal depolama veya MinIO adapter'ına geçiş yapılacaktır.
