# COMPONENT GUIDELINES

Bileşen tasarımı ve geliştirme kuralları.

## Genel Kurallar
1. **Tek Sorumluluk (Single Responsibility):** Her bileşen yalnızca bir görevi yerine getirmelidir.
2. **Kod Sınırı:** Bir bileşen (Component) dosyası 300 satırı geçiyorsa, mantıksal alt parçalara bölünmelidir.
3. **Yapısal Ayrım:** UI, Business Logic (Custom Hooks), Stil tanımlamaları ve Tipler (Types) farklı dosyalarda veya net bölümlerde tutulmalıdır.
4. **Ortak Bileşenler (Shared Packages):** Tekrar eden Button, Input, Modal, Toast, Badge, Skeleton, Spinner vb. bileşenler `packages/ui` veya `packages/shared` altında tek noktadan yönetilecektir.

## Klasör Yapısı Örneği
```
features/chat/
  ├── components/
  │     ├── ChatWindow.tsx
  │     └── MessageItem.tsx
  ├── hooks/
  │     └── useChatStream.ts
  ├── services/
  │     └── chatService.ts
  └── types/
        └── chat.types.ts
```
