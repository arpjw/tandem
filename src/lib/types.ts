
export interface Vendor { // Small Business / Vendor
  id: string;
  name: string; // Business Name
  businessDescription: string;
  expertise: string[]; // Core competencies / skills
  services: string[]; // Specific services offered
  industry?: string; // Primary industry of the vendor

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
  industryFocus?: string[]; // This might be redundant if 'industry' is primary, or can be more specific sub-sectors
  availability?: string;
  awardsAndCertifications?: string[]; // Kept for additional accolades
}

export interface Opportunity { // Formerly Project, now Subcontracting Opportunity / RFP
  id: string;
  title: string;
  description: string; // Detailed description of the work needed
  budget: string;
  timeline: string;
  requiredSkills: string[]; // Key skills/technologies needed from the subcontractor

  opportunityType?: string; // e.g., "Subcontract", "RFP Response", "Teaming Agreement"
  diversityGoals?: Array<{ // Specific diversity requirements/goals
    type: string; // e.g., "Minority-Owned Business", "Woman-Owned Small Business"
    percentage?: number;
    description?: string;
  }>;
  complianceRequirements?: string[]; // e.g., "ITAR Compliant", "CMMC Level 2 Required"
  setAsideStatus?: string; // e.g., "SBA 8(a) Set-Aside", "WOSB Set-Aside"

  aiSuggestedSkills?: string[]; // AI analysis output
  aiSuggestedExperience?: string; // AI analysis output
  aiSuggestedVendorQualifications?: string; // AI analysis output on vendor qualifications

  imageUrl?: string; // Optional image for the opportunity
  companyBackground?: string; // Background of the prime contractor/enterprise posting
  keyDeliverables?: string[];
  targetAudience?: string; // (If applicable, e.g., for a marketing subcontract)
}

export interface CommunicationMessage {
  id: string;
  sender: 'user' | 'vendor' | 'system'; // 'user' could be prime contractor, 'vendor' is SMB
  opportunityId: string; // Changed from projectId
  vendorId: string;
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
