# PROMPT RULES

Sistem içerisindeki tüm prompt'lar kesinlikle kod içerisine yazılmayacak, Admin Panelinden yönetilecek ve versiyonlanacaktır.

## Prompt Türleri
1. **Global System Prompt:** AI'ın temel çalışma sınırları, güvenlik kuralları ve yanıt formatı standardı.
2. **AI Persona Prompt:** Öğrencinin seviyesine göre (İlkokul için daha basit ve eğlenceli, TYT/YKS için hedef odaklı, Üniversite için teknik ve ciddi) üslup ayarı.
3. **Profil Analiz Promptu (AI-1):** Kullanıcı mesajlarından arka planda sessizce bilgi çıkaran ve öğrenci profil alanlarını güncelleyen motor kuralları.
4. **Çalışma Koçu Promptu (AI-2):** Öğrenciye haftalık çalışma planı, günün hedefleri ve motivasyon desteği sağlayan motor kuralları.

## Prompt Versiyon Kontrolü
Her prompt güncellendiğinde:
- Sürüm numarası artırılmalıdır (örn: v1 -> v2).
- Güncelleme tarihi ve değişiklik notu kaydedilmelidir.
- İstenildiği takdirde tek tıkla eski prompt versiyonuna geri dönülebilmelidir (Rollback).
