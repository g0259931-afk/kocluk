/**
 * @file tests/ai.test.ts
 * @description Çift Yapay Zekâ Motoru (AI-1 Profil Analiz & AI-2 Öğrenci Koçu), AI Gateway,
 * Token Ekonomi Motoru ve Context Optimizer bileşenlerinin doğruluğunu sınayan birim testleri (Unit Tests).
 * `packages/ai` içerisindeki karmaşık mantıksal NLP ve optimizasyon süreçlerini doğrular.
 */

import test from 'node:test';
import assert from 'node:assert';
import {
  DualAIEngine,
  TokenEconomyEngine,
  ContextOptimizer,
  PromptPipelineBuilder,
  AIGateway
} from '../packages/ai/index';
import { StudentProfileEntity, LessonEntity } from '../packages/types/index';

test('DualAIEngine (AI-1) - Sessiz Profil Analiz Motorunun keyword ve NLP eşleştirmelerini doğrular', async () => {
  const engine = new DualAIEngine();

  // Test için temiz bir boş profil oluşturuluyor
  const initialProfile: StudentProfileEntity = {
    id: 'test_student_profile_1',
    user_id: 'usr_test_1',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_test_1',
    school_level: 'YKS',
    target_exam: 'YKS',
    target_university: '',
    target_department: '',
    avg_daily_study_minutes: 120,
    strongest_lesson: '',
    weakest_lesson: ''
  };

  // 1. Çalışma Alışkanlığı Eşleştirmesi (Morning / Sabah)
  const updatesMorning = await engine.runProfileAnalysis('Ben her sabah saat 06:30 gibi kalkıp ders çalışmaya başlıyorum.', initialProfile);
  assert.strictEqual(updatesMorning.prefers_morning, true, 'Sabah anahtar kelimesi prefers_morning alanını true yapmalıdır');
  assert.strictEqual(updatesMorning.prefers_night, false, 'Sabah çalışması prefers_night alanını false yapmalıdır');

  // 2. Çalışma Alışkanlığı Eşleştirmesi (Night / Gece)
  const updatesNight = await engine.runProfileAnalysis('Gece geç saatlerde ders çalışmak bana daha verimli geliyor.', initialProfile);
  assert.strictEqual(updatesNight.prefers_morning, false, 'Gece çalışması prefers_morning alanını false yapmalıdır');
  assert.strictEqual(updatesNight.prefers_night, true, 'Gece anahtar kelimesi prefers_night alanını true yapmalıdır');

  // 3. Stres ve Kaygı Seviyesi Yakalama (Psikolojik Analiz - Section 110/113)
  const updatesAnxiety = await engine.runProfileAnalysis('Sınav yaklaştıkça çok stres yapıyorum ve kaygım aşırı arttı.', initialProfile);
  assert.ok(updatesAnxiety.anxiety_level !== undefined && updatesAnxiety.anxiety_level > 30, 'Stres/kaygı kelimeleri kaygı seviyesini artırmalıdır');
  assert.ok(updatesAnxiety.stress_level !== undefined && updatesAnxiety.stress_level > 40, 'Stres/kaygı kelimeleri stres seviyesini artırmalıdır');

  // 4. Güçlü ve Zayıf Dersleri Saptama
  const updatesStrong = await engine.runProfileAnalysis('Matematikte çok iyiyim.', initialProfile);
  assert.strictEqual(updatesStrong.strongest_lesson, 'Matematik', 'İyiyim denilen matematik en güçlü ders olarak saptanmalıdır');

  const updatesWeak = await engine.runProfileAnalysis('Fizik dersinde çok zorlanıyorum, netlerim kötü.', initialProfile);
  assert.strictEqual(updatesWeak.weakest_lesson, 'Fizik', 'Zorlanıyorum/kötü denilen fizik en zayıf ders olarak saptanmalıdır');

  // 5. Hedef Üniversite ve Bölüm Çıkarma
  const updatesTargets = await engine.runProfileAnalysis('Hedefim boğaziçi bilgisayar mühendisliği kazanmak, yazılımcı olmak istiyorum.', initialProfile);
  assert.strictEqual(updatesTargets.target_university, 'Boğaziçi Üniversitesi', 'Boğaziçi kelimesi Boğaziçi Üniversitesi olarak çözümlenmelidir');
  assert.strictEqual(updatesTargets.target_department, 'Bilgisayar Mühendisliği', 'Bilgisayar/yazılımcı kelimeleri Bilgisayar Mühendisliği olarak çözümlenmelidir');
});

test('DualAIEngine (AI-2) - Öğrenci Koçu Motorunun kişiselleştirilmiş çıktı dinamikliğini doğrular', async () => {
  const engine = new DualAIEngine();

  const profile: StudentProfileEntity = {
    id: 'test_student_profile_1',
    user_id: 'usr_test_1',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_test_1',
    school_level: 'YKS',
    target_exam: 'YKS Sayısal',
    target_university: 'Cerrahpaşa',
    target_department: 'Tıp Fakültesi',
    avg_daily_study_minutes: 360,
    strongest_lesson: 'Biyoloji',
    weakest_lesson: 'Fizik',
    prefers_morning: true,
    anxiety_level: 80, // Yüksek kaygı düzeyi
    preferred_address: 'Alp'
  };

  const lessons: LessonEntity[] = [
    { id: 'l1', user_id: 'usr_test_1', name: 'Biyoloji', status: 'completed', created_at: new Date(), updated_at: new Date(), deleted_at: null },
    { id: 'l2', user_id: 'usr_test_1', name: 'Fizik', status: 'weak', created_at: new Date(), updated_at: new Date(), deleted_at: null }
  ];

  const response = await engine.runCoachEngine(profile, lessons, 'Fizik netlerimi nasıl yükseltebilirim?');

  // Yanıtın Alp ismini, hedefini ve zayıf/güçlü derslerini dinamik olarak barındırıp barındırmadığı kontrol ediliyor
  assert.ok(response.includes('Alp'), 'Koç yanıtında öğrencinin hitap adı yer almalıdır');
  assert.ok(response.includes('Cerrahpaşa'), 'Koç yanıtında öğrencinin hedef üniversitesi yer almalıdır');
  assert.ok(response.includes('Tıp Fakültesi'), 'Koç yanıtında öğrencinin hedef bölümü yer almalıdır');
  assert.ok(response.includes('Biyoloji'), 'Koç yanıtında öğrencinin güçlü olduğu ders yer almalıdır');
  assert.ok(response.includes('Fizik'), 'Koç yanıtında öğrencinin zayıf olduğu ders yer almalıdır');
  assert.ok(response.includes('stres'), 'Yüksek kaygı düzeyindeki öğrenciye özel stres hafifletici hitap bulunmalıdır');
});

test('TokenEconomyEngine - Yaklaşık işlem maliyeti ve bütçe limitlerini doğrular', () => {
  // Maliyet hesaplaması kontrol ediliyor (Section 119)
  const costGpt4 = TokenEconomyEngine.calculateCost('gpt-4o', 2000, 500);
  // Input: 2000 * 0.005 / 1000 = 0.010, Output: 500 * 0.015 / 1000 = 0.0075 -> Toplam: 0.0175
  assert.strictEqual(costGpt4, 0.0175, 'GPT-4o yaklaşık maliyeti doğru hesaplanmalıdır');

  // Bütçe limit aşımı kontrolü (Section 120)
  const underLimit = TokenEconomyEngine.checkBudgetLimit(240000, 250000);
  assert.strictEqual(underLimit, true, 'Limit altındaki token harcamaları onaylanmalıdır');

  const overLimit = TokenEconomyEngine.checkBudgetLimit(260000, 250000);
  assert.strictEqual(overLimit, false, 'Limiti aşan token harcamaları reddedilmelidir');
});

test('ContextOptimizer - Token boyutunu sınırlandırıp kısaltma yapar', () => {
  const longPrompt = 'A '.repeat(5000); // 5000 karakterlik uzun metin
  const optimized = ContextOptimizer.optimize(longPrompt, 1000);

  assert.ok(optimized.length <= 1100, 'Context Optimizer uzun promptları belirlenen limite göre daraltmalıdır');
  assert.ok(optimized.includes('[Özetlendi]'), 'Daraltılan promptlarda "[Özetlendi]" ibaresi bulunmalıdır');
});

test('PromptPipelineBuilder - Prompt parçalarını kurallara göre birleştirir', () => {
  const profile: StudentProfileEntity = {
    id: 'test_p_1',
    user_id: 'usr_1',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_1',
    school_level: 'YKS',
    preferred_address: 'Mete',
    target_exam: 'YKS Sayısal',
    strongest_lesson: 'Matematik',
    weakest_lesson: 'Biyoloji'
  };

  const lessons: LessonEntity[] = [];

  const coachPrompt = PromptPipelineBuilder.buildCoachPrompt(profile, lessons, 'Deneme sınavına nasıl odaklanabilirim?');

  assert.ok(coachPrompt.includes('Mete'), 'Prompt içeriğinde öğrenci adı Mete bulunmalıdır');
  assert.ok(coachPrompt.includes('Matematik'), 'Prompt içeriğinde en güçlü ders bulunmalıdır');
  assert.ok(coachPrompt.includes('Biyoloji'), 'Prompt içeriğinde en zayıf ders bulunmalıdır');
  assert.ok(coachPrompt.includes('Deneme sınavına nasıl odaklanabilirim?'), 'Prompt içeriğinde son kullanıcı sorusu bulunmalıdır');
});
