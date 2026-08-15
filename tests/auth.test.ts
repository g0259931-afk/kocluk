/**
 * @file tests/auth.test.ts
 * @description Kimlik doğrulama (Auth) paketinin birim testleri.
 * Kriptografik JWT üretimi/doğrulaması ve Firebase Auth adaptör süreçlerini sınar.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CryptoJwtEngine, AuthServiceFactory, FirebaseAuthAdapter } from '@saas-coach/auth';
import { UserRole } from '@saas-coach/types';

describe('Auth Package Unit Tests', () => {
  test('CryptoJwtEngine - JWT token üretmeli ve doğrulayabilmelidir', () => {
    // Neden: Kriptografik JWT imzası ve verifikasyon yeteneğinin güvenli olduğunu doğrulamak için.
    const payload = {
      userId: 'test_user_123',
      email: 'test@example.com',
      role: UserRole.FREE_USER
    };

    const token = CryptoJwtEngine.sign(payload, 3600);
    assert.ok(token, 'JWT token üretilmiş olmalıdır');
    assert.strictEqual(token.split('.').length, 3, 'JWT token 3 parçadan oluşmalıdır');

    const verified = CryptoJwtEngine.verify(token);
    assert.ok(verified, 'JWT token başarıyla doğrulanmalıdır');
    assert.strictEqual(verified.userId, payload.userId, 'Kullanıcı ID doğru dönmelidir');
    assert.strictEqual(verified.email, payload.email, 'E-posta adresi doğru dönmelidir');
  });

  test('CryptoJwtEngine - Geçersiz token doğrulandığında null dönmelidir', () => {
    // Neden: Bozuk veya tahrif edilmiş token'ların güvenlik açığı yaratmasını önlemek için.
    const invalidToken = 'invalid.jwt.token';
    const verified = CryptoJwtEngine.verify(invalidToken);
    assert.strictEqual(verified, null, 'Geçersiz token için null dönmelidir');
  });

  test('FirebaseAuthAdapter - Kullanıcı kaydı ve oturum açma akışları', async () => {
    // Neden: Auth adaptörünün simüle edilmiş veya gerçek kimlik doğrulama süreçlerini doğru yürütmesini sağlamak için.
    const authService = AuthServiceFactory.create('firebase');
    assert.ok(authService instanceof FirebaseAuthAdapter, 'Fabrika Firebase adaptörü döndürmelidir');

    const newUser = await authService.signUpWithEmail('newstudent@test.com', 'Pass123!', 'Ahmet', 'Yılmaz');
    assert.strictEqual(newUser.email, 'newstudent@test.com');
    assert.strictEqual(newUser.firstName, 'Ahmet');

    const session = await authService.signInWithEmail('newstudent@test.com', 'Pass123!');
    assert.ok(session.token, 'Oturum token içeriyor olmalıdır');
    assert.ok(session.expiresAt > Date.now(), 'Oturum sonlanma tarihi gelecekte olmalıdır');

    const validated = await authService.validateSession(session.token);
    assert.ok(validated, 'Oturum token doğrulamasından geçmelidir');
  });
});
