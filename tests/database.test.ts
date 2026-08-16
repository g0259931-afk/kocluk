/**
 * @file tests/database.test.ts
 * @description Database paketi için birim testleri (Unit Tests for Database Package).
 * Node.js yerel test koşucusu (node:test) ve assert modülü kullanılır.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  SupabaseDbAdapter,
  LocalPostgresAdapter,
  DatabaseFactory,
  SimulatedDatabaseStore
} from '@saas-coach/database';
import { UserEntity, UserRole, StudentProfileEntity, LessonEntity } from '@saas-coach/types';

describe('Database Package Tests', () => {
  let dbAdapter: SupabaseDbAdapter;

  beforeEach(() => {
    SimulatedDatabaseStore.reset();
    dbAdapter = new SupabaseDbAdapter();
  });

  describe('User Operations', () => {
    it('Varsayılan kullanıcıyı ID ile bulabilmelidir', async () => {
      const user = await dbAdapter.findById('default_student_user');
      assert.ok(user !== null);
      assert.strictEqual(user.id, 'default_student_user');
      assert.strictEqual(user.firstName, 'Şahin');
    });

    it('Kullanıcıyı email ile bulabilmelidir', async () => {
      const user = await dbAdapter.findByEmail('student@example.com');
      assert.ok(user !== null);
      assert.strictEqual(user.email, 'student@example.com');
    });

    it('Yeni bir kullanıcı kaydedebilmeli ve güncelleyebilmelidir', async () => {
      const newUser: UserEntity = {
        id: 'usr_new_test_1',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        created_by: 'system',
        updated_by: 'system',
        version: 1,
        status: 'active',
        email: 'testuser@test.com',
        firstName: 'Ali',
        lastName: 'Can',
        role: UserRole.FREE_USER,
        emailVerified: true
      };

      const saved = await dbAdapter.saveUser(newUser);
      assert.strictEqual(saved.id, 'usr_new_test_1');
      assert.strictEqual(saved.version, 2);

      const fetched = await dbAdapter.findById('usr_new_test_1');
      assert.ok(fetched !== null);
      assert.strictEqual(fetched.email, 'testuser@test.com');
    });

    it('Soft delete kullanıcıyı silinmiş olarak işaretlemeli ve getirilemez yapmalıdır', async () => {
      await dbAdapter.deleteUserSoft('default_student_user');
      const user = await dbAdapter.findById('default_student_user');
      assert.strictEqual(user, null);
    });
  });

  describe('Student Profile Operations', () => {
    it('Kullanıcı ID sine göre öğrenci profilini bulabilmelidir', async () => {
      const profile = await dbAdapter.findProfileByUserId('default_student_user');
      assert.ok(profile !== null);
      assert.strictEqual(profile.preferred_address, 'Şahin');
      assert.strictEqual(profile.strongest_lesson, 'Matematik');
    });

    it('Profil güncellendiğinde versiyon artmalı ve yeni veriler saklanmalıdır', async () => {
      const currentProfile = await dbAdapter.findProfileByUserId('default_student_user');
      assert.ok(currentProfile !== null);

      const updatedProfile: StudentProfileEntity = {
        ...currentProfile,
        target_university: 'İstanbul Teknik Üniversitesi (İTÜ)',
        strongest_lesson: 'Fizik'
      };

      const saved = await dbAdapter.saveProfile(updatedProfile);
      assert.strictEqual(saved.target_university, 'İstanbul Teknik Üniversitesi (İTÜ)');
      assert.strictEqual(saved.strongest_lesson, 'Fizik');
      assert.strictEqual(saved.version, currentProfile.version + 1);
    });
  });

  describe('Lesson Operations', () => {
    it('Kullanıcıya ait aktif dersleri getirmelidir', async () => {
      const lessons = await dbAdapter.findAllByUserId('default_student_user');
      assert.ok(Array.isArray(lessons));
      assert.strictEqual(lessons.length, 2);
    });

    it('Yeni ders ekleyebilmeli ve güncelleyebilmelidir', async () => {
      const newLesson: LessonEntity = {
        id: 'lesson_3',
        user_id: 'default_student_user',
        name: 'Kimya',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'in_progress'
      };

      await dbAdapter.saveLesson(newLesson);
      const lessons = await dbAdapter.findAllByUserId('default_student_user');
      assert.strictEqual(lessons.length, 3);
      assert.ok(lessons.some(l => l.name === 'Kimya'));
    });

    it('Soft delete dersi listeden kaldırmalıdır', async () => {
      await dbAdapter.deleteLessonSoft('lesson_1');
      const lessons = await dbAdapter.findAllByUserId('default_student_user');
      assert.strictEqual(lessons.length, 1);
      assert.strictEqual(lessons[0].id, 'lesson_2');
    });
  });

  describe('Audit Log & Factory Tests', () => {
    it('Audit log işlemi doğru bir şekilde kaydedilmelidir', async () => {
      const initialCount = SimulatedDatabaseStore.auditLogs.length;
      await dbAdapter.logAction('user_123', 'USER_LOGIN', { method: 'email' }, '192.168.1.1', 'Chrome');

      assert.strictEqual(SimulatedDatabaseStore.auditLogs.length, initialCount + 1);
      const lastLog = SimulatedDatabaseStore.auditLogs[SimulatedDatabaseStore.auditLogs.length - 1];
      assert.strictEqual(lastLog.action, 'USER_LOGIN');
      assert.strictEqual(lastLog.userId, 'user_123');
    });

    it('DatabaseFactory doğru sağlayıcı türünü örneklendirmelidir', () => {
      const supabase = DatabaseFactory.create('supabase');
      assert.ok(supabase instanceof SupabaseDbAdapter);

      const local = DatabaseFactory.create('local');
      assert.ok(local instanceof LocalPostgresAdapter);
    });
  });
});
