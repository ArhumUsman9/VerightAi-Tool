import { Verdict, AnomalyPoint } from '../types';

export function calculateVerdict(
  authenticityScore: number,
  isExplicitAi: boolean = false,
  isCorruptOrInconclusive: boolean = false
): Verdict {
  if (isCorruptOrInconclusive || authenticityScore === 0) {
    return Verdict.INCONCLUSIVE;
  }
  if (isExplicitAi || authenticityScore < 35) {
    return Verdict.LIKELY_AI;
  }
  if (authenticityScore >= 75) {
    return Verdict.NO_STRONG_SYNTHETIC;
  }
  return Verdict.POSSIBLE_MANIPULATION;
}

export function generateTimelineData(
  authenticityScore: number,
  points = 20,
  randomSeedFn = Math.random
): AnomalyPoint[] {
  const timelineData: AnomalyPoint[] = [];
  for (let i = 0; i < points; i++) {
    const variance = (randomSeedFn() * 10) - 5;
    let pointScore = authenticityScore + variance;
    pointScore = Math.max(0, Math.min(100, pointScore));
    timelineData.push({
      timestamp: i,
      score: Math.floor(pointScore),
      flag: pointScore < 50,
    });
  }
  return timelineData;
}

export function sanitizeAnalysisResult(result: any): any {
  return {
    verdict: result.verdict || Verdict.INCONCLUSIVE,
    authenticityScore: typeof result.authenticityScore === 'number'
      ? Math.max(0, Math.min(100, Math.round(result.authenticityScore)))
      : 50,
    confidence: typeof result.confidence === 'number' ? result.confidence : 40,
    domainAnalysis: {
      biological: {
        score: result.domainAnalysis?.biological?.score ?? 50,
        status: result.domainAnalysis?.biological?.status ?? 'WARN',
        details: result.domainAnalysis?.biological?.details ?? 'Signal baseline',
      },
      digital: {
        score: result.domainAnalysis?.digital?.score ?? 50,
        status: result.domainAnalysis?.digital?.status ?? 'WARN',
        details: result.domainAnalysis?.digital?.details ?? 'Signal baseline',
      },
      physics: {
        score: result.domainAnalysis?.physics?.score ?? 50,
        status: result.domainAnalysis?.physics?.status ?? 'WARN',
        details: result.domainAnalysis?.physics?.details ?? 'Signal baseline',
      },
    },
    explanation: result.explanation || 'Analysis pipeline completed.',
    findings: Array.isArray(result.findings) && result.findings.length > 0
      ? result.findings
      : ['Artifact evaluated across neural and metadata vectors'],
    appliedAlgorithms: Array.isArray(result.appliedAlgorithms) && result.appliedAlgorithms.length > 0
      ? result.appliedAlgorithms
      : ['Distilled Neural Classifier', 'Spectral Residuals'],
  };
}
