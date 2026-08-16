/**
 * @file tests/auth.test.ts
 * @description Auth paketi için birim testleri (Unit Tests for Auth Package).
 * Node.js yerel test koşucusu (node:test) ve assert modülü kullanılır.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  CryptoJwtEngine,
  FirebaseAuthAdapter,
  CustomJWTAuthAdapter,
  AuthServiceFactory
} from '@saas-coach/auth';
import { UserRole } from '@saas-coach/types';

describe('Auth Package Tests', () => {
  describe('CryptoJwtEngine', () => {
    it('HMAC-SHA256 JWT token üretmeli ve başarılı bir şekilde doğrulamalıdır', () => {
      const payload = {
        userId: 'usr_test_123',
        email: 'test@example.com',
        role: UserRole.FREE_USER,
        permissions: ['permission.user.read']
      };

      const token = CryptoJwtEngine.sign(payload, 3600);
      assert.ok(typeof token === 'string');
      assert.strictEqual(token.split('.').length, 3);

      const decoded = CryptoJwtEngine.verify(token);
      assert.ok(decoded !== null);
      assert.strictEqual(decoded.userId, payload.userId);
      assert.strictEqual(decoded.email, payload.email);
      assert.strictEqual(decoded.role, payload.role);
    });

    it('Geçersiz veya bozulmuş bir token doğrulandığında null dönmelidir', () => {
      const invalidToken = 'header.payload.invalid_signature';
      const result = CryptoJwtEngine.verify(invalidToken);
      assert.strictEqual(result, null);
    });

    it('Süresi dolmuş bir token doğrulandığında null dönmelidir', async () => {
      const payload = { userId: 'usr_expired' };
      // 0 saniye geçerlilik süresi (anında zaman aşımı)
      const token = CryptoJwtEngine.sign(payload, -10);
      const decoded = CryptoJwtEngine.verify(token);
      assert.strictEqual(decoded, null);
    });
  });

  describe('FirebaseAuthAdapter', () => {
    const authAdapter = new FirebaseAuthAdapter();

    it('Email ile kayıt olma işlemi geçerli UserEntity oluşturmalıdır', async () => {
      const user = await authAdapter.signUpWithEmail(
        'newstudent@example.com',
        'securePass123!',
        'Ahmet',
        'Yılmaz'
      );

      assert.ok(user.id.startsWith('fb_usr_'));
      assert.strictEqual(user.email, 'newstudent@example.com');
      assert.strictEqual(user.firstName, 'Ahmet');
      assert.strictEqual(user.lastName, 'Yılmaz');
      assert.strictEqual(user.role, UserRole.FREE_USER);
    });

    it('Email ile giriş yapma geçerli bir AuthSession üretmelidir', async () => {
      const session = await authAdapter.signInWithEmail('student@example.com', 'pass123');

      assert.ok(session.token);
      assert.strictEqual(session.email, 'student@example.com');
      assert.strictEqual(session.role, UserRole.FREE_USER);
      assert.ok(session.expiresAt > Date.now());
    });

    it('Üretilen session token validateSession ile doğrulanabilmelidir', async () => {
      const session = await authAdapter.signInWithEmail('student@example.com', 'pass123');
      const validatedSession = await authAdapter.validateSession(session.token);

      assert.ok(validatedSession !== null);
      assert.strictEqual(validatedSession.userId, session.userId);
      assert.strictEqual(validatedSession.email, session.email);
    });

    it('Google ile giriş başarılı session üretmelidir', async () => {
      const session = await authAdapter.signInWithGoogle('mock_google_id_token');
      assert.ok(session.token);
      assert.strictEqual(session.email, 'google_user@gmail.com');
    });
  });

  describe('AuthServiceFactory', () => {
    it('Seçilen sağlayıcı türüne göre doğru adaptör örneğini döndürmelidir', () => {
      const fbService = AuthServiceFactory.create('firebase');
      assert.ok(fbService instanceof FirebaseAuthAdapter);

      const customService = AuthServiceFactory.create('custom');
      assert.ok(customService instanceof CustomJWTAuthAdapter);
    });
  });
});
