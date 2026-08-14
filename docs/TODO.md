# TODO

## BACKLOG
- [ ] Ders, Konu, Alt Konu hiyerarşik veritabanı şeması ve MEB kazanım entegrasyonu (Faz 3).
- [ ] PayTR ve İyzico entegrasyonu ile abonelik paketlerinin bağlanması (Faz 4).
- [ ] SaaS Yönetim Merkezi admin paneli (Kullanıcı, Finans ve AI Kontrol arayüzü) (Faz 5).

## IN PROGRESS
- [ ] Optimizasyon, Lighthouse skor iyileştirmeleri ve ek test senaryolarının genişletilmesi (Faz 6).

## DONE
- [x] Monorepo dizin hiyerarşisinin (`apps/*`, `packages/*`) oluşturulması.
- [x] Tüm Living Documentation (`docs/` ve `.ai/` klasörleri) dosyalarının yazılması.
- [x] `packages/auth` altında Firebase ve Custom JWT sağlayıcılarının ve JWT imza motorunun yazılması.
- [x] `packages/database` altında PostgreSQL ve Supabase DB adaptörlerinin, audit loglama ve soft delete mekanizmalarının yazılması.
- [x] `apps/web` Next.js landing page, 8-Adımlı Onboarding sihirbazı ve premium arayüzlerin tasarlanması.
- [x] AI Gateway ve Çift Yapay Zekâ Motorunun (`Profil Analiz Motoru` + `Koç Motoru`) pipeline entegrasyonu.
- [x] Context Optimizer, Token Wallet ve Prompt Builder katmanlarının yazılması.
- [x] Model Router ve Fallback mimarisinin kurulması.
- [x] 34 kapsamlı birim ve entegrasyon testi içeren test paketinin `node:test` + `tsx` ile yazılması ve doğrulanması.
