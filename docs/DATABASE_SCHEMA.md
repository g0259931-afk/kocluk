# DATABASE SCHEMA

Proje başlangıçta Supabase PostgreSQL kullanacaktır. Tüm tablolar UUID kullanacaktır (Auto Increment yasaktır).

## Temel Tablolar ve Zorunlu Alanlar

Her tabloda bulunması zorunlu audit alanları:
- `id` (UUID, Primary Key)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- `deleted_at` (Timestamp, Soft Delete için)
- `created_by` (UUID)
- `updated_by` (UUID)
- `version` (Integer)
- `status` (String)

## Başlıca Entity Yapıları

### 1. `users`
- `id`: UUID
- `email`: VARCHAR (Unique)
- `name`: VARCHAR
- `role`: VARCHAR (Free, Premium, Admin)

### 2. `subscriptions`
- `id`: UUID
- `user_id`: UUID (FK -> users)
- `plan_type`: VARCHAR
- `start_date`: Timestamp
- `end_date`: Timestamp

### 3. `token_wallets`
- `id`: UUID
- `user_id`: UUID (FK -> users)
- `total_tokens`: INT
- `used_tokens`: INT
- `remaining_tokens`: INT

### 4. `lessons`
- `id`: UUID
- `user_id`: UUID (FK -> users)
- `name`: VARCHAR
- `status`: VARCHAR (Başlanmadı, Devam Ediyor, Tekrar Edilecek, Tamamlandı)
