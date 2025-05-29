
export interface Supplier { // Renamed from Vendor
  id: string;
  name: string; // Business Name
  businessDescription: string;
  expertise: string[]; // Core competencies / skills
  services: string[]; // Specific services offered
  industry?: string; // Primary industry of the supplier (vendor)

  certifications?: string[]; // e.g., 'minority-owned', 'veteran-owned', 'SBA 8a', 'HUBZone'
  capacitySummary?: string; // e.g., "Handles projects up to $500k", "Team of 15 engineers"
  projectHistory?: Array<{ // Resume-style project history
    title: string;
    client: string;
    description: string;
    outcome: string;
    year: number;
  }>;
  isVerified?: boolean; // Verification status
  naicsCodes?: string[]; // North American Industry Classification System codes
  dunsNumber?: string; // DUNS number for government contracting

  portfolioLinks?: string[]; // Optional: links to website, case studies
  aiGeneratedProfile?: string; // AI-generated summary
  imageUrl?: string;
  yearsOfExperience?: number;
  companySize?: 'Solo' | 'Small (2-10)' | 'Medium (11-50)' | 'Large (51+)';
  industryFocus?: string[]; 
  availability?: string;
  awardsAndCertifications?: string[];
}

export interface OpportunityBid {
  supplierId: string;
  opportunityId: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  budget: string;
  timeline: string;
  requiredSkills: string[];

  industry?: string; // Industry of the buyer posting the opportunity
  inventoryData?: string; // Optional raw inventory data from buyer
  aiInventoryAnalysis?: string; // Optional AI analysis of inventory

  opportunityType?: string;
  diversityGoals?: Array<{
    type: string;
    percentage?: number;
    description?: string;
  }>;
  complianceRequirements?: string[];
  setAsideStatus?: string;

  aiSuggestedSkills?: string[];
  aiSuggestedExperience?: string;
  aiSuggestedVendorQualifications?: string; 

  imageUrl?: string;
  companyBackground?: string;
  keyDeliverables?: string[];
  targetAudience?: string; 
  bids?: OpportunityBid[];
}

export interface CommunicationMessage {
  id: string;
  sender: 'user' | 'supplier' | 'system'; // 'user' could be prime contractor/buyer
  opportunityId: string;
  supplierId: string; // Renamed from vendorId
  timestamp: Date;
  content: string;
}

export const Industries = [
  'Construction',
  'Manufacturing',
  'Professional, Scientific & Technical Services',
  'Administrative & Support Services',
  'Transportation & Warehousing',
  'Information Technology (IT)',
  'Aerospace & Defense',
  'Other',
] as const;

export type Industry = typeof Industries[number];
