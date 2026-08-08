/**
 * @file packages/ai/index.ts
 * @description AI Gateway, Çift Yapay Zekâ Motoru (AI-1 & AI-2), Prompt Pipeline ve Token Ekonomi sistemleri.
 * OpenAI, Claude, Gemini ve DeepSeek gibi sağlayıcıları Provider Adapter deseniyle soyutlar.
 */

import { StudentProfileEntity, LessonEntity } from '@saas-coach/types';

// --- PROVIDER ADAPTERS & MODEL ROUTING ---

/**
 * AI Modeli parametre yapılandırması.
 */
export interface AIModelConfig {
  modelName: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  streaming: boolean;
  timeoutMs: number;
}

/**
 * Her sağlayıcının (OpenAI, Claude vb.) uygulaması gereken adaptör arayüzü (IAIAdapter).
 */
export interface IAIAdapter {
  generateResponse(prompt: string, config: AIModelConfig): Promise<string>;
}

export class OpenAIAdapter implements IAIAdapter {
  async generateResponse(prompt: string, config: AIModelConfig): Promise<string> {
    console.log(`[OpenAI API Call] Model: ${config.modelName} | Temp: ${config.temperature}`);
    // OpenAI ChatCompletion API simülasyonu
    return `[OpenAI Response] Sevgili Şahin, bugünkü çalışma planını analiz ettim. Matematik alanında gösterdiğin azim harika. Fizik konusundaki eksikleri kapatmak için bugün 2 saatlik bir çalışma öneriyorum.`;
  }
}

export class ClaudeAdapter implements IAIAdapter {
  async generateResponse(prompt: string, config: AIModelConfig): Promise<string> {
    console.log(`[Claude API Call] Model: ${config.modelName}`);
    return `[Claude Response] Merhaba Şahin, hedefin olan Boğaziçi Bilgisayar için fizik dersindeki netleri 15'e çıkarmalıyız. Bugün mekanik konusundaki alt kazanımlara odaklanalım.`;
  }
}

export class DeepSeekAdapter implements IAIAdapter {
  async generateResponse(prompt: string, config: AIModelConfig): Promise<string> {
    console.log(`[DeepSeek API Call] Model: ${config.modelName}`);
    return `[DeepSeek Response] Analiz tamamlandı. Sabah saatlerindeki odaklanma sürenin yüksek olması nedeniyle en zorlandığın Fizik dersini sabah 08:30-10:00 arasına planladım.`;
  }
}

/**
 * Fallback mekanizmasına sahip Model Router (AI Gateway).
 * Bir model hata verdiğinde otomatik olarak sırayla diğer sağlayıcılara istek atar.
 */
export class AIGateway {
  private adapters: Record<string, IAIAdapter>;

  constructor() {
    this.adapters = {
      openai: new OpenAIAdapter(),
      claude: new ClaudeAdapter(),
      deepseek: new DeepSeekAdapter()
    };
  }

  async routeWithFallback(providerSequence: string[], prompt: string, config: AIModelConfig): Promise<string> {
    for (const provider of providerSequence) {
      try {
        const adapter = this.adapters[provider.toLowerCase()];
        if (adapter) {
          return await adapter.generateResponse(prompt, config);
        }
      } catch (err) {
        console.warn(`[AIGateway] Provider ${provider} failed, trying fallback...`, err);
      }
    }
    throw new Error('Tüm AI sağlayıcıları ve yedek modeller (fallback) başarısız oldu.');
  }
}

// --- PROMPT PIPELINE & CONTEXT OPTIMIZER ---

/**
 * Prompt'ları bir araya getiren dinamik yapıcı (Prompt Pipeline).
 */
export class PromptPipelineBuilder {
  static buildCoachPrompt(
    profile: StudentProfileEntity,
    lessons: LessonEntity[],
    userMessage: string
  ): string {
    const globalSystemPrompt = `Sen Türkiye'deki sınavlara hazırlanan öğrencilere premium koçluk yapan akıllı bir yapay zekâ eğitim koçusun.`;
    const safetyRules = `Gereksiz kişisel veri ifşa etme, sadece eğitim ve rehberlik konularına odaklan.`;
    const studentContext = `
Öğrenci Adı: ${profile.preferred_address || 'Öğrenci'}
Hedef Sınav: ${profile.target_exam || 'Belirtilmedi'}
Hedef Üniversite: ${profile.target_university || 'Belirtilmedi'}
En Güçlü Ders: ${profile.strongest_lesson || 'Matematik'}
En Zayıf Ders: ${profile.weakest_lesson || 'Fizik'}
Öğrenme Profili: ${profile.prefers_visual ? 'Görsel Ağırlıklı' : 'Dengeli'}
Uykudan Uyanma: ${profile.wake_time || '07:00'}
Çalışma Tercihi: ${profile.prefers_morning ? 'Sabah Saatleri' : 'Gece Saatleri'}
    `;
    const lessonsContext = lessons.map(l => `- ${l.name} (Durum: ${l.status})`).join('\n');

    return `
${globalSystemPrompt}
${safetyRules}

[ÖĞRENCİ BİLGİLERİ]
${studentContext}

[DERSLER VE DURUMLARI]
${lessonsContext}

[KULLANICININ SON MESAJI]
"${userMessage}"

Lütfen yukarıdaki tüm bağlamı ve öğrenme tercihlerini göz önünde bulundurarak tek ve akıcı bir koçluk cevabı üret.
    `.trim();
  }

  static buildAnalysisPrompt(userMessage: string, currentProfile: StudentProfileEntity): string {
    return `
Mevcut öğrenci profil alanları: ${JSON.stringify(currentProfile)}

[KULLANICI MESAJI]
"${userMessage}"

Analiz Görevi: Kullanıcının son mesajında çalışma alışkanlığı, zayıf ders, hedef sınav, motivasyon veya uyku düzeni hakkında yeni bir bilgi var mı?
Varsa, yalnızca güncellenmesi gereken alanları JSON formatında dön. Yoksa boş bir JSON dön {}
    `.trim();
  }
}

/**
 * Gönderilen token sayısını optimize eden ve maliyet düşüren sıkıştırma aracı.
 */
export class ContextOptimizer {
  static optimize(prompt: string, maxLimit = 4000): string {
    // Yinelenen boşlukları, gereksiz satırları ve tekrarları temizler
    let clean = prompt.replace(/\s+/g, ' ').trim();
    if (clean.length > maxLimit) {
      console.log(`[ContextOptimizer] Token boyutu sınırlandırılıyor: ${clean.length} -> ${maxLimit}`);
      clean = clean.substring(0, maxLimit) + '... [Özetlendi]';
    }
    return clean;
  }
}

// --- DUAL AI ENGINE ---

/**
 * Çift Yapay Zekâ Motoru (Dual AI Engine).
 */
export class DualAIEngine {
  private gateway: AIGateway;

  constructor() {
    this.gateway = new AIGateway();
  }

  /**
   * AI-1: Profil Analiz Motoru (Silent Profile Analyser).
   * Kullanıcıya metin cevabı üretmez, arka planda sessizce profili günceller.
   */
  async runProfileAnalysis(userMessage: string, currentProfile: StudentProfileEntity): Promise<Partial<StudentProfileEntity>> {
    const analysisPrompt = PromptPipelineBuilder.buildAnalysisPrompt(userMessage, currentProfile);
    const optimized = ContextOptimizer.optimize(analysisPrompt, 2000);

    // Ucuz ve hızlı model tercih edilir
    const config: AIModelConfig = {
      modelName: 'gpt-3.5-turbo',
      temperature: 0.1,
      maxTokens: 150,
      streaming: false,
      timeoutMs: 3000
    };

    try {
      const response = await this.gateway.routeWithFallback(['openai'], optimized, config);
      // Analiz sonucunu JSON olarak ayrıştır
      if (response.includes('{')) {
        const jsonStr = response.substring(response.indexOf('{'), response.lastIndexOf('}') + 1);
        const parsed = JSON.parse(jsonStr);
        console.log('[AI-1 Profil Analizi] Çıkarılan yeni bilgiler:', parsed);
        return parsed;
      }
    } catch (err) {
      console.error('[AI-1 Profil Analizi] Hata oluştu:', err);
    }
    return {};
  }

  /**
   * AI-2: Koç Motoru (Student Coach Engine).
   * Öğrencinin durumunu ve geçmiş konuşmasını birleştirerek kişiselleştirilmiş tek yanıt döndürür.
   */
  async runCoachEngine(
    profile: StudentProfileEntity,
    lessons: LessonEntity[],
    userMessage: string,
    providerSequence = ['openai', 'claude']
  ): Promise<string> {
    const coachPrompt = PromptPipelineBuilder.buildCoachPrompt(profile, lessons, userMessage);
    const optimized = ContextOptimizer.optimize(coachPrompt, 4000);

    const config: AIModelConfig = {
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000,
      streaming: true,
      timeoutMs: 8000
    };

    return await this.gateway.routeWithFallback(providerSequence, optimized, config);
  }
}

// --- TOKEN ECONOMY ENGINE ---

/**
 * Token maliyeti ve bütçe yönetim cüzdanı.
 */
export class TokenEconomyEngine {
  // Model başına 1K token girdi/çıktı maliyetleri (Dolar bazında simülasyon)
  private static costTable: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'claude-3-opus': { input: 0.015, output: 0.075 }
  };

  /**
   * Harcanan yaklaşık token sayısına göre işlem maliyetini hesaplar.
   */
  static calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.costTable[model] || { input: 0.002, output: 0.006 };
    const cost = (inputTokens / 1000) * pricing.input + (outputTokens / 1000) * pricing.output;
    return Number(cost.toFixed(6));
  }

  /**
   * Kullanıcının günlük veya aylık token limitini aşıp aşmadığını denetler.
   */
  static checkBudgetLimit(used: number, limit: number): boolean {
    return used < limit;
  }
}
