export interface Vendor {
  id: string;
  name: string;
  businessDescription: string;
  expertise: string[];
  services: string[];
  portfolioLinks: string[];
  aiGeneratedProfile?: string;
  imageUrl?: string;
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
}

export interface CommunicationMessage {
  id: string;
  sender: 'user' | 'vendor' | 'system';
  projectId: string;
  vendorId: string;
  timestamp: Date;
  content: string;
}
