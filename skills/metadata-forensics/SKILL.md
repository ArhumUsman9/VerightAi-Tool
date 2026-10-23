---
name: metadata-forensics
description: Comprehensive digital image metadata extraction, EXIF/XMP parsing, software tag auditing, and consistency verification.
---

# Metadata Forensics Skill

## Purpose
Inspects embedded digital container headers to extract camera hardware tags, editing software history, timestamps, GPS, and format anomalies, while enforcing rigorous evidentiary distinctions between observed metadata and cryptographically signed provenance.

## Evidentiary Principles
1. **Absence is Not Proof**: Missing or stripped EXIF/XMP metadata is standard behavior across social messaging platforms (WhatsApp, Telegram, Twitter/X, Instagram) and DOES NOT establish that an image is AI-generated.
2. **Metadata Can Be Forged**: Unsigned EXIF tags (Make, Model, Software) can be injected by adversary scripts. Always correlate metadata against pixel Bayer filter noise.
3. **Generative Software Tags**: Identify known AI generation software tags (e.g., "Midjourney", "Stable Diffusion", "NovelAI", "DALL-E", "Adobe Firefly", "Automatic1111", "ComfyUI", "Photoshop Generative Fill").
4. **Hardware Inconsistency Detection**: Flag discrepancies between declared camera models and actual pixel dimensions, aspect ratio, or missing lens metadata.
