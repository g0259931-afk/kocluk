import { test } from 'node:test';
import assert from 'node:assert';
import { AuthServiceFactory, CryptoJwtEngine } from './index';
import { UserRole } from '@saas-coach/types';

test('AuthServiceFactory creates Firebase adapter and validates JWT sessions', async () => {
  const authService = AuthServiceFactory.create('firebase');
  assert.ok(authService);

  const session = await authService.signInWithEmail('test@example.com', 'password123');
  assert.ok(session.token);
  assert.strictEqual(session.email, 'test@example.com');
  assert.strictEqual(session.role, UserRole.FREE_USER);

  const validSession = await authService.validateSession(session.token);
  assert.ok(validSession);
  assert.strictEqual(validSession?.email, 'test@example.com');

  const invalidSession = await authService.validateSession('invalid.token.structure');
  assert.strictEqual(invalidSession, null);
});

test('CryptoJwtEngine correctly signs and verifies tokens', () => {
  const payload = { userId: 'usr_123', role: 'admin' };
  const token = CryptoJwtEngine.sign(payload, 3600);
  assert.ok(token);

  const verified = CryptoJwtEngine.verify(token);
  assert.ok(verified);
  assert.strictEqual(verified?.userId, 'usr_123');
  assert.strictEqual(verified?.role, 'admin');
});
