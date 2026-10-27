import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Instagram, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRecruitmentWindow } from '@/hooks/useRecruitmentWindow';
import { RECRUITMENT_CLOSED, INSTAGRAM_URL } from '@/config/recruitment';

const STATS = [
  { value: '50+', label: 'Active Members' },
  { value: '10+', label: 'Events Every Year' },
  { value: '20+', label: 'Projects Built' },
  { value: '∞', label: 'Ideas Ahead' },
];

const HeroSection = () => {
  const { user } = useAuth();
  const [hasApplied, setHasApplied] = useState(false);
  const [canBookSlot, setCanBookSlot] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  // Server-evaluated: the manual switch AND the scheduled window.
  const { isOpen: isRecruitmentOpen } = useRecruitmentWindow();

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setHasApplied(false);
        setCanBookSlot(false);
        setIsBooked(false);
        setIsSelected(false);
        return;
      }
      const { data } = await supabase
        .from('applications')
        .select('id, status, shortlist_notified')
        .or(`user_id.eq.${user.uid},email.eq.${user.email}`)
        .limit(1);

      if (data && data.length > 0) {
        setHasApplied(true);
        const app = data[0];
        const st = app.status;
        // Gated on shortlist_notified: a shortlisted applicant who has not been
        // emailed yet must not be told they can book.
        if (st === 'shortlisted' && app.shortlist_notified === true) setCanBookSlot(true);
        else if (st === 'interview_scheduled') setIsBooked(true);
        else if (['selected', 'active_member'].includes(st)) setIsSelected(true);
      }
    };

    checkStatus();
  }, [user]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // One primary call-to-action, chosen from the recruitment state. Checked in order.
  const cta = RECRUITMENT_CLOSED
    ? { kind: 'link' as const, label: 'Follow on Instagram', href: INSTAGRAM_URL, icon: Instagram }
    : canBookSlot
      ? { kind: 'router' as const, label: 'Book Slot', to: '/schedule', icon: ArrowRight }
      : isBooked
        ? { kind: 'router' as const, label: 'View Interview Slot', to: '/status', icon: Video }
        : isSelected
          ? { kind: 'router' as const, label: 'Application Selected', to: '/status', icon: ArrowRight }
          : hasApplied
            ? { kind: 'disabled' as const, label: 'Application Received', icon: ArrowRight }
            : !isRecruitmentOpen
              ? { kind: 'disabled' as const, label: 'Recruitment Closed', icon: ArrowRight }
              : { kind: 'router' as const, label: 'Join the Club', to: '/apply', icon: ArrowRight };

  const CtaIcon = cta.icon;

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-transparent pt-32 pb-16 lg:pt-36">
      <div className="container mx-auto grid items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
            LEARN <span className="text-primary">•</span> BUILD <span className="text-primary">•</span> COLLABORATE <span className="text-primary">•</span> CREATE
          </p>

          <h1 className="mt-5 font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Where human curiosity meets{' '}
            <span className="text-primary">artificial intelligence.</span>
          </h1>

          <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-muted-foreground sm:text-lg">
            A student-led community at VIT Chennai, exploring AI through learning, building and collaboration.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta.kind === 'link' && (
              <Button size="lg" className="h-12 rounded-lg px-7 font-heading font-semibold" asChild>
                <a href={cta.href} target="_blank" rel="noopener noreferrer">
                  {cta.label}
                  <CtaIcon className="ml-2 h-5 w-5" />
                </a>
              </Button>
            )}
            {cta.kind === 'router' && (
              <Button size="lg" className="h-12 rounded-lg px-7 font-heading font-semibold" asChild>
                <Link to={cta.to}>
                  {cta.label}
                  <CtaIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {cta.kind === 'disabled' && (
              <Button size="lg" className="h-12 rounded-lg px-7 font-heading font-semibold" disabled>
                {cta.label}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-lg border-primary/70 bg-transparent px-7 font-heading font-semibold text-foreground hover:bg-primary/10"
              onClick={() => scrollToSection('#events')}
            >
              Explore Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0">
            {STATS.map((s, i) => (
              <div key={s.label} className={`sm:px-5 ${i > 0 ? 'sm:border-l sm:border-border' : ''}`}>
                <div className="font-heading text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual: the generated half-brain with circuit traces */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[640px]"
        >
          <img
            src="/brand/hero-brain-light.png"
            alt=""
            aria-hidden="true"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </div>

      <button
        onClick={() => scrollToSection('#about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Scroll to about the club"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </button>
    </section>
  );
};

export default HeroSection;
