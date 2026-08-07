# API DOCUMENTATION

Tüm API yanıtları tek tip bir format standardını takip edecektir.

## API Response Standartları

### Başarılı Cevap Formatı
```json
{
  "success": true,
  "data": {},
  "message": "",
  "meta": {},
  "timestamp": "2026-08-07T12:00:00Z"
}
```

### Hatalı Cevap Formatı
```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Geçersiz kimlik bilgileri.",
    "details": []
  },
  "timestamp": "2026-08-07T12:00:00Z"
}
```

## Ana Endpointler (v1)

### 1. Kimlik Doğrulama (`/api/v1/auth`)
- `POST /api/v1/auth/register` - Yeni kullanıcı kaydı.
- `POST /api/v1/auth/login` - Oturum açma (Rate limit: 5/dk).

### 2. Chat & AI (`/api/v1/chat`)
- `POST /api/v1/chat/message` - Yeni sohbet mesajı gönderimi ve streaming yanıtı.
- `GET /api/v1/chat/history` - Sohbet geçmişini listeleme.

### 3. Dersler (`/api/v1/lessons`)
- `GET /api/v1/lessons` - Kullanıcının derslerini listeleme.
- `POST /api/v1/lessons` - Yeni ders ekleme.
