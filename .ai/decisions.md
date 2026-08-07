# DECISIONS

## Karar No: DEC-001
### Konu: Monorepo ve Workspace Mimarisi
- **Karar:** Proje `apps/` ve `packages/` dizinlerini içeren NPM/PNPM Workspace monorepo yapısında kuruldu. Derleme ve görev yönetimi için `TurboRepo` tercih edildi.
- **Sebep:** Farklı uygulamaların (`apps/web`, `apps/admin`, `apps/backend`) tek bir yapıda kod tekrarı olmadan ortak tipleri, yardımcı kütüphaneleri ve servisleri paylaşabilmesi.
- **Gelecek Planı:** VPS geçişi ve Dockerize etme aşamasında her bir app bağımsız Docker Container'lara ayrıştırılacak.

## Karar No: DEC-002
### Konu: Firebase ve Supabase Abstraction Katmanları
- **Karar:** Uygulama içerisinde hiçbir Component veya Hook doğrudan Firebase ya da Supabase SDK'sına bağımlı olmayacak. Tüm etkileşimler Interface'ler ve Adapter Pattern (Repository) arkasında soyutlanacak.
- **Sebep:** İleride Firebase Auth'tan kendi JWT sistemimize ya da Supabase'den lokal PostgreSQL/MySQL veritabanına geçerken uygulamanın geri kalan koduna dokunmadan sadece Adapter'ları değiştirebilmek.
