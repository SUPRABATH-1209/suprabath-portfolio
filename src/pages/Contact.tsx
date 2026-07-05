import { Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import { usePortfolioStore } from '../hooks/usePortfolioStore';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message should be at least 10 characters')
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { content } = usePortfolioStore();
  const { profile } = content;
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data: ContactForm) => {
    const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name}\nEmail: ${data.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="py-10">
      <SectionHeader eyebrow="Contact" title="Simple contact path for recruiters." description="The public site stays clean. Admin editing is separate and password-gated at /admin." />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="clean-card p-8">
            <h2 className="text-2xl font-black">Contact details</h2>
            <div className="mt-6 grid gap-4">
              <a href={`mailto:${profile.email}`} className="btn-secondary inline-flex items-center gap-3"><Mail size={18} /> {profile.email}</a>
              {profile.phone && <a href={`tel:${profile.phone}`} className="btn-secondary inline-flex items-center gap-3"><Phone size={18} /> {profile.phone}</a>}
              <span className="btn-secondary inline-flex items-center gap-3"><MapPin size={18} /> {profile.location}</span>
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-3"><Github size={18} /> GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary inline-flex items-center gap-3"><Linkedin size={18} /> LinkedIn</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={.08}>
          <form onSubmit={handleSubmit(onSubmit)} className="clean-card p-8">
            <h2 className="text-2xl font-black">Send a message</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">This opens the sender’s email app. No paid backend needed.</p>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2"><span className="form-label">Name</span><input className="form-input" {...register('name')} />{errors.name && <span className="text-sm font-bold text-red-500">{errors.name.message}</span>}</label>
              <label className="grid gap-2"><span className="form-label">Email</span><input className="form-input" {...register('email')} />{errors.email && <span className="text-sm font-bold text-red-500">{errors.email.message}</span>}</label>
              <label className="grid gap-2"><span className="form-label">Message</span><textarea className="form-input min-h-40" {...register('message')} />{errors.message && <span className="text-sm font-bold text-red-500">{errors.message.message}</span>}</label>
              <button className="btn-primary inline-flex items-center justify-center gap-2" type="submit"><Send size={18} /> Open Email Draft</button>
            </div>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
