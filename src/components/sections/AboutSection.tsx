import { motion } from 'framer-motion';
import { BookOpen, Code2, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PILLARS = [
  { icon: BookOpen, title: 'Learn', text: 'Gain hands-on experience' },
  { icon: Code2, title: 'Build', text: 'Work on real projects' },
  { icon: Users, title: 'Collaborate', text: 'Meet like-minded peers' },
  { icon: Lightbulb, title: 'Create Impact', text: 'Use AI for real-world problems' },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative border-y border-border/60 bg-secondary/40 py-16 md:py-24">
      <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
            WHO WE ARE <span className="ml-3 inline-block h-px w-12 bg-primary align-middle" />
          </p>
          <h2 className="mt-4 font-heading text-3xl font-bold uppercase leading-tight text-foreground sm:text-4xl">
            A community <br />
            for <span className="text-primary">what’s next.</span>
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
            We organise workshops, talks, hackathons and collaborative projects to learn, build and create impact with AI.
          </p>
          <Link to="/team" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 lg:border-l lg:border-border/60 lg:pl-12">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <p.icon className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
