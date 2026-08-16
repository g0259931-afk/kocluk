/**
 * @file tests/ai.test.ts
 * @description AI paketi için birim testleri (Unit Tests for AI Package).
 * Node.js yerel test koşucusu (node:test) ve assert modülü kullanılır.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  DualAIEngine,
  AIGateway,
  PromptPipelineBuilder,
  ContextOptimizer,
  TokenEconomyEngine,
  OpenAIAdapter,
  ClaudeAdapter,
  DeepSeekAdapter
} from '@saas-coach/ai';
import { StudentProfileEntity, LessonEntity } from '@saas-coach/types';

describe('AI Package Tests', () => {
  let mockProfile: StudentProfileEntity;
  let mockLessons: LessonEntity[];

  beforeEach(() => {
    mockProfile = {
      id: 'profile_test',
      user_id: 'user_test',
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
      profile_hash: 'hash_123',
      birth_year: 2008,
      city: 'İstanbul',
      school_level: 'YKS',
      school_type: 'Anadolu Lisesi',
      graduation_status: false,
      target_exam: 'YKS Sayısal',
      target_university: 'Boğaziçi Üniversitesi',
      target_department: 'Bilgisayar Mühendisliği',
      current_net_score: 80,
      target_net_score: 110,
      strongest_lesson: 'Matematik',
      weakest_lesson: 'Fizik',
      prefers_morning: true,
      prefers_night: false,
      avg_daily_study_minutes: 180,
      break_frequency_minutes: 45,
      phone_usage_level: 'medium',
      study_environment: 'quiet',
      motivation_level: 70,
      anxiety_level: 40,
      self_confidence_level: 75,
      stress_level: 40,
      procrastination_tendency: 20,
      focus_duration_minutes: 45,
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
      preferred_address: 'Mehmet',
      sleep_time: '23:00',
      wake_time: '07:00',
      does_sport: true,
      caffeine_intake_level: 'medium',
      weekly_free_hours: 10,
      confidence_scores: { strongest_lesson: 90 }
    };

    mockLessons = [
      {
        id: 'l_1',
        user_id: 'user_test',
        name: 'Matematik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'in_progress'
      },
      {
        id: 'l_2',
        user_id: 'user_test',
        name: 'Fizik',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        status: 'weak'
      }
    ];
  });

  describe('DualAIEngine', () => {
    const dualAIEngine = new DualAIEngine();

    it('AI-1 (Profile Analysis Motor) - Gece çalışması ve fizik güçlüğü ifadelerini analiz etmelidir', async () => {
      const userMessage = 'Son zamanlarda fizik dersinde çok zorlanıyorum, geceleri daha iyi çalışıyorum.';
      const updates = await dualAIEngine.runProfileAnalysis(userMessage, mockProfile);

      assert.strictEqual(updates.prefers_morning, false);
      assert.strictEqual(updates.prefers_night, true);
      assert.strictEqual(updates.weakest_lesson, 'Fizik');
    });

    it('AI-1 (Profile Analysis Motor) - Stres ve başaramama korkusu durumlarında duygusal göstergeleri güncellemelidir', async () => {
      const userMessage = 'Çok stresliyim, galiba sınavda başaramayacağım ve hedefime ulaşamayacağım.';
      const updates = await dualAIEngine.runProfileAnalysis(userMessage, mockProfile);

      assert.ok(updates.stress_level! > mockProfile.stress_level!);
      assert.ok(updates.anxiety_level! > mockProfile.anxiety_level!);
      assert.ok(updates.self_confidence_level! < mockProfile.self_confidence_level!);
    });

    it('AI-2 (Student Coach Engine) - Öğrenci profili ve mesajına özel akıcı yanıt üretmelidir', async () => {
      const userMessage = 'Bugün 2 saat matematik çalıştım, sıradaki adım nedir?';
      const response = await dualAIEngine.runCoachEngine(mockProfile, mockLessons, userMessage);

      assert.ok(typeof response === 'string');
      assert.ok(response.includes('Mehmet'));
      assert.ok(response.includes('Boğaziçi Üniversitesi'));
      assert.ok(response.includes('Matematik'));
    });
  });

  describe('AIGateway & Provider Fallback', () => {
    it('Sırasıyla tanımlanan AI sağlayıcıları fallback düzeniyle çalışabilmelidir', async () => {
      const gateway = new AIGateway();
      const config = {
        modelName: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 500,
        streaming: false,
        timeoutMs: 5000
      };

      const result = await gateway.routeWithFallback(
        ['openai', 'claude', 'deepseek'],
        'Merhaba AI',
        config
      );

      assert.ok(typeof result === 'string');
      assert.ok(result.length > 0);
    });

    it('OpenAIAdapter, ClaudeAdapter ve DeepSeekAdapter fallback modunda güvenli metinler döndürmelidir', async () => {
      const config = {
        modelName: 'test-model',
        temperature: 0.5,
        maxTokens: 200,
        streaming: false,
        timeoutMs: 3000
      };

      const openai = new OpenAIAdapter();
      const claude = new ClaudeAdapter();
      const deepseek = new DeepSeekAdapter();

      const resOpenAI = await openai.generateResponse('Test prompt', config);
      const resClaude = await claude.generateResponse('Test prompt', config);
      const resDeepSeek = await deepseek.generateResponse('Test prompt', config);

      assert.ok(resOpenAI.includes('[OpenAI Fallback]'));
      assert.ok(resClaude.includes('[Claude Fallback]'));
      assert.ok(resDeepSeek.includes('[DeepSeek Fallback]'));
    });
  });

  describe('PromptPipelineBuilder & ContextOptimizer', () => {
    it('PromptPipelineBuilder koç promptunu eksiksiz inşa etmelidir', () => {
      const prompt = PromptPipelineBuilder.buildCoachPrompt(mockProfile, mockLessons, 'Hangi konudan başlamalıyım?');

      assert.ok(prompt.includes('Mehmet'));
      assert.ok(prompt.includes('YKS Sayısal'));
      assert.ok(prompt.includes('Matematik'));
      assert.ok(prompt.includes('Fizik'));
      assert.ok(prompt.includes('Hangi konudan başlamalıyım?'));
    });

    it('ContextOptimizer uzun prompt metinlerini sınırlayarak optimize etmelidir', () => {
      const longText = 'A '.repeat(5000);
      const optimized = ContextOptimizer.optimize(longText, 100);

      assert.ok(optimized.length <= 120);
      assert.ok(optimized.endsWith('... [Özetlendi]'));
    });
  });

  describe('TokenEconomyEngine', () => {
    it('Model ve token sayılarına göre maliyeti doğru hesaplamalıdır', () => {
      const costGpt4 = TokenEconomyEngine.calculateCost('gpt-4o', 1000, 1000);
      assert.strictEqual(costGpt4, 0.02);

      const costGpt35 = TokenEconomyEngine.calculateCost('gpt-3.5-turbo', 1000, 1000);
      assert.strictEqual(costGpt35, 0.0035);
    });

    it('Bütçe limit kontrolünü doğru yapmalıdır', () => {
      assert.strictEqual(TokenEconomyEngine.checkBudgetLimit(5000, 10000), true);
      assert.strictEqual(TokenEconomyEngine.checkBudgetLimit(12000, 10000), false);
    });
  });
});
