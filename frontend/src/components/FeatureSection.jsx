import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Zap,
  Lock,
  Search,
  Palette,
  Code,
  Cloud,
  Share2,
  Smartphone,
} from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Blazing fast performance with instant search and real-time sync. Your notes are always ready when you need them.',
      position: 'left',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description:
        'End-to-end encryption keeps your notes safe. Your data belongs to you, and only you.',
      position: 'right',
    },
    {
      icon: Search,
      title: 'Powerful Search',
      description:
        'Find anything instantly with our advanced search. Filter by tags, dates, or full-text search across all your notes.',
      position: 'left',
    },
    {
      icon: Palette,
      title: 'Rich Text Editing',
      description:
        'Beautiful editor with markdown support, syntax highlighting, and formatting options. Write like a pro.',
      position: 'right',
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description:
        'Built by developers, for developers. Code blocks, syntax highlighting, and keyboard shortcuts you will love.',
      position: 'left',
    },
    {
      icon: Share2,
      title: 'Seamless Collaboration',
      description:
        'Share notes with your team, collaborate in real-time, and keep everyone on the same page.',
      position: 'right',
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-6"
          >
            <span className="text-sm font-medium text-brand">Features</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Everything you need to{' '}
            <span className="gradient-text">stay organized</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            Powerful features designed to make note-taking effortless and enjoyable.
          </motion.p>
        </div>

        {/* Feature Blocks */}
        <div className="space-y-32">
          {features.map((feature, index) => (
            <FeatureBlock key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Cloud,
              title: 'Cloud Sync',
              description: 'Access your notes from anywhere, on any device.',
            },
            {
              icon: Smartphone,
              title: 'Mobile Ready',
              description: 'Fully responsive design that works on all devices.',
            },
            {
              icon: Zap,
              title: 'Offline Mode',
              description: 'Keep working even without an internet connection.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl glass hover:bg-secondary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors">
                <item.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureBlock = ({ feature, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const isLeft = feature.position === 'left';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
        isLeft ? '' : 'lg:grid-flow-dense'
      }`}
    >
      {/* Content */}
      <div className={isLeft ? '' : 'lg:col-start-2'}>
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 glow">
          <feature.icon className="w-8 h-8 text-brand" />
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {feature.description}
        </p>
        <div className="flex items-center space-x-2 text-brand font-medium group cursor-pointer">
          <span>Learn more</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Visual */}
      <div className={isLeft ? 'lg:col-start-2' : 'lg:col-start-1'}>
        <div className="relative">
          <div className="aspect-square rounded-3xl glass p-12 flex items-center justify-center relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Large icon */}
            <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
              <feature.icon className="w-32 h-32 text-brand" strokeWidth={1.5} />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-brand/10 blur-xl" />
            <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-brand-light/10 blur-xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureSection;
