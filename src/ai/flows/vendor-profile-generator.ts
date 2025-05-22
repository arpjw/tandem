
'use server';
/**
 * @fileOverview Generates a compelling vendor profile summary for Inertia, focusing on matchmaking strengths.
 *
 * - generateVendorProfileSummary - A function that generates a vendor profile summary.
 * - VendorProfileInput - The input type for the generateVendorProfileSummary function.
 * - VendorProfileOutput - The return type for the generateVendorProfileSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VendorProfileInputSchema = z.object({
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
export type VendorProfileInput = z.infer<typeof VendorProfileInputSchema>;

const VendorProfileOutputSchema = z.object({
  profileSummary: z.string().describe('A concise, compelling summary of the vendor profile, suitable for display on a matchmaking platform. Highlight strengths, certifications, and suitability for projects.'),
  suggestedKeywords: z.array(z.string()).describe('A list of 5-10 keywords that accurately represent the vendor\'s capabilities and focus, for use in search and matching algorithms. Include certifications as keywords if present.'),
  readinessAssessment: z.string().optional().describe('A brief AI assessment of the vendor\'s readiness for larger contracts/projects, based on provided info. Note any apparent strengths or areas that might need further development/clarification (e.g., "Strong certifications, but capacity information would be beneficial.").')
});
export type VendorProfileOutput = z.infer<typeof VendorProfileOutputSchema>;

export async function generateVendorProfileSummary(input: VendorProfileInput): Promise<VendorProfileOutput> {
  return generateVendorProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vendorProfileSummaryPrompt',
  input: {schema: VendorProfileInputSchema},
  output: {schema: VendorProfileOutputSchema},
  prompt: `You are an expert profile writer for Inertia, an AI-powered matchmaking platform connecting businesses with suitable vendors for their projects. Your goal is to create a concise and impactful summary that highlights a vendor's strengths and suitability for these opportunities.

Vendor Information:
Business Name: {{{businessName}}}
Business Description: {{{businessDescription}}}
{{#if expertiseAreas}}Expertise Areas: {{{expertiseAreas}}}{{/if}}
{{#if keyServicesOffered}}Key Services Offered: {{{keyServicesOffered}}}{{/if}}
{{#if certifications}}Certifications: {{{certifications}}} (Important for matching! Mention these prominently in the summary and keywords if provided.) {{/if}}
{{#if projectHighlights}}Project Highlights: {{{projectHighlights}}}{{/if}}
{{#if industryFocus}}Industry Focus: {{{industryFocus}}}{{/if}}

Based on the information provided:
1.  **Generate a Profile Summary**: Write a compelling paragraph (3-5 sentences) that a business looking to hire would find attractive. Emphasize:
    *   Key expertise and services.
    *   Relevant certifications (especially any indicating specialization or quality standards like ISO).
    *   Experience suggested by project highlights or description.
    *   Overall suitability for partnering on various projects.
    If you cannot generate a meaningful summary, return an empty string for profileSummary.
2.  **Suggest Keywords**: List 5-10 specific keywords for search and matchmaking. Include specific skills, services, certifications (e.g., "Web Development", "Cybersecurity", "Logistics", "Java", "ISO 9001"), and industry terms. If no keywords can be suggested, return an empty array for suggestedKeywords.
3.  **Readiness Assessment (Optional)**: Briefly assess the vendor's apparent readiness for projects. For example: "Strong certifications and clear expertise in X make them a promising candidate. Detailing project scale or team capacity could further strengthen their profile." or "Appears well-suited for Y type projects; adding specific project outcomes would be beneficial." If no assessment can be made, this field can be omitted or be an empty string.

Focus on making the vendor attractive to businesses seeking reliable partners.
The tone should be professional, confident, and clear.
Ensure the output matches the schema. Certifications are very important if provided.
`,
});

const generateVendorProfileFlow = ai.defineFlow(
  {
    name: 'generateVendorProfileFlow',
    inputSchema: VendorProfileInputSchema,
    outputSchema: VendorProfileOutputSchema,
  },
  async input => {
    const genkitResponse = await prompt(input);
    if (!genkitResponse.output) {
      console.error("AI Profile Generation Error: Model did not return valid structured output. Input:", input, "Genkit Response:", genkitResponse);
      // Return a default structure matching the schema
      return {
        profileSummary: '',
        suggestedKeywords: [],
        readinessAssessment: undefined, // or an empty string if preferred for optional fields
      };
    }
    return genkitResponse.output;
  }
);

