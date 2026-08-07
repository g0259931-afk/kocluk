# DEPLOYMENT PLAN

## Aşama 1: Development & Staging (Vercel + Supabase)
- **Frontend / Next.js:** Vercel üzerinde otomatik CI/CD entegrasyonu ile deploy edilecek. Her commit sonrasında Preview Branch'ler oluşturulacak.
- **Veritabanı / Auth:** Supabase PostgreSQL bulut veritabanı kullanılacak.
- **AI Entegrasyonu:** OpenAI / Claude API anahtarları Vercel Environment Variables üzerinde güvenli bir şekilde tutulacak.

## Aşama 2: CI/CD Pipeline Akışı
Her push işleminde otomatik olarak şu kontroller sırasıyla çalıştırılacaktır:
1. `Type Check` (TypeScript tiplerinin doğrulanması)
2. `Lint` (ESLint kurallarının kontrolü)
3. `Unit Test` (Jest/Vitest testleri)
4. `Build` (Next.js derlemesi)
5. `Security Scan` (Bağımlılıklar ve sızıntı kontrolü)

Herhangi bir adımda başarısız olan pipeline canlı ortama deploy edilmeyecektir.
