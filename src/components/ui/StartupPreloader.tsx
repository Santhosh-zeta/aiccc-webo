import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** How long the loader runs before the site appears (ms). */
const DURATION = 3600;

// The AI Club mark, split so each part can be drawn on in turn.
const LEFT = [
  'M98 26 C76 8 40 12 30 42 C10 50 6 82 20 96 C12 118 24 142 48 146 C54 166 76 178 98 170',
  'M46 52 C56 62 62 70 64 82',
  'M30 98 C44 96 52 104 60 116',
  'M48 124 C60 124 66 132 70 144',
  'M70 56 C78 60 84 64 90 72',
];
const RIGHT = [
  'M102 26 C124 8 160 12 170 42 C190 50 194 82 180 96 C188 118 176 142 152 146 C146 166 124 178 102 170',
  'M154 52 C144 62 138 70 136 82',
  'M170 98 C156 96 148 104 140 116',
  'M152 124 C140 124 134 132 130 144',
  'M130 56 C122 60 116 64 110 72',
  'M102 60 H128 L136 68',
  'M102 120 H124',
  'M136 92 H160',
  'M124 150 L134 160 H146',
];
const NODES: [number, number, number][] = [[128, 60, 5], [160, 92, 5], [146, 160, 5], [124, 120, 4], [186, 82, 4]];
const LETTERS = 'AI CLUB'.split('');

/**
 * Intro: the club mark is drawn on in glowing lines (grey hemisphere, then the blue circuit
 * traces), the nodes light up, the AIC chip powers on and light keeps travelling along the
 * circuits while the wordmark appears and the bar fills. SVG and CSS only, no extra library.
 */
const StartupPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const duration = reduce ? 900 : DURATION;

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else setTimeout(onComplete, 300);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete, duration]);

  const d = (t: number) => (reduce ? 0 : t);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F4F8FD]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <style>{`
        .ldr-grid { background-image: linear-gradient(rgba(49,135,232,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(49,135,232,.07) 1px, transparent 1px); background-size: 44px 44px; mask-image: radial-gradient(circle at 50% 45%, #000, transparent 70%); -webkit-mask-image: radial-gradient(circle at 50% 45%, #000, transparent 70%); }
        .ldr-halo { animation: ldr-halo 2.6s ease-in-out infinite; }
        .ldr-orbit { animation: ldr-orbit 12s linear infinite; transform-origin: 50% 50%; }
        .ldr-run { stroke-dasharray: .09 .91; animation: ldr-run 1.8s linear infinite; }
        .ldr-scan { animation: ldr-scan 2.2s ease-in-out infinite; }
        @keyframes ldr-halo { 0%,100% { opacity: .55; transform: scale(.94); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes ldr-orbit { to { transform: rotate(360deg); } }
        @keyframes ldr-run { 0% { stroke-dashoffset: 1; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        @keyframes ldr-scan { 0% { transform: translateY(-6%); opacity: 0; } 20%,80% { opacity: .9; } 100% { transform: translateY(106%); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .ldr-halo, .ldr-orbit, .ldr-run, .ldr-scan { animation: none !important; } }
      `}</style>

      <div className="ldr-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]">
        {/* Glow behind the mark */}
        <div className="ldr-halo absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(49,135,232,.35),rgba(49,135,232,0)_68%)]" />

        {/* Thin orbit with a travelling dot */}
        <svg viewBox="0 0 400 400" className="ldr-orbit absolute inset-0" aria-hidden="true">
          <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(49,135,232,.28)" strokeWidth="1" strokeDasharray="2 7" />
          <circle cx="200" cy="10" r="5" fill="#3187E8" style={{ filter: 'drop-shadow(0 0 8px rgba(49,135,232,.95))' }} />
        </svg>

        <svg viewBox="-10 -4 220 208" className="absolute inset-[6%] h-[88%] w-[88%] overflow-visible" role="img" aria-label="AI Club VIT Chennai">
          <defs>
            <filter id="ldr-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.8" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="ldr-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3187E8" stopOpacity="0" />
              <stop offset="1" stopColor="#3187E8" stopOpacity=".5" />
            </linearGradient>
            <clipPath id="ldr-clip"><rect x="-10" y="-4" width="220" height="208" /></clipPath>
          </defs>

          {/* Grey hemisphere, drawn on */}
          <g fill="none" stroke="#5B6B7D" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#ldr-glow)" opacity=".95">
            {LEFT.map((p, i) => (
              <motion.path key={p} d={p} initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: d(0.1 + i * 0.12), ease: 'easeInOut' }} />
            ))}
          </g>

          {/* Blue circuit hemisphere, drawn on, then light keeps running along it */}
          <g fill="none" stroke="#3187E8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#ldr-glow)">
            {RIGHT.map((p, i) => (
              <motion.path key={p} d={p} initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: d(0.6 + i * 0.12), ease: 'easeInOut' }} />
            ))}
          </g>
          {!reduce && (
            <g fill="none" stroke="#BFE0FF" strokeWidth="2.4" strokeLinecap="round" filter="url(#ldr-glow)">
              {RIGHT.map((p, i) => (
                <path key={p} d={p} pathLength={1} className="ldr-run" style={{ animationDelay: `${2.0 + i * 0.17}s`, animationFillMode: 'backwards' }} />
              ))}
            </g>
          )}

          {/* Nodes light up */}
          {NODES.map(([cx, cy, r], i) => (
            <motion.circle
              key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#3187E8" filter="url(#ldr-glow)"
              initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'fill-box' }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: d(1.5 + i * 0.1) }}
            />
          ))}

          {/* The AIC chip powers on */}
          <motion.rect
            x="58" y="78" width="84" height="60" rx="8" fill="#FFFFFF" stroke="#3187E8" strokeWidth="4.5" filter="url(#ldr-glow)"
            initial={{ pathLength: reduce ? 1 : 0, fillOpacity: reduce ? 1 : 0 }} animate={{ pathLength: 1, fillOpacity: 1 }}
            transition={{ pathLength: { duration: 0.9, delay: d(1.2) }, fillOpacity: { duration: 0.5, delay: d(2.0) } }}
          />
          <motion.text
            x="100" y="116" textAnchor="middle" fontFamily="'Saira Semi Condensed','Space Grotesk',sans-serif" fontWeight="800" fontSize="28" fill="#3187E8"
            initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: d(2.1) }}
          >
            AIC
          </motion.text>

          {/* A scan line sweeps the finished mark */}
          {!reduce && (
            <g clipPath="url(#ldr-clip)">
              <rect className="ldr-scan" x="-10" y="-4" width="220" height="14" fill="url(#ldr-scan)" style={{ animationDelay: '2.4s', animationFillMode: 'backwards' }} />
            </g>
          )}
        </svg>
      </div>

      {/* Wordmark */}
      <div className="mt-2 text-center" aria-hidden="true">
        <div className="flex justify-center font-display text-[34px] font-extrabold uppercase leading-none tracking-tight text-[#0B1726] sm:text-[42px]">
          {LETTERS.map((ch, i) => (
            <motion.span
              key={i}
              className={ch === ' ' ? 'w-3' : ''}
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14, filter: reduce ? 'blur(0px)' : 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, delay: d(2.2 + i * 0.06) }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="mt-2 font-mono text-[11px] tracking-[0.5em] text-primary"
          initial={{ opacity: reduce ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ delay: d(2.7), duration: 0.6 }}
        >
          VIT CHENNAI
        </motion.p>
      </div>

      {/* Progress */}
      <div className="mt-8 h-[3px] w-60 overflow-hidden rounded-full bg-[#14283D]/10">
        <div
          className="h-full origin-left rounded-full bg-[#3187E8] shadow-[0_0_12px_rgba(49,135,232,.9)]"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
      <p className="mt-3 font-mono text-[11px] tracking-[0.3em] text-[#0B1726]/55">
        {progress < 1 ? 'INITIALISING' : 'READY'} · {Math.round(progress * 100)}%
      </p>
    </motion.div>
  );
};

export default StartupPreloader;
