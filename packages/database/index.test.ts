import { test } from 'node:test';
import assert from 'node:assert';
import { DatabaseFactory, SimulatedDatabaseStore } from './index';
import { UserRole } from '@saas-coach/types';

test('DatabaseFactory creates Supabase adapter and operates on mock store', async () => {
  const dbAdapter = DatabaseFactory.create('supabase');
  assert.ok(dbAdapter);

  // Test finding default bootstrapped user
  const user = await dbAdapter.findById('default_student_user');
  assert.ok(user);
  assert.strictEqual(user?.email, 'student@example.com');
  assert.strictEqual(user?.firstName, 'Şahin');

  // Test student profile retrieval
  const profile = await dbAdapter.findProfileByUserId('default_student_user');
  assert.ok(profile);
  assert.strictEqual(profile?.school_level, 'YKS');
  assert.strictEqual(profile?.target_university, 'Boğaziçi Üniversitesi');

  // Test lesson retrieval
  const lessons = await dbAdapter.findAllByUserId('default_student_user');
  assert.ok(lessons.length >= 2);
  assert.strictEqual(lessons[0].name, 'Matematik');

  // Test soft delete user
  const newUser = await dbAdapter.saveUser({
    id: 'test_user_soft_delete',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    created_by: 'system',
    updated_by: 'system',
    version: 1,
    status: 'active',
    email: 'softdelete@example.com',
    firstName: 'Soft',
    lastName: 'Delete',
    role: UserRole.FREE_USER,
    emailVerified: true
  });

  assert.ok(await dbAdapter.findById('test_user_soft_delete'));
  await dbAdapter.deleteUserSoft('test_user_soft_delete');
  assert.strictEqual(await dbAdapter.findById('test_user_soft_delete'), null);

  // Test audit log
  await dbAdapter.logAction('default_student_user', 'LOGIN', { action: 'test_login' });
  assert.ok(SimulatedDatabaseStore.auditLogs.length > 0);
  const lastLog = SimulatedDatabaseStore.auditLogs[SimulatedDatabaseStore.auditLogs.length - 1];
  assert.strictEqual(lastLog.action, 'LOGIN');
});
