import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/** How long the loader runs before the site appears (ms). */
const DURATION = 2600;

/**
 * 3D intro: the brain artwork turns on a floating 3D plane inside rotating
 * rings, the logo rises beneath it, and a progress bar fills. Pure CSS 3D
 * transforms, so there is no extra library to download.
 */
const StartupPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setTimeout(onComplete, 250);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F7F9FC]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        .ldr-scene { perspective: 1100px; }
        .ldr-stage { transform-style: preserve-3d; animation: ldr-tilt 6s ease-in-out infinite; }
        .ldr-card { transform-style: preserve-3d; animation: ldr-spin 9s linear infinite; }
        .ldr-ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid rgba(49,135,232,.45); transform-style: preserve-3d; }
        .ldr-ring::after { content: ""; position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: #3187E8; box-shadow: 0 0 14px rgba(49,135,232,.8); }
        .ldr-r1 { animation: ldr-r1 5s linear infinite; }
        .ldr-r2 { animation: ldr-r2 7s linear infinite; border-color: rgba(105,172,255,.5); }
        .ldr-r3 { animation: ldr-r3 11s linear infinite; border-style: dashed; }
        @keyframes ldr-spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
        @keyframes ldr-tilt { 0%,100% { transform: rotateX(-12deg) rotateZ(-4deg); } 50% { transform: rotateX(12deg) rotateZ(4deg); } }
        @keyframes ldr-r1 { from { transform: rotateX(70deg) rotateZ(0deg); } to { transform: rotateX(70deg) rotateZ(360deg); } }
        @keyframes ldr-r2 { from { transform: rotateY(65deg) rotateZ(0deg); } to { transform: rotateY(65deg) rotateZ(-360deg); } }
        @keyframes ldr-r3 { from { transform: rotateX(20deg) rotateY(-25deg) rotateZ(0deg); } to { transform: rotateX(20deg) rotateY(-25deg) rotateZ(360deg); } }
        @media (prefers-reduced-motion: reduce) { .ldr-stage, .ldr-card, .ldr-ring { animation: none !important; } }
      `}</style>

      <div className="ldr-scene relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
        <div className="ldr-stage absolute inset-0">
          <div className="ldr-ring ldr-r1" />
          <div className="ldr-ring ldr-r2" />
          <div className="ldr-ring ldr-r3" />

          {/* The brain artwork on a spinning 3D plane */}
          <div className="absolute inset-[14%]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="ldr-card absolute inset-0">
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(11,23,38,.18)]"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <img src="/brand/hero-brain-light.png" alt="" className="h-full w-full object-cover" draggable={false} />
              </div>
              <div
                className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(11,23,38,.18)]"
                style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              >
                <img src="/brand/aic-mark.svg" alt="" className="h-full w-full object-contain p-6" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.img
        src="/brand/aic-logo-full.png"
        alt="AI Club VIT Chennai"
        className="mt-6 h-16 w-auto object-contain mix-blend-multiply sm:h-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      />

      <div className="mt-8 h-[3px] w-56 overflow-hidden rounded-full bg-[#14283D]/10">
        <div className="h-full origin-left rounded-full bg-[#3187E8]" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <p className="mt-3 font-mono text-[11px] tracking-[0.3em] text-[#0B1726]/60">
        LOADING {Math.round(progress * 100)}%
      </p>
    </motion.div>
  );
};

export default StartupPreloader;
