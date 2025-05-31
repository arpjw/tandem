
import { z } from 'genkit';

export const SupplierProfileInputSchema = z.object({
  businessName: z.string().describe('The name of the small business.'),
  businessDescription: z
    .string()
    .describe('A detailed description of the business, its mission, core services, and unique value proposition.'),
  expertiseAreas: z.string().optional().describe('Comma-separated list of primary expertise areas or skills (e.g., "Java, Spring Boot, Microservices").'),
  keyServicesOffered: z.string().optional().describe('Comma-separated list of key services offered (e.g., "Custom Software Development, Cloud Migration, IT Consulting").'),
  certifications: z.string().optional().describe('Comma-separated list of business certifications (e.g., "minority-owned, veteran-owned, SBA 8a, ISO 9001").'),
  projectHighlights: z.string().optional().describe('Brief, comma-separated highlights of 2-3 significant projects or achievements that showcase capability.'),
  industryFocus: z.string().optional().describe('Comma-separated list of primary industries served (e.g., "Government, Healthcare, Fintech").')
});

export const SupplierProfileOutputSchema = z.object({
  profileSummary: z.string().describe('A concise, compelling summary of the supplier profile, suitable for display on a matchmaking platform. Highlight strengths, certifications, and suitability for projects.'),
  suggestedKeywords: z.array(z.string()).describe('A list of 5-10 keywords that accurately represent the supplier\'s capabilities and focus, for use in search and matching algorithms. Include certifications as keywords if present.'),
  readinessAssessment: z.string().optional().describe('A brief AI assessment of the supplier\'s readiness for larger contracts/projects, based on provided info. Note any apparent strengths or areas that might need further development/clarification (e.g., "Strong certifications, but capacity information would be beneficial.").')
});
