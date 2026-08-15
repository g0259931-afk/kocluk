/**
 * @file tests/ai.test.ts
 * @description AI Paketinin birim ve entegrasyon testleri.
 * Dual AI Engine (AI-1 profil analizi + AI-2 koç motoru), Prompt Pipeline, Token Economy ve Context Optimizer işlevlerini sınar.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  DualAIEngine,
  PromptPipelineBuilder,
  ContextOptimizer,
  TokenEconomyEngine
} from '@saas-coach/ai';
import { StudentProfileEntity, LessonEntity } from '@saas-coach/types';

describe('AI Package Unit Tests', () => {
  const mockProfile: StudentProfileEntity = {
    id: 'prof_test',
    user_id: 'usr_test',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_test_1',
    birth_year: 2007,
    city: 'Ankara',
    school_level: 'YKS',
    school_type: 'Anadolu Lisesi',
    graduation_status: false,
    target_exam: 'YKS Sayısal',
    target_university: 'İTÜ',
    target_department: 'Yazılım Mühendisliği',
    current_net_score: 80,
    target_net_score: 110,
    strongest_lesson: 'Matematik',
    weakest_lesson: 'Fizik',
    prefers_morning: true,
    prefers_night: false,
    avg_daily_study_minutes: 180,
    break_frequency_minutes: 45,
    phone_usage_level: 'low',
    study_environment: 'quiet',
    motivation_level: 70,
    anxiety_level: 40,
    self_confidence_level: 75,
    stress_level: 50,
    procrastination_tendency: 30,
    focus_duration_minutes: 50,
    discipline_score: 85,
    prefers_visual: true,
    prefers_auditory: false,
    prefers_writing: true,
    prefers_video: true,
    prefers_pdf: true,
    prefers_tests: true,
    preferred_tone: 'coaching',
    emoji_allowed: true,
    detailed_answers: false,
    humor_allowed: true,
    preferred_address: 'Ahmet',
    sleep_time: '23:00',
    wake_time: '07:00',
    does_sport: true,
    caffeine_intake_level: 'medium',
    weekly_free_hours: 10,
    confidence_scores: {}
  };

  const mockLessons: LessonEntity[] = [
    {
      id: 'les_1',
      user_id: 'usr_test',
      name: 'Matematik',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      status: 'in_progress'
    }
  ];

  test('DualAIEngine - AI-1 Profil Analiz Motoru mesajdaki değişimleri yakalamalıdır', async () => {
    // Neden: Kullanıcı mesajındaki geceleğin çalışma tercihinin sessizce profilde güncellendiğini teyit etmek için.
    const aiEngine = new DualAIEngine();
    const userMessage = 'Ben artık geceleri çalışmayı tercih ediyorum, fizik dersinde çok zorlanıyorum.';

    const updates = await aiEngine.runProfileAnalysis(userMessage, mockProfile);
    assert.strictEqual(updates.prefers_night, true, 'Gece çalışma tercihi tespit edilmelidir');
    assert.strictEqual(updates.prefers_morning, false, 'Sabah çalışma tercihi pasife çekilmelidir');
    assert.strictEqual(updates.weakest_lesson, 'Fizik', 'Zayıf ders Fizik olarak güncellenmelidir');
  });

  test('DualAIEngine - AI-2 Koç Motoru dinamik ve kişiselleştirilmiş yanıt üretmelidir', async () => {
    // Neden: Öğrencinin adı, hedefi ve hedeflenen dersine özel dinamik metin oluşturulduğunu sınamak için.
    const aiEngine = new DualAIEngine();
    const userMessage = 'Bugün YKS hedeflerim için ne yapmalıyım?';

    const response = await aiEngine.runCoachEngine(mockProfile, mockLessons, userMessage);
    assert.ok(response.includes('Ahmet'), 'Yanıt öğrencinin ismini içermelidir');
    assert.ok(response.includes('İTÜ'), 'Yanıt hedef üniversiteyi içermelidir');
    assert.ok(response.includes('Yazılım Mühendisliği'), 'Yanıt hedef bölümü içermelidir');
  });

  test('PromptPipelineBuilder - Doğru prompt yapısını oluşturmalıdır', () => {
    // Neden: Prompt Pipeline katmanının öğrenci bağlamını eksiksiz prompt metnine dönüştürdüğünü denetlemek için.
    const coachPrompt = PromptPipelineBuilder.buildCoachPrompt(mockProfile, mockLessons, 'Matematik tekrarı nasıl yapılmalı?');
    assert.ok(coachPrompt.includes('Ahmet'), 'Prompt öğrenci adını taşımalıdır');
    assert.ok(coachPrompt.includes('YKS Sayısal'), 'Prompt hedef sınavı taşımalıdır');
  });

  test('ContextOptimizer - Token boyutunu sınırlandırabilmelidir', () => {
    // Neden: Aşırı uzun prompt metinlerinin belirlenen limit içinde özetlenip kırpıldığını doğrulamak için.
    const longText = 'A '.repeat(5000);
    const optimized = ContextOptimizer.optimize(longText, 100);
    assert.ok(optimized.length <= 150, 'Sıkıştırılmış metin limit civarında olmalıdır');
    assert.ok(optimized.includes('[Özetlendi]'), 'Kırpılma işareti eklenmiş olmalıdır');
  });

  test('TokenEconomyEngine - Maliyet hesabı ve bütçe denetimi yapabilmelidir', () => {
    // Neden: AI isteklerinin tahmini dolar maliyetinin doğru hesaplandığını garanti etmek için.
    const cost = TokenEconomyEngine.calculateCost('gpt-4o', 1000, 500);
    assert.ok(cost > 0, 'Hesaplanan maliyet sıfırdan büyük olmalıdır');

    const withinBudget = TokenEconomyEngine.checkBudgetLimit(5000, 100000);
    assert.strictEqual(withinBudget, true, 'Kullanım limiti dahilinde true dönmelidir');
  });
});
