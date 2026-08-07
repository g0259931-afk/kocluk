# TEST PLAN

Projede testler sadece kod yazıldıktan sonra yapılan bir işlem değil, tüm geliştirme sürecinin temel bir parçasıdır.

## Test Türleri ve Sorumluluklar

### 1. Unit Tests (Birim Testleri)
- Tüm yardımcı fonksiyonlar (utils), özel kancalar (hooks) ve servislerin (services) en az %80 kod kapsama oranı (code coverage) ile test edilmesi.
- Araç: Vitest / Jest.

### 2. Integration Tests (Entegrasyon Testleri)
- Birden fazla modülün birlikte çalışabilirliğinin doğrulanması (örn: Auth Servisinin veritabanı adapter'ı ile etkileşimi).
- AI Prompt Pipeline birleşimlerinin doğrulanması.

### 3. End-to-End Tests (Uçtan Uca Testler)
- Kullanıcı üyelik akışı, Onboarding Sihirbazı adımları ve Chatbot ile mesajlaşma gibi kritik kullanıcı yolculuklarının test edilmesi.
- Araç: Playwright.

### 4. Regression & Security Tests
- Yeni özelliklerin mevcut sistemi bozmadığından emin olunması için otomatik regresyon testlerinin CI/CD'ye entegre edilmesi.
- OWASP standartlarına uygun otomatik güvenlik taramaları.
