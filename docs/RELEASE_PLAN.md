# RELEASE PLAN

Sisteme yeni özellikler eklenirken ve güncellemeler canlıya alınırken uygulanacak standart yayınlama adımları.

## Yayınlama Döngüsü (Release Lifecycle)

1. **Geliştirme ve Test:** Özellik branch'inde geliştirme tamamlanır, lokal testler yapılır.
2. **Feature Flag Kontrolü:** Yeni eklenen büyük özellikler başlangıçta `Feature Flag` arkasında kapalı olarak geliştirilir.
3. **Kod İnceleme (Code Review):** Kod kalitesi, mimari uyumu ve güvenlik açıkları kontrol edilir.
4. **Staging Dağıtımı:** Değişiklikler önce test kullanıcıları ve QA ekibi için Staging ortamına deploy edilir.
5. **Kademeli Dağıtım (Canary Release):** Özellik önce %10'luk kullanıcı grubuna açılır, hata logları izlenir.
6. **Genel Dağıtım (Production):** Herhangi bir sorun gözlemlenmezse özellik %100 kullanıcıya açılır.
7. **Rollback (Geri Alma) Planı:** Kritik bir hata tespiti durumunda, sistem kesinti yaşanmadan önceki kararlı sürüme geri çekilecek şekilde yapılandırılır.
