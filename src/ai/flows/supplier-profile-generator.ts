
'use server';
/**
 * @fileOverview Generates a compelling supplier profile summary for Tandem, focusing on matchmaking strengths.
 *
 * - generateSupplierProfileSummary - A function that generates a supplier profile summary.
 * - SupplierProfileInput - The input type for the generateSupplierProfileSummary function.
 * - SupplierProfileOutput - The return type for the generateSupplierProfileSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; // For z.infer
import { SupplierProfileInputSchema, SupplierProfileOutputSchema } from '@/ai/schemas/supplier-profile-schemas'; // Import from new location

export type SupplierProfileInput = z.infer<typeof SupplierProfileInputSchema>;
export type SupplierProfileOutput = z.infer<typeof SupplierProfileOutputSchema>;

export async function generateSupplierProfileSummary(input: SupplierProfileInput): Promise<SupplierProfileOutput> {
  return generateSupplierProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supplierProfileSummaryPrompt',
  input: {schema: SupplierProfileInputSchema}, // Use imported schema
  output: {schema: SupplierProfileOutputSchema}, // Use imported schema
  prompt: `You are an expert profile writer for Tandem, an AI-powered matchmaking platform connecting businesses with suitable suppliers for their projects. Your goal is to create a concise and impactful summary that highlights a supplier's strengths and suitability for these opportunities.

Supplier Information:
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
3.  **Readiness Assessment (Optional)**: Briefly assess the supplier's apparent readiness for projects. For example: "Strong certifications and clear expertise in X make them a promising candidate. Detailing project scale or team capacity could further strengthen their profile." or "Appears well-suited for Y type projects; adding specific project outcomes would be beneficial." If no assessment can be made, this field can be omitted or be an empty string.

Focus on making the supplier attractive to businesses seeking reliable partners.
The tone should be professional, confident, and clear.
Ensure the output matches the schema. Certifications are very important if provided.
`,
});

const generateSupplierProfileFlow = ai.defineFlow(
  {
    name: 'generateSupplierProfileFlow',
    inputSchema: SupplierProfileInputSchema, // Use imported schema
    outputSchema: SupplierProfileOutputSchema, // Use imported schema
  },
  async input => {
    const genkitResponse = await prompt(input);
    if (!genkitResponse.output) {
      console.error("AI Profile Generation Error: Model did not return valid structured output. Input:", input, "Genkit Response:", genkitResponse);
      return {
        profileSummary: '',
        suggestedKeywords: [],
        readinessAssessment: "AI analysis could not be completed. Ensure all relevant fields are detailed.",
      };
    }
    return genkitResponse.output;
  }
);
