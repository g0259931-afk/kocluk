/**
 * @file tests/database.test.ts
 * @description Veritabanı (Database) paketinin birim testleri.
 * In-Memory veri deposunun bootstrap verilerini, Supabase adaptörünün kullanıcı ve profil işlemlerini sınar.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DatabaseFactory, SimulatedDatabaseStore, SupabaseDbAdapter } from '@saas-coach/database';
import { UserRole, UserEntity } from '@saas-coach/types';

describe('Database Package Unit Tests', () => {
  test('SimulatedDatabaseStore - Bootstrap verileri hazır olmalıdır', () => {
    // Neden: Çevrimdışı ve test ortamlarında varsayılan veritabanı verilerinin yüklü olmasını garanti etmek için.
    assert.ok(SimulatedDatabaseStore.users.size > 0, 'Varsayılan kullanıcılar yüklü olmalıdır');
    assert.ok(SimulatedDatabaseStore.profiles.size > 0, 'Varsayılan profiller yüklü olmalıdır');

    const defaultUser = SimulatedDatabaseStore.users.get('default_student_user');
    assert.ok(defaultUser, 'Varsayılan test kullanıcısı bulunabilmelidir');
    assert.strictEqual(defaultUser.firstName, 'Şahin');
  });

  test('SupabaseDbAdapter - Kullanıcı kaydetme ve e-posta ile sorgulama', async () => {
    // Neden: Database Repository katmanının kullanıcı işlemlerini doğru şekilde saklayıp getirdiğini doğrulamak için.
    const db = DatabaseFactory.create('supabase');
    assert.ok(db instanceof SupabaseDbAdapter, 'Fabrika Supabase adaptörü üretmelidir');

    const testUser: UserEntity = {
      id: 'usr_test_db_999',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      created_by: 'test',
      updated_by: 'test',
      version: 1,
      status: 'active',
      email: 'dbtest@example.com',
      firstName: 'Ayşe',
      lastName: 'Kaya',
      role: UserRole.FREE_USER,
      emailVerified: true
    };

    await db.saveUser(testUser);
    const fetched = await db.findByEmail('dbtest@example.com');
    assert.ok(fetched, 'Kaydedilen kullanıcı e-posta ile getirilebilmelidir');
    assert.strictEqual(fetched.id, 'usr_test_db_999');
    assert.strictEqual(fetched.firstName, 'Ayşe');
  });

  test('SupabaseDbAdapter - Öğrenci profili sorgulama ve güncelleme', async () => {
    // Neden: AI motorunun profilde yaptığı güncellemelerin veritabanına sorunsuz yazıldığını doğrulamak için.
    const db = DatabaseFactory.create('supabase');
    const profile = await db.findProfileByUserId('default_student_user');
    assert.ok(profile, 'Varsayılan öğrenci profili getirilebilmelidir');
    assert.strictEqual(profile.user_id, 'default_student_user');

    profile.target_net_score = 115;
    await db.saveProfile(profile);

    const updated = await db.findProfileByUserId('default_student_user');
    assert.strictEqual(updated?.target_net_score, 115, 'Profil net hedefi güncellenmiş olmalıdır');
  });
});
