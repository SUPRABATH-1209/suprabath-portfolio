import type { PortfolioContent } from '../types/portfolio';

export const initialContent: PortfolioContent = {
  profile: {
    name: 'Suprabath Behera',
    headline: 'Java Backend Developer | Spring Boot Developer | Software Engineer',
    location: 'Andhra Pradesh, India',
    email: 'beherasuprabath@gmail.com',
    phone: '',
    github: 'https://github.com/SUPRABATH-1209',
    linkedin: 'https://www.linkedin.com/in/behera-suprabath-a6515126a/',
    about:
      'Java Backend Developer focused on building clean, practical and database-backed applications using Spring Boot, REST APIs and SQL.',
    objective:
      'Looking for Java Backend Developer, Spring Boot Developer and Software Engineer roles where I can contribute to reliable backend systems and keep improving through real engineering work.',
    photoData: '/sup.png'
  },

  resume: {
    fileName: 'SUPRABATH_RESUME.pdf',
    fileUrl: '/SUPRABATH_RESUME.pdf'
  },

  skills: [
    { id: 'java', name: 'Java', category: 'Backend', level: 'Advanced' },
    { id: 'spring-boot', name: 'Spring Boot', category: 'Backend', level: 'Intermediate' },
    { id: 'hibernate', name: 'Hibernate', category: 'Backend', level: 'Intermediate' },
    { id: 'mysql', name: 'MySQL', category: 'Database', level: 'Intermediate' },
    { id: 'sql', name: 'SQL', category: 'Database', level: 'Intermediate' },
    { id: 'rest-apis', name: 'REST APIs', category: 'Backend', level: 'Intermediate' },
    { id: 'git', name: 'Git', category: 'Tools', level: 'Intermediate' },
    { id: 'github', name: 'GitHub', category: 'Tools', level: 'Intermediate' },
    { id: 'postman', name: 'Postman', category: 'Tools', level: 'Intermediate' },
    { id: 'python', name: 'Python Basic', category: 'Programming', level: 'Beginner' },
    { id: 'power-bi', name: 'Power BI', category: 'Analytics', level: 'Beginner' },
    { id: 'html', name: 'HTML', category: 'Frontend', level: 'Intermediate' },
    { id: 'css', name: 'CSS', category: 'Frontend', level: 'Intermediate' },
    { id: 'javascript', name: 'JavaScript', category: 'Frontend', level: 'Intermediate' }
  ],

  projects: [],

  certificates: [
    {
      id: 'infosys-internship-smart-medication',
      title: 'Internship 6.0 — Smart Medication Tracking System with Automated Prescription Management',
      issuer: 'Infosys Springboard',
      issueDate: 'June 1, 2026',
      category: 'Internship',
      credentialId: '',
      certificateLink: '/certificates/1780368072975.jpg',
      imageData: '/certificates/1780368072975.jpg',
      createdAt: '2026-06-01'
    },
    {
      id: 'nptel-introduction-to-machine-learning',
      title: 'Introduction to Machine Learning',
      issuer: 'NPTEL / IIT Kharagpur',
      issueDate: 'Jul–Sep 2024',
      category: 'Machine Learning',
      credentialId: '',
      certificateLink: '/certificates/1729438886397.jpg',
      imageData: '/certificates/1729438886397.jpg',
      createdAt: '2024-09-30'
    },
    {
      id: 'oracle-oci-ai-foundations-associate',
      title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle University',
      issueDate: 'May 21, 2025',
      category: 'Cloud / AI',
      credentialId: '',
      certificateLink: '/certificates/1747852451808.jpg',
      imageData: '/certificates/1747852451808.jpg',
      createdAt: '2025-05-21'
    },
    {
      id: 'cisco-python-essentials-2',
      title: 'Python Essentials 2',
      issuer: 'Cisco Networking Academy',
      issueDate: 'May 26, 2025',
      category: 'Python',
      credentialId: '',
      certificateLink: '/certificates/1748353964198.jpg',
      imageData: '/certificates/1748353964198.jpg',
      createdAt: '2025-05-26'
    },
    {
      id: 'deeplearning-ai-supervised-machine-learning',
      title: 'Supervised Machine Learning: Regression and Classification',
      issuer: 'DeepLearning.AI / Stanford Online / Coursera',
      issueDate: 'October 14, 2024',
      category: 'Machine Learning',
      credentialId: '',
      certificateLink: '/certificates/1728708952975.jpg',
      imageData: '/certificates/1728708952975.jpg',
      createdAt: '2024-10-14'
    },
    {
      id: 'ibm-artificial-intelligence-fundamentals',
      title: 'Artificial Intelligence Fundamentals',
      issuer: 'IBM SkillsBuild',
      issueDate: 'May 25, 2025',
      category: 'Artificial Intelligence',
      credentialId: '',
      certificateLink: '/certificates/1748410732741.jpg',
      imageData: '/certificates/1748410732741.jpg',
      createdAt: '2025-05-25'
    },
    {
      id: 'coursera-fundamentals-of-java-programming',
      title: 'Fundamentals of Java Programming',
      issuer: 'Board Infinity / Coursera',
      issueDate: 'May 18, 2025',
      category: 'Java',
      credentialId: '',
      certificateLink: '/certificates/1747552756174.jpg',
      imageData: '/certificates/1747552756174.jpg',
      createdAt: '2025-05-18'
    },
    {
      id: 'blackbucks-ai-ml-engineer-internship',
      title: 'Artificial Intelligence and ML Engineer Internship',
      issuer: 'Blackbucks Education',
      issueDate: 'March 6, 2026',
      category: 'Internship',
      credentialId: 'BBEDAPSCHE2026LT00140',
      certificateLink: '/certificates/1773122558787.jpg',
      imageData: '/certificates/1773122558787.jpg',
      createdAt: '2026-03-06'
    },
    {
      id: 'tcs-ion-career-edge-young-professional',
      title: 'TCS iON Career Edge — Young Professional',
      issuer: 'TCS iON',
      issueDate: 'May 2025',
      category: 'Career Skills',
      credentialId: '',
      certificateLink: '/certificates/1747147395169.jpg',
      imageData: '/certificates/1747147395169.jpg',
      createdAt: '2025-05-28'
    },
    {
      id: 'infosys-introduction-to-artificial-intelligence',
      title: 'Introduction to Artificial Intelligence',
      issuer: 'Infosys Springboard',
      issueDate: 'October 13, 2024',
      category: 'Artificial Intelligence',
      credentialId: '',
      certificateLink: '/certificates/1729438878764.jpg',
      imageData: '/certificates/1729438878764.jpg',
      createdAt: '2024-10-13'
    }
  ],

  codingProfiles: []
}