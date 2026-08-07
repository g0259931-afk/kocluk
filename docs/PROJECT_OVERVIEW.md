# PROJECT OVERVIEW

Bu proje; Türkiye'deki ilkokul, ortaokul, lise, TYT, AYT, YKS, üniversite ve mezun öğrencilerine hitap eden, yapay zekâ destekli, premium seviyede ölçeklenebilir, yüksek güvenlikli ve çok büyük bir AI SaaS Öğrenci Koçluğu Platformudur.

## Temel Amaç ve Vizyon
Bu ürün yalnızca basit bir chatbot değildir; öğrencinin eğitim hayatını uçtan uca yöneten, onu tanıyan, gelişimini takip eden, eksiklerini analiz eden, dinamik çalışma planı hazırlayan ve uzun vadeli hafızaya sahip olan yapay zekâ destekli dijital bir eğitim koçudur.
Amaç, öğrencinin "Bugün ne çalışacağım?" sorusunu bir daha sormamasıdır.

## Mimari Yapı ve Yazılım Felsefesi
Sistem, Clean Architecture, Domain Driven Design (DDD) ve Feature-Sliced Design (FSD) prensipleriyle tasarlanmıştır. Sürdürülebilirlik için SOLID, DRY, KISS ve YAGNI kuralları sıkı bir şekilde uygulanmıştır.
Bütün veritabanı sorguları Repository Pattern ile soyutlanmış olup, Firebase Auth ve Supabase PostgreSQL gibi dış servisler Provider Adapter ve Abstraction katmanları arkasında gizlenmiştir.
Böylece ileride sıfır kod değişimi ile kendi VPS mimarimize geçiş yapılabilecektir.
