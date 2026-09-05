/// <reference types="vite/client" />
/**
 * aiService.ts (cleaned)
 * Minimal Gemini integration layer. Keeps public API used by the app.
 * - Uses gemini-3.6-flash generateContent endpoint (key must be in VITE_GEMINI_API_KEY)
 * - On any failure, returns null so callers fall back to deterministic content.
 */

export interface InsightContext {
  totalCustomers: number;
  segmentCounts: Record<string, number>;
  segmentPcts: Record<string, string>;
  avgSpendINR: number;
  avgEngagement: number;
  atRiskCount: number;
  highValueCount: number;
  loyalCount: number;
  atRiskAvgRecencyDays: number;
  atRiskAvgEngagement: number;
  overallAvgEngagement: number;
  topDeterministicRecommendations: string[];
}

export interface BusinessInsightResult {
  keyFinding: string;
  businessImplication: string;
  recommendedAction: string;
  isAiGenerated: true;
}

export interface CampaignContext {
  targetSegment: string;
  audienceCount: number;
  avgRecencyDays: number;
  avgEngagement: number;
  avgSpendINR: number;
  goal: string;
  budgetINR: number;
  channel: string;
  primaryEvidence: string[];
}

export interface AICampaignStrategy {
  campaignName: string;
  strategyNarrative: string;
  audienceDescription: string;
  messagingAngle: string;
  offerSuggestion: string;
  callToAction: string;
  isAiGenerated: true;
}

export interface CopyContext {
  targetSegment: string;
  audienceCount: number;
  goal: string;
  channel: 'Email' | 'WhatsApp' | 'Social Media';
  offerText: string;
  callToAction: string;
  brandName?: string;
}

export interface EmailCopy {
  subject: string;
  previewText: string;
  body: string;
  cta: string;
}
export interface WhatsAppCopy { message: string; cta: string }
export interface SocialCopy { caption: string; cta: string }
export type ChannelCopy =
  | { channel: 'Email'; copy: EmailCopy; isAiGenerated: true }
  | { channel: 'WhatsApp'; copy: WhatsAppCopy; isAiGenerated: true }
  | { channel: 'Social Media'; copy: SocialCopy; isAiGenerated: true };

export type AIServiceStatus = 'available' | 'unconfigured' | 'error';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

function getApiKey(): string | null {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!key || key.trim() === '' || key === 'your_gemini_api_key_here') return null;
  return String(key).trim();
}

export function getAIStatus(): AIServiceStatus {
  return getApiKey() ? 'available' : 'unconfigured';
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('GEMINI_UNCONFIGURED');

  const errors: string[] = [];

  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
    };

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });

      if (!resp.ok) {
        const body = await resp.text().catch(() => '');
        errors.push(`${model}:${resp.status}:${body.slice(0, 200)}`);
        continue;
      }

      const data = await resp.json().catch(() => null);
      let text: string | undefined;
      try {
        text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      } catch {}
      if (!text) {
        try {
          text = data?.candidates?.[0]?.content?.[0]?.text;
        } catch {}
      }
      if (!text) {
        text = JSON.stringify(data || {});
      }

      const cleaned = String(text || '').trim();
      if (cleaned) return cleaned;
    } catch (error) {
      errors.push(`${model}:${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`GEMINI_API_ERROR:${errors.join(' | ')}`);
}

function parseJsonFromResponse<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function generateBusinessInsight(ctx: InsightContext): Promise<BusinessInsightResult | null> {
  try {
    const segmentBreakdown = Object.entries(ctx.segmentCounts)
      .map(([seg, count]) => `  - ${seg}: ${count} customers (${ctx.segmentPcts[seg] ?? '?'}%)`)
      .join('\n');

    const deterministicRecs = ctx.topDeterministicRecommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n');

    const prompt = `You are a senior marketing intelligence analyst for MarketMind AI.\n\nYou are given VERIFIED, DETERMINISTIC numerical data about a business's customer base.\nYour task: Write a concise executive business insight using ONLY the provided facts. DO NOT invent or modify numbers.\n---\nVERIFIED CUSTOMER DATA:\n- Total customers: ${ctx.totalCustomers}\n- Average spend per customer: ₹${ctx.avgSpendINR.toLocaleString()}\n- Average engagement score: ${ctx.avgEngagement}/100\n- At-risk customer count: ${ctx.atRiskCount}\n- High value customer count: ${ctx.highValueCount}\n- Loyal customer count: ${ctx.loyalCount}\n- At-risk segment average recency: ${ctx.atRiskAvgRecencyDays} days since last purchase\n- At-risk segment engagement: ${ctx.atRiskAvgEngagement}/100 (vs overall ${ctx.overallAvgEngagement}/100)\n\nCustomer Segment Breakdown:\n${segmentBreakdown}\n\nDeterministic System Recommendations:\n${deterministicRecs}\n---\n\nRespond with ONLY a valid JSON object in this exact format with no markdown:\n{\n  "keyFinding": "...",\n  "businessImplication": "...",\n  "recommendedAction": "..."\n}`;

    const raw = await callGemini(prompt);
    const parsed = parseJsonFromResponse<{ keyFinding: string; businessImplication: string; recommendedAction: string }>(raw);
    if (!parsed?.keyFinding || !parsed?.businessImplication || !parsed?.recommendedAction) throw new Error('GEMINI_INVALID_STRUCTURE');
    return { ...parsed, isAiGenerated: true };
  } catch (err) {
    console.warn('[aiService] generateBusinessInsight failed:', err);
    return null;
  }
}

export async function generateCampaignStrategy(_ctx: CampaignContext): Promise<AICampaignStrategy | null> {
  // Keep stub to avoid accidental model structure mismatches; callers should fall back deterministically.
  return null;
}

export async function generateMarketingCopy(ctx: CopyContext): Promise<ChannelCopy | null> {
  try {
    const brand = ctx.brandName ?? 'MarketMind Brand';
    let responseFormat = '';
    let channelInstructions = '';
    if (ctx.channel === 'Email') {
      channelInstructions = 'Write a concise marketing email. Subject max 60 chars. Body 2-3 short paragraphs.';
      responseFormat = `{"subject":"","previewText":"","body":"","cta":""}`;
    } else if (ctx.channel === 'WhatsApp') {
      channelInstructions = 'Write a short WhatsApp business message under 160 chars.';
      responseFormat = `{"message":"","cta":""}`;
    } else {
      channelInstructions = 'Write a social media caption (2-3 short sentences).';
      responseFormat = `{"caption":"","cta":""}`;
    }

    const prompt = `You are a marketing copywriter for ${brand}.\n\n${channelInstructions}\n\nRespond with ONLY a valid JSON object in this exact format: ${responseFormat}`;
    const raw = await callGemini(prompt);
    const parsed = parseJsonFromResponse<Record<string, string>>(raw);
    if (ctx.channel === 'Email') {
      if (!parsed.subject || !parsed.body) throw new Error('GEMINI_INVALID_STRUCTURE');
      return { channel: 'Email', copy: { subject: parsed.subject, previewText: parsed.previewText ?? '', body: parsed.body, cta: parsed.cta ?? ctx.callToAction }, isAiGenerated: true };
    } else if (ctx.channel === 'WhatsApp') {
      if (!parsed.message) throw new Error('GEMINI_INVALID_STRUCTURE');
      return { channel: 'WhatsApp', copy: { message: parsed.message, cta: parsed.cta ?? ctx.callToAction }, isAiGenerated: true };
    } else {
      if (!parsed.caption) throw new Error('GEMINI_INVALID_STRUCTURE');
      return { channel: 'Social Media', copy: { caption: parsed.caption, cta: parsed.cta ?? ctx.callToAction }, isAiGenerated: true };
    }
  } catch (err) {
    console.warn('[aiService] generateMarketingCopy failed:', err);
    return null;
  }
}
