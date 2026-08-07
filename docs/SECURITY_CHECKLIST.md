# SECURITY CHECKLIST

Sistem geliştirilirken ve yayına alınmadan önce doğrulanacak zorunlu güvenlik adımları.

## 1. Kimlik Doğrulama & Yetkilendirme (Authentication & RBAC)
- [ ] Firebase Auth Abstraction katmanı üzerinden session kontrolleri tam olarak yapılıyor mu?
- [ ] Yetkiler rol adına göre değil, `permission.user.read` vb. bazında kontrol ediliyor mu?
- [ ] Session timeout yönetimi ve çoklu cihaz girişi kontrolleri aktif mi?

## 2. Girdi Doğrulama & Çıktı Temizleme (OWASP Top 10)
- [ ] Tüm API endpoint'leri girdi doğrulaması (Input Validation) yapıyor mu? (Zod, Joi vb.)
- [ ] HTML, Markdown ve script içerikleri sanitize ediliyor mu? (XSS koruması)
- [ ] SQL Injection koruması için ORM veya parameterized sorgular kullanılıyor mu?

## 3. API & Altyapı Güvenliği
- [ ] Giriş (Login) için dakikada maks 5, Chat için dakikada maks 30 istek Rate Limit devrede mi?
- [ ] API anahtarları `.env` dosyasında saklanıyor ve git deposuna kesinlikle commit edilmiyor mu?
- [ ] Content Security Policy (CSP), CORS ve SameSite secure cookie ayarları doğru yapılandırılmış mı?
- [ ] PDF yükleme işlemlerinde dosya boyutu kontrolü ve sadece `.pdf` uzantı doğrulaması yapılıyor mu?
- [ ] İşlem bittikten sonra PDF'ler sunucu geçici belleğinden otomatik siliniyor mu?
