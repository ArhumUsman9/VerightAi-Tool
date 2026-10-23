import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAnalysisInput,
  validateInquiryQuery,
  AIService,
  GEMMA_PRIMARY_MODEL,
  GEMMA_FALLBACK_MODEL
} from './aiService';
import { Verdict } from '../types';

test('validateAnalysisInput accepts valid image/frame strings', () => {
  const resultSingle = validateAnalysisInput('data:image/jpeg;base64,1234');
  assert.equal(resultSingle.valid, true);
  assert.equal(resultSingle.inputs?.length, 1);

  const resultArr = validateAnalysisInput(['frame1', 'frame2']);
  assert.equal(resultArr.valid, true);
  assert.equal(resultArr.inputs?.length, 2);
});

test('validateAnalysisInput rejects invalid or empty inputs', () => {
  assert.equal(validateAnalysisInput(null).valid, false);
  assert.equal(validateAnalysisInput([]).valid, false);
  assert.equal(validateAnalysisInput(['']).valid, false);
  assert.equal(validateAnalysisInput(new Array(25).fill('frame')).valid, false);
});

test('validateInquiryQuery sanitizes and rejects invalid queries', () => {
  assert.equal(validateInquiryQuery('').valid, false);
  assert.equal(validateInquiryQuery('   ').valid, false);
  assert.equal(validateInquiryQuery(123 as any).valid, false);

  const longQuery = 'a'.repeat(1005);
  assert.equal(validateInquiryQuery(longQuery).valid, false);

  const valid = validateInquiryQuery('  Is this evidence admissible in court?  ');
  assert.equal(valid.valid, true);
  assert.equal(valid.sanitized, 'Is this evidence admissible in court?');
});

test('AIService reports verified Gemma 4 model identifiers and license', () => {
  const service = new AIService();
  const info = service.getModelInfo();
  assert.equal(info.primaryGemmaModel, GEMMA_PRIMARY_MODEL);
  assert.equal(info.primaryGemmaModel, 'gemma-4-31b-it');
  assert.equal(info.fallbackGemmaModel, 'gemma-4-26b-a4b-it');
  assert.ok(info.gemmaLicense.includes('https://ai.google.dev/gemma/terms'));
});

test('AIService crossExamineWithGemma handles courtroom inquest queries gracefully', async () => {
  const service = new AIService();
  const res = await service.crossExamineWithGemma({
    query: 'Does this evidence meet Daubert admissibility standards?',
    caseId: 'VS-TEST-99',
    verdict: Verdict.LIKELY_AI,
    authenticityScore: 22,
    domainAnalysis: {
      biological: { score: 15, status: 'FAIL', details: 'Lack of vascular pulse' },
      digital: { score: 20, status: 'FAIL', details: 'Spectral residual lattice' },
      physics: { score: 30, status: 'WARN', details: 'Ray inconsistency' }
    },
    findings: ['Latent grid detected']
  });

  assert.ok(res.answer.length > 20);
  assert.ok(res.model.includes('gemma-4') || res.model.includes('Gemma 4'));
});
