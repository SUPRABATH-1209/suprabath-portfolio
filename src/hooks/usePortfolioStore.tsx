import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { initialContent } from '../data/initialContent';
import type { PortfolioContent, Skill, Project, Certificate, CodingProfile } from '../types/portfolio';
import { useLocalStorageState } from './useLocalStorageState';

interface PortfolioStore {
  content: PortfolioContent;
  setContent: (next: PortfolioContent) => void;
  resetContent: () => void;
  updateProfile: (profile: PortfolioContent['profile']) => void;
  updateResume: (resume: PortfolioContent['resume']) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  addCertificate: (certificate: Certificate) => void;
  updateCertificate: (certificate: Certificate) => void;
  removeCertificate: (id: string) => void;
  addCodingProfile: (profile: CodingProfile) => void;
  removeCodingProfile: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioStore | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useLocalStorageState<PortfolioContent>('suprabath-portfolio-content-v3', initialContent);

  const store = useMemo<PortfolioStore>(() => ({
    content,
    setContent,
    resetContent: () => setContent(initialContent),
    updateProfile: (profile) => setContent({ ...content, profile }),
    updateResume: (resume) => setContent({ ...content, resume }),
    addSkill: (skill) => setContent({ ...content, skills: [...content.skills, skill] }),
    updateSkill: (skill) => setContent({ ...content, skills: content.skills.map((item) => (item.id === skill.id ? skill : item)) }),
    removeSkill: (id) => setContent({ ...content, skills: content.skills.filter((item) => item.id !== id) }),
    addProject: (project) => setContent({ ...content, projects: [project, ...content.projects] }),
    updateProject: (project) => setContent({ ...content, projects: content.projects.map((item) => (item.id === project.id ? project : item)) }),
    removeProject: (id) => setContent({ ...content, projects: content.projects.filter((item) => item.id !== id) }),
    addCertificate: (certificate) => setContent({ ...content, certificates: [certificate, ...content.certificates] }),
    updateCertificate: (certificate) => setContent({ ...content, certificates: content.certificates.map((item) => (item.id === certificate.id ? certificate : item)) }),
    removeCertificate: (id) => setContent({ ...content, certificates: content.certificates.filter((item) => item.id !== id) }),
    addCodingProfile: (profile) => setContent({ ...content, codingProfiles: [...content.codingProfiles, profile] }),
    removeCodingProfile: (id) => setContent({ ...content, codingProfiles: content.codingProfiles.filter((item) => item.id !== id) })
  }), [content, setContent]);

  return <PortfolioContext.Provider value={store}>{children}</PortfolioContext.Provider>;
}

export function usePortfolioStore() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolioStore must be used inside PortfolioProvider');
  return context;
}
