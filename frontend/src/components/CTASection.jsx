import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/20 rounded-full blur-[150px] animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl glass p-12 md:p-16 text-center glow-strong overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand-light/10" />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand/20 mb-8"
              >
                <span className="text-sm font-semibold text-brand">
                  Limited Time Offer
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Ready to transform your{' '}
                <span className="gradient-text">note-taking?</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              >
                Join thousands of users who are already taking smarter notes.
                Get started for free, no credit card required.
              </motion.p>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10"
              >
                {[
                  'Free forever plan',
                  'No credit card needed',
                  'Cancel anytime',
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <CheckCircle className="w-5 h-5 text-brand" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  to="/register"
                  className="group px-8 py-4 text-lg font-semibold text-[#0f0f0f] bg-brand hover:bg-brand-light rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-brand/50"
                >
                  <span>Get started for free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 text-lg font-semibold text-foreground bg-secondary/50 hover:bg-secondary rounded-xl transition-all"
                >
                  Contact sales
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Trusted by teams at
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
                  {['Company A', 'Company B', 'Company C', 'Company D'].map(
                    (company, index) => (
                      <div
                        key={index}
                        className="text-lg font-semibold text-muted-foreground"
                      >
                        {company}
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                stat: '99.9%',
                label: 'Uptime',
                description: 'Always available when you need it',
              },
              {
                stat: '<100ms',
                label: 'Response time',
                description: 'Lightning fast performance',
              },
              {
                stat: '24/7',
                label: 'Support',
                description: 'Here to help anytime',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl glass hover:bg-secondary/30 transition-all"
              >
                <div className="text-4xl font-bold gradient-text mb-2">
                  {item.stat}
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">
                  {item.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
