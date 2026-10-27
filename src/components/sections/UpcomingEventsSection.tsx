import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { fetchWebsiteEvents, todayIst } from '@/lib/club';
import type { WebsiteEvent } from '@/types/club';

interface Card {
  id: string;
  day: string;
  month: string;
  tag: string;
  title: string;
  time: string;
  place: string;
  link: string | null;
}

// Shown until the club has upcoming events in the database, so the strip is never empty.
const SAMPLE: Card[] = [
  { id: 's1', day: '21', month: 'SEP', tag: 'Workshop', title: 'Introduction to Generative AI', time: '5:00 PM – 7:00 PM', place: 'AB1 – 101', link: null },
  { id: 's2', day: '12', month: 'OCT', tag: 'Expert Talk', title: 'AI for a Better Tomorrow', time: '5:00 PM – 7:00 PM', place: 'AB1 – 101', link: null },
  { id: 's3', day: '20', month: 'NOV', tag: 'Hackathon', title: 'Build. Solve. Innovate.', time: 'All Day', place: 'VIT Chennai', link: null },
];

function toCard(e: WebsiteEvent): Card {
  const d = new Date(`${e.start_date}T00:00:00`);
  return {
    id: e.id,
    day: String(d.getDate()),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    tag: e.tags[0] ?? 'Event',
    title: e.title,
    time: 'All Day',
    place: e.is_online ? 'Online' : e.venue ?? 'VIT Chennai',
    link: e.link,
  };
}

const UpcomingEventsSection = () => {
  const [events, setEvents] = useState<WebsiteEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    fetchWebsiteEvents()
      .then(rows => { if (active) setEvents(rows); })
      .catch(() => { if (active) setEvents([]); });
    return () => { active = false; };
  }, []);

  const cards = useMemo(() => {
    const today = todayIst();
    const upcoming = (events ?? [])
      .filter(e => e.end_date >= today)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .slice(0, 3)
      .map(toCard);
    return upcoming.length ? upcoming : SAMPLE;
  }, [events]);

  return (
    <section id="upcoming-events" className="relative scroll-mt-24 pb-12 pt-8">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <p className="flex items-center font-mono text-[12px] tracking-[0.35em] text-[#0B1726]">
            UPCOMING EVENTS <span className="ml-4 inline-block h-px w-[60px] bg-primary" />
          </p>
          <a href="#events" className="inline-flex items-center gap-2 text-[14px] font-medium text-primary hover:underline">
            View All Events <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(c => {
            const inner = (
              <>
                <div className="flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center rounded-md bg-[#F1F5FB] font-heading">
                  <span className="text-[24px] font-bold leading-6 text-[#0B1726]">{c.day}</span>
                  <span className="mt-1 text-[13px] leading-none tracking-[0.15em] text-muted-foreground">{c.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-[3px] bg-primary/10 px-2.5 py-0.5 text-[12px] font-medium text-primary">{c.tag}</span>
                  <h3 className="mt-2 font-heading text-[16px] font-bold leading-5 text-[#0B1726]">{c.title}</h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" />{c.time}</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{c.place}</span>
                  </div>
                </div>
                <span className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full border border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </>
            );
            const cls = 'group flex min-h-[136px] items-start gap-4 rounded-md border border-border bg-white/80 p-5 shadow-[0_8px_24px_-16px_rgba(15,58,107,0.25)] transition-shadow hover:shadow-[0_12px_28px_-14px_rgba(15,58,107,0.35)]';
            return c.link ? (
              <a key={c.id} href={c.link} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
            ) : (
              <a key={c.id} href="#events" className={cls}>{inner}</a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
