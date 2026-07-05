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
    photoData: '/profile-placeholder.svg'
  },
  resume: {
    fileName: 'resume.pdf',
    fileUrl: '/resume.pdf'
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
  certificates: [],
  codingProfiles: []
};
