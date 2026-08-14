# CHANGELOG

## [0.2.0] - 2026-08-07

### Added
- Root test koşucusu yapılandırması tamamlandı. Native Node.js test koşucusu (`node:test` + `node:assert`) entegrasyonu `tsx` ile root seviyesine bağlandı.
- Kapsamlı birim ve entegrasyon test paketi (`tests/` klasörü altına) eklendi:
  - `tests/utils.test.ts`: Tarih, süre, e-posta, XSS girdi temizleme ve profil parmak izi fonksiyonlarını test eder.
  - `tests/auth.test.ts`: JWT HMAC-SHA256 kriptografik oturum imzalamayı, imza doğrulamasını, timingSafeEqual korumasını ve Firebase oturum akışını test eder.
  - `tests/database.test.ts`: In-Memory DB Store, Supabase DB adaptörü, CRUD, Soft Delete (deleted_at) ve Audit Loglama işlemlerini test eder.
  - `tests/ai.test.ts`: AI Gateway Model Router ve Fallback, Prompt Pipeline Builder, Context Optimizer ve Dual AI Engine (AI-1 ve AI-2) fonksiyonlarını test eder.
  - `tests/backend.test.ts`: Centralized Backend API Gateway, POST /login, GET/PUT /profile, GET/POST /lessons ve POST /chat/message çift AI akışını test eder.

### Fixed
- Backend API `/profile/settings` PUT route'u ve AI-1 sessiz profil güncellemesindeki manuel sürüm (version) artırma hatası giderildi (çifte sürüm artırma önlendi; artık sürüm artışı tamamen repository adaptörünün kontrolündedir).

---

## [0.1.0] - 2026-08-07

### Added
- Proje başlangıç mimarisi monorepo yapısında kuruldu (`apps/web`, `apps/admin`, `apps/backend`).
- Paylaşılan kütüphaneler için alt paket dizinleri açıldı (`packages/*`).
- Root level `package.json`, `tsconfig.json` ve `turbo.json` konfigürasyonları yapıldı.
- Yaşayan teknik dokümantasyon dosyaları (`docs/` klasörü altına) eklendi.
- AI çalışma hafızası ve durum izleme dosyaları (`.ai/` klasörü altına) oluşturuldu.
