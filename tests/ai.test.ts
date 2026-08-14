/**
 * @file tests/ai.test.ts
 * @description Çift Yapay Zekâ Motoru (Dual AI Engine - AI-1 & AI-2), AI Gateway,
 * Prompt Pipeline, Context Optimizer ve Token Ekonomi sistemlerinin doğruluğunu denetleyen test dosyası.
 * Kullanıcı girdilerinden çalışma alışkanlığı ve psikolojik durum çıkarımı ile kişiselleştirilmiş
 * koç yanıtı üretim mekanizmalarını doğrular.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  AIGateway,
  PromptPipelineBuilder,
  ContextOptimizer,
  DualAIEngine,
  TokenEconomyEngine
} from '../packages/ai/index';
import { StudentProfileEntity, LessonEntity } from '@saas-coach/types';

describe('AI Gateway & Dual Engine - Entegrasyon Testleri', () => {
  const aiEngine = new DualAIEngine();

  // Örnek öğrenci profili nesnesi
  const mockProfile: StudentProfileEntity = {
    id: 'prof_test_123',
    user_id: 'usr_test_123',
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
    profile_hash: 'hash_xyz',
    birth_year: 2008,
    city: 'İzmir',
    school_level: 'YKS',
    school_type: 'Anadolu',
    graduation_status: false,
    target_exam: 'YKS Sayısal',
    target_university: 'ODTÜ',
    target_department: 'Yazılım Mühendisliği',
    current_net_score: 80,
    target_net_score: 115,
    strongest_lesson: 'Matematik',
    weakest_lesson: 'Fizik',
    prefers_morning: null,
    prefers_night: null,
    avg_daily_study_minutes: 180,
    break_frequency_minutes: 45,
    phone_usage_level: 'medium',
    study_environment: 'quiet',
    motivation_level: 80,
    anxiety_level: 30,
    self_confidence_level: 80,
    stress_level: 30,
    procrastination_tendency: 15,
    focus_duration_minutes: 45,
    discipline_score: 85,
    prefers_visual: true,
    prefers_auditory: false,
    prefers_writing: true,
    prefers_video: true,
    prefers_pdf: false,
    prefers_tests: true,
    preferred_tone: 'coaching',
    emoji_allowed: true,
    detailed_answers: true,
    humor_allowed: true,
    preferred_address: 'Sahin',
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
      user_id: 'usr_test_123',
      name: 'Matematik',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      status: 'in_progress'
    },
    {
      id: 'les_2',
      user_id: 'usr_test_123',
      name: 'Fizik',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      status: 'weak'
    }
  ];

  // --- AI-1: Profil Analiz Motoru (Sessiz Algılama) ---
  test('AI-1 (Profile Analyser) - Kullanıcı mesajındaki çalışma saatleri alışkanlığını yakalamalıdır', async () => {
    // Neden: Öğrenci chatbotta "gece çalışmayı seviyorum" dediğinde, sistem bunu sessizce algılayıp profilde prefers_night=true yapmalıdır.
    const msg = 'Ben genellikle gece geç saatlerde ders çalışıyorum, o zaman daha iyi odaklanıyorum.';
    const updates = await aiEngine.runProfileAnalysis(msg, mockProfile);

    assert.strictEqual(updates.prefers_night, true);
    assert.strictEqual(updates.prefers_morning, false);
  });

  test('AI-1 (Profile Analyser) - Kullanıcı mesajındaki stres ve kaygı durumlarını yakalayabilmelidir', async () => {
    // Neden: Öğrencinin psikolojik duygu durumu, koçun üreteceği cevabın empati düzeyini belirler.
    const msg = 'Çok stresliyim, sınav yaklaştıkça kaygım aşırı artıyor ve heyecanlanıyorum.';
    const updates = await aiEngine.runProfileAnalysis(msg, mockProfile);

    assert.ok(updates.anxiety_level && updates.anxiety_level > (mockProfile.anxiety_level || 0));
    assert.ok(updates.stress_level && updates.stress_level > (mockProfile.stress_level || 0));
  });

  test('AI-1 (Profile Analyser) - Kullanıcı mesajındaki ders zayıflığı / gücü çıkarımlarını yapmalıdır', async () => {
    // Neden: Öğrencinin hangi derslerde zorlandığını otomatik saptamak, akıllı ders programı optimizasyonu sağlar.
    const msg = 'Fizik dersi benim için çok kötü geçiyor, anlamıyorum ve çok zorlanıyorum.';
    const updates = await aiEngine.runProfileAnalysis(msg, mockProfile);

    assert.strictEqual(updates.weakest_lesson, 'Fizik');
  });

  test('AI-1 (Profile Analyser) - Hedef üniversite ve bölüm değişikliklerini saptayabilmelidir', async () => {
    // Neden: Öğrencinin hedefleri değiştiğinde koçun yönlendirmesi de bu yeni vizyona uyum sağlamalıdır.
    const msg = 'Ben gelecekte Boğaziçi bilgisayar mühendisliği kazanmak istiyorum.';
    const updates = await aiEngine.runProfileAnalysis(msg, mockProfile);

    assert.strictEqual(updates.target_university, 'Boğaziçi Üniversitesi');
    assert.strictEqual(updates.target_department, 'Bilgisayar Mühendisliği');
  });

  // --- AI-2: Koç Motoru (Kişiselleştirilmiş Cevap Üretimi) ---
  test('AI-2 (Student Coach Engine) - Profil verilerine ve ders hiyerarşisine göre dinamik bir koçluk yanıtı üretmelidir', async () => {
    // Neden: AI-2 sadece statik şablonlar değil, öğrencinin adı, hedefleri, zayıf/güçlü dersleri ve kaygı seviyesine göre tamamen kişiye özel bir metin inşa etmelidir.
    const userMessage = 'Bugün fizik dersine nereden başlamalıyım?';

    // Kasıtlı olarak yüksek kaygı ve sabah çalışma tercihi ekliyoruz
    const stressedMorningProfile = {
      ...mockProfile,
      anxiety_level: 85,
      prefers_morning: true
    };

    const response = await aiEngine.runCoachEngine(stressedMorningProfile, mockLessons, userMessage);

    // Yanıtın kişiselleştirilmiş bölümler içerdiğini doğrula
    assert.ok(response.includes('Sahin')); // Öğrenci hitap adı
    assert.ok(response.includes('Yazılım Mühendisliği')); // Hedef bölüm
    assert.ok(response.includes('yük ve stres')); // Yüksek kaygı durumunda empati ön eki
    assert.ok(response.includes('sabah insanı')); // Sabah çalışıyor uyarısı
    assert.ok(response.includes('Fizik')); // Zayıf ders
  });

  // --- CONTEXT OPTIMIZER & PIPELINE ---
  test('ContextOptimizer - Uzun prompt metinlerini belirlenen sınırın altına indirmeli ve sıkıştırmalıdır', () => {
    // Neden: API maliyetlerini ciddi şekilde düşürmek ve token taşmalarını engellemek için bağlam optimize edilir.
    const longPrompt = 'A '.repeat(5000);
    const optimized = ContextOptimizer.optimize(longPrompt, 2000);

    assert.ok(optimized.length <= 2020);
    assert.ok(optimized.endsWith('[Özetlendi]'));
  });

  test('PromptPipelineBuilder - Eğitim koçluğu bağlamına uygun tam bir prompt şeması oluşturmalıdır', () => {
    // Neden: Prompt Pipeline sayesinde tek parçalı dev promptların yerine modüler, yönetilebilir kurallar birleşimi kullanılır.
    const pipelinePrompt = PromptPipelineBuilder.buildCoachPrompt(mockProfile, mockLessons, 'Matematikte ne yapmalıyım?');

    assert.ok(pipelinePrompt.includes('[ÖĞRENCİ BİLGİLERİ]'));
    assert.ok(pipelinePrompt.includes('[DERSLER VE DURUMLARI]'));
    assert.ok(pipelinePrompt.includes('[KULLANICININ SON MESAJI]'));
    assert.ok(pipelinePrompt.includes('ODTÜ'));
  });

  // --- MODEL GATEWAY ROUTING & FALLBACK ---
  test('AIGateway - Başarısız sağlayıcılardan sırayla yedek sağlayıcılara (fallback) geçiş yapmalıdır', async () => {
    // Neden: Herhangi bir AI API sağlayıcısı çöktüğünde veya hata verdiğinde sistem kesintisiz çalışmaya devam etmelidir.
    const gateway = new AIGateway();
    const config = {
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 500,
      streaming: false,
      timeoutMs: 5000
    };

    // 'invalid_provider' adaptörü bulunamayacağından doğrudan sıradaki 'deepseek' sağlayıcısına geçmelidir.
    const response = await gateway.routeWithFallback(
      ['invalid_provider', 'deepseek'],
      'Test prompt',
      config
    );

    assert.ok(response.includes('[DeepSeek Fallback]'));
  });

  // --- TOKEN EKONOMİSİ ---
  test('TokenEconomyEngine - Model tipine göre tahmini işlem maliyetlerini doğru hesaplamalıdır', () => {
    // Neden: Admin panelinde AI bütçelerini izlemek ve maliyet kontrolü sağlamak için her isteğin maliyeti hesaplanır.
    const costGpt4 = TokenEconomyEngine.calculateCost('gpt-4o', 2000, 1000); // 2000 input, 1000 output
    // gpt-4o için: (2000/1000)*0.005 + (1000/1000)*0.015 = 0.010 + 0.015 = 0.025
    assert.strictEqual(costGpt4, 0.025);

    const costGpt3 = TokenEconomyEngine.calculateCost('gpt-3.5-turbo', 2000, 1000);
    // gpt-3.5: (2000/1000)*0.0015 + (1000/1000)*0.002 = 0.003 + 0.002 = 0.005
    assert.strictEqual(costGpt3, 0.005);
  });
});
