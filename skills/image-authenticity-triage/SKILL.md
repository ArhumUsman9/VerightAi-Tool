---
name: image-authenticity-triage
description: Multi-signal triage workflow for authenticating digital imagery, identifying AI-generated artifacts, and detecting localized manipulation.
---

# Image Authenticity Triage Skill

## Purpose
Establishes a systematic, evidence-driven procedure to evaluate suspect imagery across pixel-level neural inference, frequency-domain residual patterns, and physical coherence before rendering a defensible classification.

## Classification Policy
Never output binary "100% Authentic" or unsupported guarantees. Use defensible tiers:
- **Likely AI-Generated**: Dedicated neural classifier probability > 0.70 OR explicit generative software provenance detected.
- **Possible Manipulation**: Conflicting signals, localized compression disparities (ELA), or partial face swap / inpainting cues.
- **No Strong Synthetic Indicators Detected**: Genuine camera sensor noise, authentic optical depth of field, coherent CFA interpolation, and classifier real probability >= 0.75 without synthetic signatures.
- **Inconclusive — Insufficient Evidence**: Insufficient resolution, corrupt image payloads, conflicting forensic vectors, or offline detector without secondary certainty.

## Execution Checklist
1. **Payload Ingestion**: Validate image format (JPEG, PNG, WebP) and calculate SHA-256 hash.
2. **Dedicated Pixel Inference**: Execute `onnx-community/ai-image-detect-distilled-ONNX` on 224x224 normalized RGB tensor.
3. **Spectral Frequency Audit**: Calculate 2D FFT / DCT high-frequency residuals to detect latent diffusion upsampling lattice grids.
4. **Physical Coherence Check**: Evaluate corneal specular highlights, bilateral lighting direction, and depth-of-field consistency.
5. **Multi-Signal Fusion**: Apply threshold policy to produce explainable verdict with explicit confidence and uncertainty boundaries.
