# DECISION LOG

Mimari ve altyapı kararları ile gerekçeleri bu dosyada tutulmaktadır.

- **DEC-001:** Proje NPM/TurboRepo workspace monorepo yapısında kuruldu. Farklı frontend uygulamaları (`apps/web`, `apps/admin`) ve api katmanı (`apps/backend`) tek bir yapıda birleştirilerek ortak bağımlılık paylaşımı sağlandı.
- **DEC-002:** Firebase Auth ve Supabase PostgreSQL doğrudan kullanılmayıp, Abstraction katmanı arkasında Repository ve Adapter pattern ile soyutlandı. Böylece VPS geçiş sürecinde kod değişikliği yapılmasına gerek kalmayacak.
