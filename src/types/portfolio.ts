export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  techStack: string[];
  imageData?: string;
  videoUrl?: string;
  videoData?: string; // Backward compatibility only. New uploads use IndexedDB.
  videoBlobKey?: string;
  videoFileName?: string;
  videoSizeMb?: number;
  featured?: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: string;
  credentialId?: string;
  certificateLink?: string;
  imageData?: string;
  createdAt: string;
}

export interface CodingProfile {
  id: string;
  platform: string;
  profileUrl: string;
  notes?: string;
}

export interface PortfolioContent {
  profile: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    about: string;
    objective: string;
    photoData: string;
  };
  resume: {
    fileName: string;
    fileUrl: string;
  };
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  codingProfiles: CodingProfile[];
}
