---
name: provenance-verification
description: Verification of cryptographic Content Credentials (C2PA), Coalition for Content Provenance and Authenticity manifests, and JUMBF claim structures.
---

# Provenance Verification Skill

## Purpose
Validates cryptographically signed provenance data embedded within media files conforming to C2PA (Coalition for Content Provenance and Authenticity) and CAI (Content Authenticity Initiative) standards.

## Verification Workflow
1. **Container Inspection**: Parse media file boxes for JUMBF (JPEG Universal Metadata Box Format) structures or PNG `c2pa` chunks.
2. **Manifest Extraction**: Identify claim generators, signing certificate issuers, and assertion stores.
3. **Chain of Trust**: Validate signing authority, timestamp tokens, and whether content edits (crops, retouches, generative fills) are signed.
4. **Tamper Auditing**: Flag unsigned edits where pixel hashes diverge from signed manifest claims.
5. **Absence Handling**: When no C2PA manifest is present, accurately classify provenance as "Unsigned / No Cryptographic Manifest Embedded" without penalizing authentic legacy photographs.
