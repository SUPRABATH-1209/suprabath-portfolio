import { motion } from 'framer-motion';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="mb-10 max-w-3xl"
    >
      {eyebrow && <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-amber-600 dark:text-amber-300">{eyebrow}</p>}
      <h1 className="text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">{title}</h1>
      {description && <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{description}</p>}
    </motion.div>
  );
}
