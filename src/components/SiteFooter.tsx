import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, MessageCircle, MapPin } from 'lucide-react';
import { CLUB_LINKS } from '@/config/club';

const ICONS: Record<string, typeof Mail> = { Instagram, LinkedIn: Linkedin, WhatsApp: MessageCircle, Email: Mail };

const EXPLORE = [
  { label: 'About', to: '/#about' },
  { label: 'Events', to: '/#events' },
  { label: 'Team', to: '/team' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Calendar', to: '/calendar' },
  { label: 'Propose an event', to: '/proposals' },
];

const SiteFooter = () => (
  <footer className="bg-[#0B1726] text-white">
    <div className="mx-auto grid max-w-[1246px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr] xl:px-0">
      <div>
        <img src="/brand/aic-logo-full.png" alt="AI Club VIT Chennai" className="h-12 w-auto rounded-sm bg-white p-1" />
        <p className="mt-5 max-w-sm text-[14px] leading-6 text-white/60">
          A student-led community at VIT Chennai, exploring AI through learning, building and collaboration.
        </p>
        <p className="mt-4 flex items-center gap-2 text-[13px] text-white/60"><MapPin className="h-4 w-4 text-primary" />VIT Chennai, India</p>
      </div>

      <nav aria-label="Explore">
        <p className="font-mono text-[11px] tracking-[0.3em] text-primary">EXPLORE</p>
        <ul className="mt-4 space-y-2.5 text-[14px] text-white/70">
          {EXPLORE.map(l => (
            <li key={l.label}><Link to={l.to} className="transition-colors hover:text-white">{l.label}</Link></li>
          ))}
        </ul>
      </nav>

      <div>
        <p className="font-mono text-[11px] tracking-[0.3em] text-primary">CONNECT</p>
        <ul className="mt-4 space-y-2.5 text-[14px] text-white/70">
          {CLUB_LINKS.map(l => {
            const Icon = ICONS[l.label];
            return (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  {Icon && <Icon className="h-4 w-4 text-primary" />}{l.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1246px] flex-col gap-2 px-6 py-5 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between xl:px-0">
        <p>Copyright © 2026 AI Club VIT Chennai</p>
        <p>
          Built by{' '}
          <a href="https://sibhi.com" target="_blank" rel="noopener noreferrer" className="text-white/70 underline decoration-primary underline-offset-4 hover:text-white">Sibhi</a>
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
