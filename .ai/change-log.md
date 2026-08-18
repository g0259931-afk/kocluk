# CHANGE LOG

## [0.2.0] - 2026-08-07

### Added
- Root `package.json` dosyasına `packageManager` tanımı eklendi, Turborepo workspace çözünürlüğü düzeltildi.
- `packages/auth` modülü genişletildi: FirebaseAuthAdapter, CustomJWTAuthAdapter, CryptoJwtEngine (HMAC-SHA256 JWT doğrulama ve imzalama) ve AuthServiceFactory eklendi.
- `packages/database` modülü genişletildi: SupabaseDbAdapter, LocalPostgresAdapter, Soft Delete mekanizması, Audit Logging ve DatabaseFactory eklendi.
- Unit test paketleri eklendi (`packages/auth/index.test.ts`, `packages/database/index.test.ts`).

## [0.1.0] - 2026-08-07

### Added
- Proje başlangıç mimarisi monorepo yapısında kuruldu (`apps/web`, `apps/admin`, `apps/backend`).
- Paylaşılan kütüphaneler için alt paket dizinleri açıldı (`packages/*`).
- Root level `package.json`, `tsconfig.json` ve `turbo.json` konfigürasyonları yapıldı.
- Yaşayan teknik dokümantasyon dosyaları (`docs/` klasörü altına) eklendi.
- AI çalışma hafızası ve durum izleme dosyaları (`.ai/` klasörü altına) oluşturuldu.
