
'use server';

/**
 * @fileOverview Analyzes subcontracting opportunities and suggests relevant vendor qualifications.
 *
 * - analyzeOpportunity - A function that analyzes opportunity details.
 * - AnalyzeOpportunityInput - The input type for the analyzeOpportunity function.
 * - AnalyzeOpportunityOutput - The return type for the analyzeOpportunity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeOpportunityInputSchema = z.object({
  opportunityDescription: z
    .string()
    .describe('Detailed description of the subcontracting opportunity or RFP requirements.'),
  desiredBudget: z.string().optional().describe('The estimated budget or value of the opportunity.'),
  timeline: z.string().optional().describe('The expected timeline or duration of the work.'),
  requiredSkillsInput: z.string().optional().describe('Comma-separated list of essential skills provided by the user.'),
  diversityGoalsInput: z.string().optional().describe('Text description of diversity goals or supplier preferences (e.g., "Seeking 20% WOSB participation", "MBEs encouraged to apply").'),
  complianceRequirementsInput: z.string().optional().describe('Comma-separated list of key compliance needs (e.g., "ITAR, CMMC Level 2").')
});
export type AnalyzeOpportunityInput = z.infer<
  typeof AnalyzeOpportunityInputSchema
>;

const AnalyzeOpportunityOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('List of key skills likely required for the opportunity based on the description.'),
  suggestedExperience: z
    .string()
    .describe('Description of the suggested vendor experience level and domain expertise.'),
  suggestedCertifications: z
    .array(z.string())
    .describe('List of relevant certifications (e.g., "SBA 8a", "ISO 9001", "WOSB") that vendors should possess.'),
  keyComplianceAreas: z
    .array(z.string())
    .describe('Key compliance areas or regulations (e.g., "FISMA", "HIPAA", "ITAR") pertinent to the opportunity.'),
  potentialMatchKeywords: z
    .array(z.string())
    .describe('Keywords to help match vendors to this opportunity (e.g., industry, specific tech, type of service).')
});
export type AnalyzeOpportunityOutput = z.infer<
  typeof AnalyzeOpportunityOutputSchema
>;

export async function analyzeOpportunity(
  input: AnalyzeOpportunityInput
): Promise<AnalyzeOpportunityOutput> {
  return analyzeOpportunityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeOpportunityPrompt',
  input: {schema: AnalyzeOpportunityInputSchema},
  output: {schema: AnalyzeOpportunityOutputSchema},
  prompt: `You are an expert in analyzing subcontracting opportunities, RFPs, and government solicitations. Your role is to help prime contractors and large enterprises identify the ideal qualifications for small business partners.

Analyze the provided opportunity details. Based on this, you will:
1.  Identify and list the most critical skills required.
2.  Describe the ideal level and type of experience a vendor should have.
3.  Suggest relevant business certifications (e.g., minority-owned, veteran-owned, SBA 8a, ISO 9001, CMMC) that would make a vendor a strong candidate, especially if diversity goals are mentioned.
4.  Pinpoint key compliance areas or regulations (e.g., FISMA, HIPAA, ITAR, specific FAR clauses) that are likely important.
5.  Generate a list of keywords that can be used for matching suitable vendors to this opportunity. These keywords should cover industry, specific technologies or services, and any special requirements.

Opportunity Details:
Description: {{{opportunityDescription}}}
{{#if desiredBudget}}Budget: {{{desiredBudget}}}{{/if}}
{{#if timeline}}Timeline: {{{timeline}}}{{/if}}
{{#if requiredSkillsInput}}User-Provided Required Skills: {{{requiredSkillsInput}}}{{/if}}
{{#if diversityGoalsInput}}Stated Diversity Goals/Preferences: {{{diversityGoalsInput}}}{{/if}}
{{#if complianceRequirementsInput}}User-Provided Compliance Needs: {{{complianceRequirementsInput}}}{{/if}}

Provide your analysis in the specified output format.
Focus on practical, actionable suggestions for finding qualified subcontractors.
If diversity goals are mentioned (e.g., WOSB, MBE, VOSB), ensure your suggested certifications reflect these priorities.
`,
});

const analyzeOpportunityFlow = ai.defineFlow(
  {
    name: 'analyzeOpportunityFlow',
    inputSchema: AnalyzeOpportunityInputSchema,
    outputSchema: AnalyzeOpportunityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
