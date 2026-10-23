import { ForensicReport, Verdict, MediaType } from '../types';
import { analyzeMediaOnServer } from './geminiService';

export const computeFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const extractVideoFrames = async (videoUrl: string): Promise<string[]> => {
  return new Promise(async (resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    const frames: string[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const timeout = setTimeout(() => reject(new Error('Video frame extraction timed out')), 45000);

    await new Promise(r => { video.onloadedmetadata = r; });

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const captureFrame = async (time: number) => {
      return new Promise<void>((r) => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            frames.push(canvas.toDataURL('image/jpeg', 0.92));
          }
          r();
        };
        video.addEventListener('seeked', onSeek);
        video.currentTime = time;
      });
    };

    try {
      const duration = video.duration || 5;
      const step = duration / 6;
      for (let i = 1; i <= 5; i++) {
        await captureFrame(step * i);
      }

      clearTimeout(timeout);
      video.src = '';
      video.remove();
      resolve(frames);
    } catch (e) {
      clearTimeout(timeout);
      reject(e);
    }
  });
};

/**
 * Runs the forensic pipeline on uploaded media artifact
 */
export const runDeepfakeScan = async (
  file: File,
  previewUrl: string,
  mediaType: MediaType
): Promise<ForensicReport> => {
  let analysisInput: string | string[] = previewUrl;

  if (mediaType === MediaType.VIDEO) {
    try {
      analysisInput = await extractVideoFrames(previewUrl);
    } catch (_) {
      analysisInput = previewUrl;
    }
  }

  // Real backend neural and metadata pipeline
  const report = await analyzeMediaOnServer(analysisInput, file.name, mediaType);
  return report;
};