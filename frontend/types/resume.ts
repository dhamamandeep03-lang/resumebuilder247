export interface Education {
  school: string;
  degree: string;
  year: string;
}

export interface Experience {
  company: string;
  role: string;
  city: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Project {
  title: string;
  link?: string;
  details: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
}

export interface PositionOfResponsibility {
  title: string;
  organization: string;
  description: string[];
}

export interface ResumeData {
  name: string;
  dob: string;
  email: string;
  contact: string;
  city: string;
  summary: string;

  skills: string[];
  hobbies: string[];

  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  positionsOfResponsibility: PositionOfResponsibility[];

  template: string; 
  color: string;
}
