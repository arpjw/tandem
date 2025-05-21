export interface Vendor {
  id: string;
  name: string;
  businessDescription: string;
  expertise: string[];
  services: string[];
  portfolioLinks: string[];
  aiGeneratedProfile?: string;
  imageUrl?: string;
  yearsOfExperience?: number;
  companySize?: 'Solo' | 'Small (2-10)' | 'Medium (11-50)' | 'Large (51+)';
  industryFocus?: string[];
  availability?: string; // e.g., "Available from Q3", "Part-time"
  awardsAndCertifications?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  timeline: string;
  requiredSkills: string[];
  aiSuggestedSkills?: string[];
  aiSuggestedExperience?: string;
  imageUrl?: string;
  projectGoals?: string[];
  targetAudience?: string;
  keyDeliverables?: string[];
  companyBackground?: string; // Brief description of the company posting the project
}

export interface CommunicationMessage {
  id: string;
  sender: 'user' | 'vendor' | 'system';
  projectId: string;
  vendorId: string;
  timestamp: Date;
  content: string;
}
