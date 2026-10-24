export enum AnalysisStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export enum Verdict {
  LIKELY_AI = 'Likely AI-Generated',
  POSSIBLE_MANIPULATION = 'Possible Manipulation',
  NO_STRONG_SYNTHETIC = 'No Strong Synthetic Indicators Detected',
  INCONCLUSIVE = 'Inconclusive — Insufficient Evidence'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export type PageView = 'workspace' | 'overview' | 'report' | 'skills' | 'safety' | 'technology';

export interface AnomalyPoint {
  timestamp: number; // Frame index or frequency bin
  score: number;     // 0-100 authenticity score
  flag: boolean;
}

export interface DomainAnalysis {
  score: number; // 0-100
  status: 'PASS' | 'FAIL' | 'WARN';
  details: string;
}

export interface MetadataForensics {
  hasExif: boolean;
  make?: string;
  model?: string;
  lensModel?: string;
  software?: string;
  dateTime?: string;
  iso?: number;
  fNumber?: number;
  exposureTime?: string;
  focalLength?: string;
  dimensions?: string;
  colorSpace?: string;
  gpsDetected?: boolean;
  
  // Provenance & C2PA
  c2paManifestPresent: boolean;
  c2paStatus: 'VALID_CREDENTIALS' | 'UNVERIFIED_MANIFEST' | 'NO_CREDENTIALS_FOUND';
  c2paIssuer?: string;
  c2paClaimGenerator?: string;

  // Inconsistencies & Flags
  inconsistencies: string[];
  isSoftwareAiFlagged: boolean;
  isMetadataStripped: boolean;
  rawTagsCount: number;
  observedTags: Record<string, string | number | boolean>;
}

export interface NeuralClassifierOutput {
  modelName: string;
  modelVersion: string;
  license: string;
  architecture: string;
  fakeProbability: number; // 0 to 1
  realProbability: number; // 0 to 1
  status: 'SUCCESS' | 'MODEL_UNAVAILABLE' | 'ERROR';
  inferenceTimeMs: number;
  preprocessing: string;
  limitations: string;
}

export interface SupportingForensicSignals {
  spectralResidualScore: number; // 0-100 (high = abnormal frequency lattice)
  errorLevelAnalysisScore: number; // 0-100 (high = non-uniform compression error)
  noiseConsistencyScore: number; // 0-100 (high = authentic Poisson-Gaussian sensor noise)
  highFrequencyVariance: number;
  colorEntropy: number;
}

export interface ForensicReport {
  caseId: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  fileHash: string; // SHA-256
  mediaType: MediaType;
  resolution?: string;
  duration?: string;
  
  // Standardized Forensics Verdict
  verdict: Verdict;
  authenticityScore: number; // 0-100 composite confidence metric
  confidence: number;        // Statistical confidence percentage

  // Neural Classifier
  neuralClassifier: NeuralClassifierOutput;

  // Metadata & Provenance
  metadata: MetadataForensics;

  // Physical & Supporting Signals
  supportingSignals: SupportingForensicSignals;

  // Granular Domain Analysis
  domainAnalysis: {
    biological: DomainAnalysis; // Facial anatomy, specular reflections, vascular kinetics
    digital: DomainAnalysis;    // Artifacts, diffusion lattice, Bayer pattern
    physics: DomainAnalysis;    // Lighting vectors, cast shadows, focal depth
  };

  appliedAlgorithms: string[];

  // Explanations & Evidence
  explanation: string;
  urduExplanation?: string;
  decisionRule: string;
  findings: string[];
  uncertaintyExplanation: string;
  analystNotes?: string;
  aiModelUsed?: string;
  isLiveModelOutput?: boolean;
  legalAdmissibilityNote: string;
  victimSafetyGuidance: string[];
  timelineData: AnomalyPoint[];
  heatmapData?: string; // Base64 encoded heatmap visualization
}

export interface AnalysisRequest {
  file: File;
  previewUrl: string;
  mediaType: MediaType;
}

export interface AgentSkillDefinition {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'CUSTOM';
  version: string;
  content: string;
}