import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeImageBuffer,
  extractMetadataForensics,
  computePixelForensics,
  evaluateEvidenceFusion,
} from './forensicEngine';
import { Verdict, NeuralClassifierOutput, MetadataForensics, SupportingForensicSignals } from '../types';

test('Regression Suite: 10 Labeled Forensic Cases', async (t) => {
  const regressionResults: Array<{
    caseNum: number;
    scenario: string;
    modelOutput: { fake: number; real: number; status: string };
    policyDecision: Verdict;
    observedEvidence: string[];
    expectedVerdict: Verdict;
    passed: boolean;
  }> = [];

  // 1. Genuine camera photograph (Clean Canon DSLR metadata + low fake probability + natural noise)
  await t.test('Case 1: Genuine camera photograph', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.08,
      realProbability: 0.92,
      status: 'SUCCESS',
      inferenceTimeMs: 45,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: true,
      make: 'Canon',
      model: 'EOS 5D Mark IV',
      lensModel: 'EF 24-70mm f/2.8L II USM',
      iso: 400,
      fNumber: 2.8,
      exposureTime: '1/250s',
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: [],
      isSoftwareAiFlagged: false,
      isMetadataStripped: false,
      rawTagsCount: 42,
      observedTags: { Make: 'Canon', Model: 'EOS 5D Mark IV' },
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 18,
      errorLevelAnalysisScore: 22,
      noiseConsistencyScore: 88,
      highFrequencyVariance: 8.4,
      colorEntropy: 7.8,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.NO_STRONG_SYNTHETIC;
    regressionResults.push({
      caseNum: 1,
      scenario: 'Genuine camera photograph',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.NO_STRONG_SYNTHETIC,
      passed,
    });
    assert.equal(decision.verdict, Verdict.NO_STRONG_SYNTHETIC);
  });

  // 2. Clearly AI-generated image (Explicit AI software tag + high neural fake score)
  await t.test('Case 2: Clearly AI-generated image', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.94,
      realProbability: 0.06,
      status: 'SUCCESS',
      inferenceTimeMs: 42,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: true,
      software: 'Midjourney v6.0',
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Software tag explicitly identifies generative tool: "midjourney".'],
      isSoftwareAiFlagged: true,
      isMetadataStripped: false,
      rawTagsCount: 4,
      observedTags: { Software: 'Midjourney v6.0' },
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 82,
      errorLevelAnalysisScore: 35,
      noiseConsistencyScore: 30,
      highFrequencyVariance: 18.2,
      colorEntropy: 6.1,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.LIKELY_AI;
    regressionResults.push({
      caseNum: 2,
      scenario: 'Clearly AI-generated image',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.LIKELY_AI,
      passed,
    });
    assert.equal(decision.verdict, Verdict.LIKELY_AI);
  });

  // 3. Hyperrealistic AI-generated portrait (visually realistic, high neural fake score + 8x8 diffusion lattice)
  await t.test('Case 3: Hyperrealistic AI-generated portrait', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.88,
      realProbability: 0.12,
      status: 'SUCCESS',
      inferenceTimeMs: 44,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Complete absence of EXIF metadata.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 78,
      errorLevelAnalysisScore: 40,
      noiseConsistencyScore: 34,
      highFrequencyVariance: 14.5,
      colorEntropy: 6.8,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.LIKELY_AI;
    regressionResults.push({
      caseNum: 3,
      scenario: 'Hyperrealistic AI-generated portrait',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.LIKELY_AI,
      passed,
    });
    assert.equal(decision.verdict, Verdict.LIKELY_AI);
    assert.notEqual(decision.verdict, Verdict.NO_STRONG_SYNTHETIC); // Fixed false authenticity!
  });

  // 4. AI-generated image without metadata (stripped EXIF + neural fake score 0.79)
  await t.test('Case 4: AI-generated image without metadata', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.79,
      realProbability: 0.21,
      status: 'SUCCESS',
      inferenceTimeMs: 41,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Complete absence of EXIF metadata.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 68,
      errorLevelAnalysisScore: 38,
      noiseConsistencyScore: 40,
      highFrequencyVariance: 12.1,
      colorEntropy: 6.5,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.LIKELY_AI;
    regressionResults.push({
      caseNum: 4,
      scenario: 'AI-generated image without metadata',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.LIKELY_AI,
      passed,
    });
    assert.equal(decision.verdict, Verdict.LIKELY_AI);
  });

  // 5. Compressed genuine photograph (stripped EXIF on social media + low neural fake score + authentic noise)
  await t.test('Case 5: Compressed genuine photograph', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.18,
      realProbability: 0.82,
      status: 'SUCCESS',
      inferenceTimeMs: 38,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Complete absence of EXIF metadata.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 32,
      errorLevelAnalysisScore: 55, // JPEG compression blockiness
      noiseConsistencyScore: 82, // Poisson-Gaussian noise still intact
      highFrequencyVariance: 9.0,
      colorEntropy: 7.1,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.NO_STRONG_SYNTHETIC;
    regressionResults.push({
      caseNum: 5,
      scenario: 'Compressed genuine photograph',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.NO_STRONG_SYNTHETIC,
      passed,
    });
    assert.equal(decision.verdict, Verdict.NO_STRONG_SYNTHETIC);
  });

  // 6. Edited genuine photograph (localized Photoshop edit, ELA disparity, borderline neural)
  await t.test('Case 6: Edited genuine photograph', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.48,
      realProbability: 0.52,
      status: 'SUCCESS',
      inferenceTimeMs: 40,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: true,
      software: 'Adobe Photoshop 2024',
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Container modified by editing tool: Adobe Photoshop 2024.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: false,
      rawTagsCount: 15,
      observedTags: { Software: 'Adobe Photoshop 2024' },
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 42,
      errorLevelAnalysisScore: 78, // High ELA difference indicates splice
      noiseConsistencyScore: 60,
      highFrequencyVariance: 11.2,
      colorEntropy: 7.3,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.POSSIBLE_MANIPULATION;
    regressionResults.push({
      caseNum: 6,
      scenario: 'Edited genuine photograph',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.POSSIBLE_MANIPULATION,
      passed,
    });
    assert.equal(decision.verdict, Verdict.POSSIBLE_MANIPULATION);
  });

  // 7. Corrupted image file
  await t.test('Case 7: Corrupted image file', () => {
    const corruptBuffer = Buffer.from('corrupt_header_bytes_123456');
    const decoded = decodeImageBuffer(corruptBuffer);
    assert.equal(decoded, null);

    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.5,
      realProbability: 0.5,
      status: 'ERROR',
      inferenceTimeMs: 2,
      preprocessing: 'Error during raw tensor decoding',
      limitations: 'Execution failure: Corrupt byte stream',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Payload could not be parsed as valid JPEG/PNG container.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals = computePixelForensics(Buffer.alloc(0), null);

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.INCONCLUSIVE;
    regressionResults.push({
      caseNum: 7,
      scenario: 'Corrupted image file',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.INCONCLUSIVE,
      passed,
    });
    assert.equal(decision.verdict, Verdict.INCONCLUSIVE);
  });

  // 8. Unsupported file type
  await t.test('Case 8: Unsupported file type', () => {
    const textBuffer = Buffer.from('%PDF-1.4\n%...\n');
    const decoded = decodeImageBuffer(textBuffer);
    assert.equal(decoded, null);

    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.5,
      realProbability: 0.5,
      status: 'ERROR',
      inferenceTimeMs: 1,
      preprocessing: 'Unsupported container format',
      limitations: 'Format not supported',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['Format unsupported.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals = computePixelForensics(Buffer.alloc(0), null);

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.INCONCLUSIVE;
    regressionResults.push({
      caseNum: 8,
      scenario: 'Unsupported file type',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.INCONCLUSIVE,
      passed,
    });
    assert.equal(decision.verdict, Verdict.INCONCLUSIVE);
  });

  // 9. Unavailable inference model
  await t.test('Case 9: Unavailable inference model', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.5,
      realProbability: 0.5,
      status: 'MODEL_UNAVAILABLE',
      inferenceTimeMs: 10,
      preprocessing: 'Input unavailable or network restricted',
      limitations: 'Detector model weights offline',
    };
    const meta: MetadataForensics = {
      hasExif: false,
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: [],
      isSoftwareAiFlagged: false,
      isMetadataStripped: true,
      rawTagsCount: 0,
      observedTags: {},
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 40,
      errorLevelAnalysisScore: 35,
      noiseConsistencyScore: 50,
      highFrequencyVariance: 10.0,
      colorEntropy: 6.9,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.INCONCLUSIVE;
    regressionResults.push({
      caseNum: 9,
      scenario: 'Unavailable inference model',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.INCONCLUSIVE,
      passed,
    });
    assert.equal(decision.verdict, Verdict.INCONCLUSIVE);
  });

  // 10. Conflicting forensic signals (Neural model reports fake 0.62, but camera EXIF says Nikon D850 with lens tags)
  await t.test('Case 10: Conflicting forensic signals', () => {
    const neural: NeuralClassifierOutput = {
      modelName: 'onnx-community/ai-image-detect-distilled-ONNX',
      modelVersion: 'v1.0-quantized',
      license: 'Apache 2.0',
      architecture: 'Distilled Vision Transformer',
      fakeProbability: 0.62,
      realProbability: 0.38,
      status: 'SUCCESS',
      inferenceTimeMs: 43,
      preprocessing: '224x224 RGB bicubic',
      limitations: 'Trained on modern diffusion models',
    };
    const meta: MetadataForensics = {
      hasExif: true,
      make: 'Nikon',
      model: 'D850',
      lensModel: 'AF-S NIKKOR 70-200mm f/2.8E FL ED VR',
      iso: 200,
      fNumber: 2.8,
      exposureTime: '1/500s',
      c2paManifestPresent: false,
      c2paStatus: 'NO_CREDENTIALS_FOUND',
      inconsistencies: ['High neural suspicion conflicts with authentic camera exposure metadata.'],
      isSoftwareAiFlagged: false,
      isMetadataStripped: false,
      rawTagsCount: 38,
      observedTags: { Make: 'Nikon', Model: 'D850' },
    };
    const signals: SupportingForensicSignals = {
      spectralResidualScore: 65,
      errorLevelAnalysisScore: 62,
      noiseConsistencyScore: 68,
      highFrequencyVariance: 13.0,
      colorEntropy: 7.0,
    };

    const decision = evaluateEvidenceFusion(neural, meta, signals);
    const passed = decision.verdict === Verdict.POSSIBLE_MANIPULATION;
    regressionResults.push({
      caseNum: 10,
      scenario: 'Conflicting forensic signals',
      modelOutput: { fake: neural.fakeProbability, real: neural.realProbability, status: neural.status },
      policyDecision: decision.verdict,
      observedEvidence: decision.findings,
      expectedVerdict: Verdict.POSSIBLE_MANIPULATION,
      passed,
    });
    assert.equal(decision.verdict, Verdict.POSSIBLE_MANIPULATION);
  });

  // Verification Summary Calculation
  const total = regressionResults.length;
  const passedCount = regressionResults.filter(r => r.passed).length;
  const inconclusiveCount = regressionResults.filter(r => r.policyDecision === Verdict.INCONCLUSIVE).length;
  const falseNegatives = regressionResults.filter(
    r => (r.scenario.includes('AI-generated') || r.scenario.includes('synthetic')) && r.policyDecision === Verdict.NO_STRONG_SYNTHETIC
  ).length;
  const falsePositives = regressionResults.filter(
    r => r.scenario.includes('Genuine') && r.policyDecision === Verdict.LIKELY_AI
  ).length;

  console.log('\n--- VERISIGHT SHIELD REGRESSION TEST MATRIX ---');
  console.log(`Total Cases Evaluated: ${total}`);
  console.log(`Passed: ${passedCount}/${total} (${((passedCount / total) * 100).toFixed(1)}%)`);
  console.log(`False Negatives on AI Media: ${falseNegatives} (0% - False authenticity eliminated)`);
  console.log(`False Positives on Genuine Media: ${falsePositives} (0%)`);
  console.log(`Proportion of Inconclusive Decisions: ${inconclusiveCount}/${total} (${((inconclusiveCount / total) * 100).toFixed(1)}%)`);
  console.log('------------------------------------------------\n');

  assert.equal(passedCount, 10);
  assert.equal(falseNegatives, 0);
  assert.equal(falsePositives, 0);
});
