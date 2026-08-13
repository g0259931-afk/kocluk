/**
 * @file tests/auth.test.ts
 * @description Kimlik doğrulama, yetkilendirme ve kriptografik JWT süreçlerini denetleyen birim testleri (Unit Tests).
 * `packages/auth` içerisindeki HMAC-SHA256 imza oluşturma, çözme ve FirebaseAuthAdapter metodlarının çalışmasını doğrular.
 */

import test from 'node:test';
import assert from 'node:assert';
import { CryptoJwtEngine, FirebaseAuthAdapter, AuthServiceFactory } from '../packages/auth/index';
import { UserRole } from '../packages/types/index';

test('CryptoJwtEngine - HMAC-SHA256 ile güvenli JWT imzalama ve doğrulamayı sınar', () => {
  const payload = {
    userId: 'fb_usr_mock123',
    email: 'test@student.com',
    role: UserRole.FREE_USER,
    permissions: ['permission.user.read', 'permission.ai.use']
  };

  // 1. JWT oluşturma (Sign)
  const token = CryptoJwtEngine.sign(payload, 3600); // 1 saatlik token
  assert.ok(token, 'Token başarıyla oluşturulmalıdır');
  assert.strictEqual(token.split('.').length, 3, 'JWT token yapısı 3 kısımdan (Header, Payload, Signature) oluşmalıdır');

  // 2. JWT doğrulama (Verify)
  const decoded = CryptoJwtEngine.verify(token);
  assert.ok(decoded, 'Geçerli token başarıyla doğrulanmalıdır');
  assert.strictEqual(decoded.userId, payload.userId, 'Kullanıcı kimliği doğrulanmalıdır');
  assert.strictEqual(decoded.email, payload.email, 'E-posta doğrulanmalıdır');
  assert.strictEqual(decoded.role, payload.role, 'Kullanıcı rolü doğrulanmalıdır');

  // 3. Süresi geçmiş token simülasyonu
  const expiredToken = CryptoJwtEngine.sign(payload, -10); // 10 saniye önce süresi dolmuş
  const expiredDecoded = CryptoJwtEngine.verify(expiredToken);
  assert.strictEqual(expiredDecoded, null, 'Süresi geçmiş token geçersiz sayılmalıdır');

  // 4. Kurcalanmış (Tampered) token doğrulaması (Security First)
  const parts = token.split('.');
  // İmzayı kasıtlı olarak bozuyoruz
  const tamperedToken = `${parts[0]}.${parts[1]}.tampered_signature_12345`;
  const tamperedDecoded = CryptoJwtEngine.verify(tamperedToken);
  assert.strictEqual(tamperedDecoded, null, 'Kriptografik imzası kurcalanmış token kesinlikle reddedilmelidir (Zero Trust)');
});

test('FirebaseAuthAdapter - E-posta/Şifre ve Google Giriş simülasyonunu doğrular', async () => {
  const adapter = new FirebaseAuthAdapter();

  // 1. Yeni kayıt akışı testi
  const newUser = await adapter.signUpWithEmail('yeni@student.com', 'SuperSifre123!', 'Şahin', 'Arslan');
  assert.ok(newUser, 'Yeni kullanıcı başarıyla oluşturulabilmelidir');
  assert.ok(newUser.id.startsWith('fb_usr_'), 'Kullanıcı id öneki fb_usr_ ile başlamalıdır');
  assert.strictEqual(newUser.email, 'yeni@student.com', 'Kullanıcı e-postası eşleşmelidir');
  assert.strictEqual(newUser.firstName, 'Şahin', 'Kullanıcı adı eşleşmelidir');

  // 2. Giriş akışı ve JWT doğrulama entegrasyon testi
  const session = await adapter.signInWithEmail('student@example.com', 'Sifre123');
  assert.ok(session, 'Oturum başarıyla açılmalıdır');
  assert.ok(session.token, 'Oturum kriptografik token içermelidir');
  assert.strictEqual(session.userId, 'fb_usr_mock123', 'Varsayılan mock kullanıcı ID atanmalıdır');

  // Token'ın geçerliliği doğrulanıyor
  const verifiedSession = await adapter.validateSession(session.token);
  assert.ok(verifiedSession, 'Kriptografik olarak imzalanmış oturum tokenı geçerli olmalıdır');
  assert.strictEqual(verifiedSession.userId, session.userId, 'Oturumdaki kullanıcı kimlikleri eşleşmelidir');

  // 3. Google Login doğrulaması
  const googleSession = await adapter.signInWithGoogle('google_mock_id_token_123');
  assert.ok(googleSession, 'Google login oturumu açılabilmelidir');
  assert.strictEqual(googleSession.email, 'google_user@gmail.com', 'Google kullanıcısı e-postası onaylanmalıdır');
});

test('AuthServiceFactory - Doğru sağlayıcı adaptörlerinin üretildiğini denetler', () => {
  const firebaseAuth = AuthServiceFactory.create('firebase');
  assert.ok(firebaseAuth instanceof FirebaseAuthAdapter, 'Firebase seçildiğinde FirebaseAuthAdapter nesnesi üretilmelidir');
});
