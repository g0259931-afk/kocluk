# AI SaaS Student Coach Platform

> **Proje Tanımı & Amacı:**
> Türkiye'deki ilkokul, ortaokul, lise, TYT, AYT, YKS, üniversite ve mezun öğrencilerine yönelik geliştiriilen; uzun süreli hafızaya (AI Memory), çift yapay zekâ motoruna (AI-1 & AI-2) ve enterprise düzeyde soyutlanmış mimariye sahip, Next.js ve Monorepo tabanlı yapay zekâ destekli dijital eğitim koçluğu SaaS platformudur.
>
> **Temel Felsefe:**
> Bu sistem basit bir chatbot değil; öğrencinin "Bugün ne çalışacağım?" sorusunu sormasına gerek bırakmayan, kişiselleştirilmiş ders ve analiz yönetim merkezidir.

---

## 🛠️ Teknolojiler (Tech Stack)

* **Monorepo & Build Tool:** [Turborepo](https://turbo.build/) & [pnpm](https://pnpm.io/)
* **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript
* **Backend & API:** Node.js, API-First Clean Architecture, Express / Route Dispatcher
* **Authentication:** Firebase Auth Abstraction (Kriptografik HMAC-SHA256 JWT Fallback)
* **Veritabanı:** Supabase PostgreSQL Abstraction (Repository Pattern + In-Memory Store Simülasyonu)
* **Yapay Zekâ (AI Engine):** Provider Adapter Pattern (OpenAI, Claude, DeepSeek, Gemini, OpenRouter), Dual AI Engine (AI-1 Profil Analizi + AI-2 Koç Motoru), Prompt Pipeline, Token Economy Engine
* **Test Runner:** Yerel Node.js Test Runner (`node:test` & `node:assert`) + `tsx`

---

## 📁 Klasör Yapısı (Folder Structure)

```text
ai-saas-student-coach/
├── apps/
│   ├── web/           # Öğrenci web istemcisi (Next.js App Router, Dashboard, Chat, Dersler, Analiz)
│   ├── admin/         # Yönetim ve SaaS Kontrol Paneli (Kullanıcı, Model, Prompt ve Finans Yönetimi)
│   └── backend/       # API-First Backend Sunucusu (Clean Architecture, API Gateways & Service Abstractions)
├── packages/
│   ├── ai/            # Çift AI Motoru, AI Gateway, Model Router, Token Ekonomi & Prompt Pipeline
│   ├── auth/          # Kimlik Doğrulama Katmanı (Firebase Auth Abstraction & Kriptografik JWT)
│   ├── database/      # Veritabanı Katmanı (Supabase & PostgreSQL Repository Adapters, In-Memory Store)
│   ├── shared/        # Tasarım Sistem Sabitleri (DesignTokens), Onboarding Adımları & RBAC İzinleri
│   ├── types/         # Domain Entities, DTOs & Bütünleşmiş TypeScript Tipi Tanımları
│   └── utils/         # Tarih, Metin Sanitization, Fingerprint Hash & Hata Kodları Yardımcıları
├── docs/              # Yaşayan Dokümantasyon Sistemi (PRD, SRS, SAD, UI Guidelines, Security Checklist)
├── .ai/               # AI Geliştirme Hafızası (Master Plan, Roadmap, Progress, Decision Log, Bug List)
├── tests/             # Workspace Birim ve Entegrasyon Testleri (`node:test` + `tsx`)
├── package.json       # Monorepo Workspace Konfigürasyonu
├── turbo.json         # Turborepo Görev Bağımlılıkları
└── tsconfig.json      # TypeScript Global Yapılandırması
```

---

## 🚀 Kurulum & Çalıştırma (Installation & Running)

### Gereksinimler
* Node.js >= 18.0.0
* pnpm >= 10.30.3

### 1. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 2. Geliştirme Ortamını Başlatın
```bash
pnpm dev
```

### 3. Test Paketini Çalıştırın
```bash
pnpm test
```

### 4. Üretim Yapısını Derleyin (Build)
```bash
pnpm build
```

---

## 🤖 AI Mimarisi (AI Architecture)

Sistem, yapay zekâyı tek bir sağlayıcıya bağlamayan **Provider Adapter Pattern** ve **Çift AI Motoru (Dual AI Engine)** üzerine inşa edilmiştir:

1. **AI-1 (Profil Analiz Motoru):** Kullanıcı mesaj gönderdiğinde arka planda sessizce çalışır. Çalışma saatleri, stres düzeyi, zayıf/güçlü ders değişimlerini yakalayarak öğrenci profilini günceller.
2. **AI-2 (Öğrenci Koçu Motoru):** Öğrencinin son mesajını, geçmişini, profil verilerini ve müfredat durumunu harmanlayarak kişiselleştirilmiş tek yanıt üretir.
3. **Context Optimizer & Token Economy:** Profile Hash üreterek değişmeyen verileri tekrar veritabanından çekmez; token maliyetlerini düşürür ve bütçe sınırlarını denetler.

---

## 🗄️ Veritabanı Mimarisi (Database Architecture)

* **Repository Pattern:** Kod içerisinde hiçbir bileşen veritabanı sürücüsüne veya Supabase SDK'sına doğrudan bağımlı değildir.
* **Audit & Soft Delete:** Tüm veri değişiklikleri audit log'a kaydedilir (`created_at`, `updated_at`, `deleted_at`, `version`).
* **VPS Esnekliği:** İleride Supabase'den özel VPS PostgreSQL sunucusuna geçildiğinde sadece `DatabaseFactory` adaptörü değiştirilir.

---

## 🐳 Docker & VPS Geçiş Stratejisi

Uygulama Docker containerizasyonuna uygun geliştirilmiştir.
* **Aşama 1 (MVP):** Vercel / Firebase / Supabase altyapısı.
* **Aşama 2 (Enterprise VPS):** Docker Compose + Nginx Reverse Proxy + Ubuntu VPS + PM2 + PostgreSQL.

---

## 🔒 Güvenlik & CI/CD (Security & Quality Gates)

* **Zero Trust:** Tüm istekler role (RBAC) ve yetkiye (Permission) göre denetlenir.
* **Input Sanitization:** Kullanıcı girdileri XSS ve Script Injection'a karşı temizlenir.
* **CI Pipeline:** Her commit otomatik typecheck, linting ve `pnpm test` işlemlerinden geçer.

---

## 📄 Lisans (License)

Tüm hakları saklıdır © 2026 AI SaaS Student Coach Platform.
