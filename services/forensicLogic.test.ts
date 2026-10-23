import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVerdict, generateTimelineData, sanitizeAnalysisResult } from './forensicLogic';
import { Verdict } from '../types';

test('calculateVerdict correctly categorizes authenticity scores using new standard terminology', () => {
  assert.equal(calculateVerdict(95), Verdict.NO_STRONG_SYNTHETIC);
  assert.equal(calculateVerdict(75), Verdict.NO_STRONG_SYNTHETIC);
  assert.equal(calculateVerdict(70), Verdict.POSSIBLE_MANIPULATION);
  assert.equal(calculateVerdict(50), Verdict.POSSIBLE_MANIPULATION);
  assert.equal(calculateVerdict(20), Verdict.LIKELY_AI);
  assert.equal(calculateVerdict(0), Verdict.INCONCLUSIVE);
  assert.equal(calculateVerdict(80, true), Verdict.LIKELY_AI); // Explicit AI software override
  assert.equal(calculateVerdict(80, false, true), Verdict.INCONCLUSIVE); // Corrupt/unsupported override
});

test('generateTimelineData clamps between 0 and 100 and flags scores < 50', () => {
  const data = generateTimelineData(40, 5, () => 0.5); // variance 0 -> score 40
  assert.equal(data.length, 5);
  assert.equal(data[0].score, 40);
  assert.equal(data[0].flag, true);

  const highData = generateTimelineData(95, 3, () => 0.9); // variance +4 -> 99
  assert.equal(highData[0].score, 99);
  assert.equal(highData[0].flag, false);
});

test('sanitizeAnalysisResult handles empty or missing properties safely', () => {
  const result = sanitizeAnalysisResult({});
  assert.equal(result.verdict, Verdict.INCONCLUSIVE);
  assert.equal(result.authenticityScore, 50);
  assert.equal(result.domainAnalysis.biological.status, 'WARN');
  assert.ok(result.findings.length > 0);
});
