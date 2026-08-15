# CHANGE LOG

## [0.2.0] - 2026-08-07

### Added
- Root `package.json` dosyasına `packageManager: pnpm@10.30.3` ve `tsx` bağımlılığı eklendi.
- MSS 242 standartlarına tam uyumlu root `README.md` belgesi yazıldı.
- Yerel Node.js test runner (`node:test`) ile çalışacak `tests/auth.test.ts`, `tests/database.test.ts`, `tests/ai.test.ts`, `tests/utils.test.ts` ve `tests/backend.test.ts` test paketleri yazıldı.
- `apps/web/tailwind.config.js` content tarama desenleri optimize edilerek `pnpm build` süresi hızlandırıldı.
- `packages/database/index.ts` harita yineleyici (MapIterator) kullanımı ES2022 uyumlu hale getirildi.

### Fixed
- Turborepo `packageManager` alan eksikliği kaynaklı çalışma hatası düzeltildi.
- `pnpm test` komutu ile tüm 21 testin geçmesi sağlandı ve `pnpm build` yeşil duruma getirildi.

## [0.1.0] - 2026-08-07

### Added
- Proje başlangıç mimarisi monorepo yapısında kuruldu (`apps/web`, `apps/admin`, `apps/backend`).
- Paylaşılan kütüphaneler için alt paket dizinleri açıldı (`packages/*`).
- Root level `package.json`, `tsconfig.json` ve `turbo.json` konfigürasyonları yapıldı.
- Yaşayan teknik dokümantasyon dosyaları (`docs/` klasörü altına) eklendi.
- AI çalışma hafızası ve durum izleme dosyaları (`.ai/` klasörü altına) oluşturuldu.
