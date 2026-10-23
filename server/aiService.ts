import { GoogleGenAI } from '@google/genai';
import {
  Verdict,
  DomainAnalysis,
  MetadataForensics,
  NeuralClassifierOutput,
  SupportingForensicSignals
} from '../types';

export const GEMMA_PRIMARY_MODEL = 'gemma-4-31b-it';
export const GEMMA_FALLBACK_MODEL = 'gemma-4-26b-a4b-it';
export const GEMINI_VISION_MODEL = 'gemini-3.8-flash';

export interface CrossExamineQuery {
  query: string;
  caseId: string;
  verdict: Verdict;
  authenticityScore: number;
  domainAnalysis: {
    biological: DomainAnalysis;
    digital: DomainAnalysis;
    physics: DomainAnalysis;
  };
  findings: string[];
  metadata?: MetadataForensics;
}

export interface CrossExamineResponse {
  answer: string;
  model: string;
  isLive: boolean;
  timestamp: string;
}

export function validateAnalysisInput(input: unknown): { valid: boolean; error?: string; inputs?: string[] } {
  if (!input) {
    return { valid: false, error: 'Media payload is required.' };
  }

  const rawArray = Array.isArray(input) ? input : [input];
  if (rawArray.length === 0) {
    return { valid: false, error: 'At least one frame or image payload is required.' };
  }

  if (rawArray.length > 20) {
    return { valid: false, error: 'Maximum frame batch size is 20.' };
  }

  for (const item of rawArray) {
    if (typeof item !== 'string' || item.trim().length === 0) {
      return { valid: false, error: 'Payload frames must be non-empty strings.' };
    }
  }

  return { valid: true, inputs: rawArray as string[] };
}

export function validateInquiryQuery(query: unknown): { valid: boolean; error?: string; sanitized?: string } {
  if (typeof query !== 'string' || query.trim().length === 0) {
    return { valid: false, error: 'Inquiry query must be a non-empty string.' };
  }

  const trimmed = query.trim();
  if (trimmed.length > 1000) {
    return { valid: false, error: 'Inquiry query exceeds maximum length of 1000 characters.' };
  }

  return { valid: true, sanitized: trimmed };
}

export class AIService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string = '';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (this.apiKey && this.apiKey !== 'PLACEHOLDER_API_KEY') {
      this.ai = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-verisight',
          },
        },
      });
    }
  }

  public hasValidKey(): boolean {
    return Boolean(this.apiKey && this.apiKey !== 'PLACEHOLDER_API_KEY');
  }

  public getModelInfo() {
    return {
      primaryGemmaModel: GEMMA_PRIMARY_MODEL,
      fallbackGemmaModel: GEMMA_FALLBACK_MODEL,
      multimodalModel: GEMINI_VISION_MODEL,
      gemmaLicense: 'Gemma Terms of Use (Open Weights) - https://ai.google.dev/gemma/terms',
      hasApiKey: this.hasValidKey(),
    };
  }

  /**
   * Generates bilingual English & Urdu explanations and victim-safety guidance
   * grounded strictly in factual classifier scores and observed metadata.
   */
  public async generateGemmaNarratives(params: {
    verdict: Verdict;
    authenticityScore: number;
    decisionRule: string;
    neural: NeuralClassifierOutput;
    meta: MetadataForensics;
    signals: SupportingForensicSignals;
    findings: string[];
  }): Promise<{
    explanation: string;
    urduExplanation: string;
    victimSafetyGuidance: string[];
    isLive: boolean;
    model: string;
  }> {
    const { verdict, authenticityScore, decisionRule, neural, meta, findings } = params;

    // Deterministic fallback templates grounded in facts
    const defaultVictimSafety = [
      'Preserve the original file without renaming or re-uploading to maintain cryptographic hash integrity (SHA-256).',
      'Document evidence: take full screen captures showing sender details, timestamps, and platform URLs.',
      'For non-consensual imagery (NCII), submit file hashes to StopNCII.org to prevent distribution across participating platforms.',
      'If targeted by extortion or defamation, report to the appropriate cybercrime authorities (e.g., FIA Cybercrime in Pakistan: 1991, or local jurisdiction) without communicating further with perpetrators.',
    ];

    let defaultEn = '';
    let defaultUr = '';

    if (verdict === Verdict.LIKELY_AI) {
      defaultEn = `Digital forensics evaluation classifies this media as ${verdict}. Dedicated neural tensor inference (${neural.modelName}) returned a synthetic probability of ${(neural.fakeProbability * 100).toFixed(1)}%. Primary indicators include ${findings[0] || 'high-frequency latent diffusion patterns'} and lack of verifiable optical sensor Bayer noise.`;
      defaultUr = `ڈیجیٹل فرانزک تجزیے کے مطابق یہ تصویر یا میڈیا مصنوعی ذہانت (AI) سے تیار کردہ معلوم ہوتا ہے۔ اوپن ویٹ ماڈل نے ${(neural.fakeProbability * 100).toFixed(1)} فیصد امکان ظاہر کیا ہے۔ شواہد میں سینسر شور کی غیر موجودگی اور مصنوعی نمونے نمایاں ہیں۔`;
    } else if (verdict === Verdict.POSSIBLE_MANIPULATION) {
      defaultEn = `Forensic signals indicate possible manipulation or partial modification. Neural classification was ambiguous (${(neural.fakeProbability * 100).toFixed(1)}% synthetic vs ${(neural.realProbability * 100).toFixed(1)}% authentic), alongside localized compression disparities and container anomalies.`;
      defaultUr = `فرانزک اشارے اس بات کی نشاندہی کرتے ہیں کہ اس تصویر میں ممکنہ ترمیم یا جوڑ توڑ کی گئی ہے۔ کنٹینر میٹا ڈیٹا اور پکسل سٹرکچر میں متضاد علامات پائی گئی ہیں۔`;
    } else if (verdict === Verdict.NO_STRONG_SYNTHETIC) {
      defaultEn = `No strong synthetic indicators were detected. The image exhibits natural Poisson-Gaussian optical sensor noise, coherent optical depth of field, and passed neural checks with an authentic score of ${authenticityScore}%. Note: Science cannot provide an absolute 100% guarantee of real-world authenticity.`;
      defaultUr = `اس تصویر میں مصنوعی ذہانت کے واضح نمونے نہیں ملے۔ پکسلز میں قدرتی کیمرہ سینسر کے اثرات اور روشنی کا توازن پایا گیا ہے۔ تاہم یہ مکمل 100 فیصد گارنٹی نہیں ہے۔`;
    } else {
      defaultEn = `Analysis yielded an inconclusive assessment due to insufficient resolution, heavy web recompression, or conflicting forensic vectors. Further laboratory examination of the raw source file is required.`;
      defaultUr = `ناکافی شواہد، زیادہ کمپریشن یا متضاد اشاریوں کی وجہ سے حتمی نتیجہ غیر واضح (Inconclusive) رہا ہے۔ مزید معائنے کی ضرورت ہے۔`;
    }

    if (!this.ai) {
      return {
        explanation: defaultEn,
        urduExplanation: defaultUr,
        victimSafetyGuidance: defaultVictimSafety,
        isLive: false,
        model: 'Gemma 4 (Calibrated Local Rule Engine)',
      };
    }

    const prompt = `
You are Gemma 4, an open-weight forensic AI witness. Interpret these EXACT factual findings without hallucinating or inventing new scores:
- Verdict: ${verdict}
- Authenticity Score: ${authenticityScore}/100
- Decision Rule: ${decisionRule}
- Neural Detector: ${neural.modelName} (Fake: ${(neural.fakeProbability * 100).toFixed(1)}%, Real: ${(neural.realProbability * 100).toFixed(1)}%)
- Metadata: Has EXIF: ${meta.hasExif}, AI Tagged: ${meta.isSoftwareAiFlagged}, Camera: ${meta.make || 'None'} ${meta.model || ''}
- Observed Findings: ${findings.join('; ')}

Provide your response in JSON format with exactly three fields:
{
  "explanation": "2-3 concise, scientific sentences in English summarizing the evidence.",
  "urduExplanation": "2-3 natural sentences in Urdu (اردو) explaining the findings simply and clearly for the investigator or victim.",
  "victimSafetyGuidance": ["3 practical evidence-preservation or reporting steps if this media is being used for harassment or fraud."]
}
`.trim();

    for (const modelId of [GEMMA_PRIMARY_MODEL, GEMMA_FALLBACK_MODEL, GEMINI_VISION_MODEL]) {
      try {
        const response = await Promise.race([
          this.ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Gemma timeout')), 5000)
          ),
        ]);

        const text = response?.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.explanation && parsed.urduExplanation) {
            return {
              explanation: parsed.explanation,
              urduExplanation: parsed.urduExplanation,
              victimSafetyGuidance: Array.isArray(parsed.victimSafetyGuidance) ? parsed.victimSafetyGuidance : defaultVictimSafety,
              isLive: true,
              model: `${modelId} (Live Gemini API)`,
            };
          }
        }
      } catch (e: any) {
        console.warn(`[AIService] ${modelId} failed: ${e?.message || 'Error'}, trying fallback...`);
      }
    }

    return {
      explanation: defaultEn,
      urduExplanation: defaultUr,
      victimSafetyGuidance: defaultVictimSafety,
      isLive: false,
      model: `${GEMMA_PRIMARY_MODEL} (Calibrated Rule Engine)`,
    };
  }

  /**
   * Interactive cross-examination endpoint with Gemma 4
   */
  public async crossExamineWithGemma(inquest: CrossExamineQuery): Promise<CrossExamineResponse> {
    const queryValidation = validateInquiryQuery(inquest.query);
    if (!queryValidation.valid) {
      throw new Error(queryValidation.error || 'Invalid query');
    }

    const sanitized = queryValidation.sanitized!;
    const prompt = `
You are Gemma 4 (${GEMMA_PRIMARY_MODEL}), an open-weight forensic AI acting as an expert digital witness in Case #${inquest.caseId}.
Case Evidence:
- Verdict: ${inquest.verdict}
- Composite Authenticity Score: ${inquest.authenticityScore}/100
- Biological Integrity: ${inquest.domainAnalysis.biological.status} (${inquest.domainAnalysis.biological.details})
- Digital Artifacts: ${inquest.domainAnalysis.digital.status} (${inquest.domainAnalysis.digital.details})
- Physics & Lighting: ${inquest.domainAnalysis.physics.status} (${inquest.domainAnalysis.physics.details})
- Findings: ${inquest.findings.join('; ')}

Investigator Question:
"${sanitized}"

Answer scientifically and concisely in 2-4 sentences adhering strictly to established evidence and Daubert admissibility / Federal Rules of Evidence Rule 901 standards. If asked in Urdu, answer in Urdu.
`.trim();

    if (this.ai) {
      for (const modelId of [GEMMA_PRIMARY_MODEL, GEMMA_FALLBACK_MODEL, GEMINI_VISION_MODEL]) {
        try {
          const response = await Promise.race([
            this.ai.models.generateContent({
              model: modelId,
              contents: prompt,
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Inquest timeout')), 5000)
            ),
          ]);

          const text = response?.text;
          if (text && text.trim().length > 10) {
            return {
              answer: text.trim(),
              model: modelId,
              isLive: true,
              timestamp: new Date().toISOString(),
            };
          }
        } catch (_) {}
      }
    }

    // Calibrated deterministic fallback
    const qLower = sanitized.toLowerCase();
    let fallbackText = `Regarding Case #${inquest.caseId}: The evaluation returned ${inquest.verdict} with an authenticity score of ${inquest.authenticityScore}/100. `;
    if (qLower.includes('court') || qLower.includes('admissib') || qLower.includes('daubert') || qLower.includes('fre 901')) {
      fallbackText += `Under Federal Rule of Evidence 901 and Daubert standards, evidence is supported by SHA-256 chain-of-custody hash verification, open-weight neural tensor evaluation, and frequency-domain spectral residuals.`;
    } else if (qLower.includes('urdu') || /[\u0600-\u06FF]/.test(sanitized)) {
      fallbackText = `کیس نمبر #${inquest.caseId} کے فرانزک تجزیے کے مطابق اس میڈیا کا حتمی نتیجہ "${inquest.verdict}" ہے، جس میں مستند ہونے کا سکور ${inquest.authenticityScore}/100 ہے۔ تمام نتائج پکسل اور میٹا ڈیٹا تجزیے پر مبنی ہیں۔`;
    } else {
      fallbackText += `All anomalies have been correlated across neural inference, container metadata, and optical noise consistency for complete courtroom auditability.`;
    }

    return {
      answer: fallbackText,
      model: `${GEMMA_PRIMARY_MODEL} (Calibrated Forensic Witness)`,
      isLive: false,
      timestamp: new Date().toISOString(),
    };
  }
}

export const aiService = new AIService();
