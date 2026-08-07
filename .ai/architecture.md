# ARCHITECTURE

AI SaaS Student Coach Platformu, Clean Architecture ve Domain Driven Design (DDD) prensiplerini temel alır.

## Sistem Katmanları

```
+--------------------------------------------------------+
|                      Presentation                      |
|                  (Next.js App Router)                  |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                       Controller                       |
|                   (API Route Handler)                  |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                       Application                      |
|                    (Use Cases / Logic)                 |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                         Domain                         |
|             (Entities, Repository Interfaces)          |
+--------------------------------------------------------+
                           |
                           v
+--------------------------------------------------------+
|                     Infrastructure                     |
|           (DB Adapters, Auth Providers, AI SDKs)       |
+--------------------------------------------------------+
```

## Abstraction Prensibi
Domain katmanı, altyapı detaylarından (Infrastructure) tamamen bağımsızdır. `Database` ve `Auth` katmanları yalnızca Interface'ler üzerinden çağrılır. Bu sayede Vercel/Firebase/Supabase'den lokal VPS ve PostgreSQL Docker container'larına geçerken Domain katmanındaki iş kurallarına (use cases) dokunulmaz.
