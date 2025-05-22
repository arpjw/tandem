
'use server';

/**
 * @fileOverview Analyzes project opportunities and suggests relevant vendor qualifications for the Inertia platform.
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
    .describe('Detailed description of the project opportunity or requirements.'),
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
    .optional()
    .describe('List of key skills likely required for the opportunity based on the description.'),
  suggestedExperience: z
    .string()
    .optional()
    .describe('Description of the suggested vendor experience level and domain expertise.'),
  suggestedCertifications: z
    .array(z.string())
    .optional()
    .describe('List of relevant certifications (e.g., "ISO 9001", "PMP", specific tech certs) that vendors should possess.'),
  keyComplianceAreas: z
    .array(z.string())
    .optional()
    .describe('Key compliance areas or regulations (e.g., "GDPR", "HIPAA", "SOC 2") pertinent to the opportunity.'),
  potentialMatchKeywords: z
    .array(z.string())
    .optional()
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
  prompt: `You are an expert in analyzing project opportunities and requirements for Inertia, an AI-powered vendor matchmaking platform. Your role is to help businesses identify the ideal qualifications for vendor partners.

Analyze the provided opportunity details. Based on this, you will:
1.  **Based on your analysis of the \`opportunityDescription\`, identify and list the key skills essential for successfully completing the work described.** This is your primary task for skill identification. Even if the user provides a list of skills in \`requiredSkillsInput\`, your \`suggestedSkills\` output should reflect your independent assessment of the full \`opportunityDescription\`. You can use the \`requiredSkillsInput\` as a reference or to augment your list if appropriate, but do not simply copy it. If the description does not yield any discernible skills, and \`requiredSkillsInput\` is also empty or unhelpful, then return an empty array for \`suggestedSkills\`.
2.  Describe the ideal level and type of experience a vendor should have. If not clear, return an empty string for suggestedExperience.
3.  Suggest relevant business or professional certifications (e.g., ISO 9001, specific technology certifications, PMP) that would make a vendor a strong candidate. If none are apparent, return an empty array for suggestedCertifications.
4.  Pinpoint key compliance areas or regulations (e.g., GDPR, HIPAA, SOC 2, industry-specific standards) that are likely important. If none are apparent, return an empty array for keyComplianceAreas.
5.  Generate a list of keywords that can be used for matching suitable vendors to this opportunity. These keywords should cover industry, specific technologies or services, and any special requirements. If none are apparent, return an empty array for potentialMatchKeywords.

Opportunity Details:
Description: {{{opportunityDescription}}}
{{#if desiredBudget}}Budget: {{{desiredBudget}}}{{/if}}
{{#if timeline}}Timeline: {{{timeline}}}{{/if}}
{{#if requiredSkillsInput}}User-Provided Required Skills (for reference): {{{requiredSkillsInput}}}{{/if}}
{{#if diversityGoalsInput}}Stated Diversity Goals/Preferences: {{{diversityGoalsInput}}} (Note: While Inertia focuses on skills/experience, acknowledge these if stated, but focus primary suggestions on qualifications for the work itself.) {{/if}}
{{#if complianceRequirementsInput}}User-Provided Compliance Needs (for reference): {{{complianceRequirementsInput}}}{{/if}}

Provide your analysis in the specified output format. Ensure all fields in the output schema are present, even if they are empty arrays or strings if no specific suggestions can be made.
Focus on practical, actionable suggestions for finding qualified vendors.
If diversity goals are mentioned, you can note them, but your primary analysis should focus on the direct qualifications needed to perform the work described in the opportunity.
`,
});

const analyzeOpportunityFlow = ai.defineFlow(
  {
    name: 'analyzeOpportunityFlow',
    inputSchema: AnalyzeOpportunityInputSchema,
    outputSchema: AnalyzeOpportunityOutputSchema,
  },
  async input => {
    const genkitResponse = await prompt(input);
    if (!genkitResponse.output) {
      console.error("AI Analysis Error: Model did not return valid structured output for analyzeOpportunityFlow. Genkit Response:", genkitResponse);
      // Return an empty object conforming to the now fully optional schema
      // This indicates an issue but prevents a hard crash.
      return {}; 
    }
    return genkitResponse.output;
  }
);

