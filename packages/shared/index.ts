/**
 * @file packages/shared/index.ts
 * @description Proje genelinde frontend ve backend uygulamalarında ortak kullanılan
 * sabitler (constants), doğrulamalar ve ortak tipleri dışa aktaran modül.
 */

import { UserRole } from '@saas-coach/types';

/**
 * Uygulama genelindeki tasarım teması renk sabitleri.
 * HEX kodları doğrudan component'ler içerisine yazılmamalı, buradan beslenmelidir.
 */
export const DesignTokens = {
  colors: {
    primary: '#1E40AF', // Derin Mavi
    secondary: '#3B82F6', // Elektrik Mavi
    accent: '#8B5CF6', // Mor
    success: '#10B981', // Yeşil (Başarılı)
    warning: '#F59E0B', // Turuncu (Uyarı)
    error: '#EF4444', // Kırmızı (Hata)
    info: '#3B82F6', // Açık Mavi (Bilgi)
    disabled: '#9CA3AF', // Gri (Devre Dışı)
    glassBackground: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(255, 255, 255, 0.12)'
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      title: '2.25rem'
    }
  },
  animationDurations: {
    pageTransition: '250ms',
    hoverEffect: '150ms',
    modalOpen: '250ms',
    toastFade: '180ms'
  }
};

/**
 * Varsayılan Onboarding Sihirbazı Adımları.
 */
export const OnboardingSteps = [
  { step: 1, label: 'İsim ve Soyisim' },
  { step: 2, label: 'Sınıf Seviyesi' },
  { step: 3, label: 'Hedef Sınav' },
  { step: 4, label: 'Hedef Üniversite / Bölüm' },
  { step: 5, label: 'Günlük Çalışma Süresi' },
  { step: 6, label: 'Eksik Hissettiğiniz Dersler' },
  { step: 7, label: 'Bildirim İzinleri' },
  { step: 8, label: 'Kurulum Tamamlandı!' }
];

/**
 * Kullanıcı rolleri bazında izin listesini döndürür.
 * @param role - Denetlenecek kullanıcı rolü
 * @returns İzin verilen yetki listesi dizisi
 */
export function getPermissionsByRole(role: string): string[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        'permission.user.read',
        'permission.user.update',
        'permission.user.delete',
        'permission.ai.use',
        'permission.ai.admin',
        'permission.payment.read',
        'permission.analytics.read',
        'permission.settings.update',
        'permission.prompt.update'
      ];
    case UserRole.PREMIUM_USER:
      return [
        'permission.user.read',
        'permission.ai.use',
        'permission.analytics.read',
        'permission.settings.update'
      ];
    case UserRole.FREE_USER:
    default:
      return [
        'permission.user.read',
        'permission.ai.use',
        'permission.settings.update'
      ];
  }
}
