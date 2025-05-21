'use server';

/**
 * @fileOverview Analyzes project requirements and suggests relevant vendor skills and experience.
 *
 * - analyzeProjectRequirements - A function that analyzes project requirements and suggests skills.
 * - AnalyzeProjectRequirementsInput - The input type for the analyzeProjectRequirements function.
 * - AnalyzeProjectRequirementsOutput - The return type for the analyzeProjectRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProjectRequirementsInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('Detailed description of the project requirements.'),
  desiredBudget: z.string().describe('The budget allocated for the project.'),
  timeline: z.string().describe('The project timeline.'),
});
export type AnalyzeProjectRequirementsInput = z.infer<
  typeof AnalyzeProjectRequirementsInputSchema
>;

const AnalyzeProjectRequirementsOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('List of suggested skills for the vendor.'),
  suggestedExperience: z
    .string()
    .describe('Description of the suggested vendor experience.'),
});
export type AnalyzeProjectRequirementsOutput = z.infer<
  typeof AnalyzeProjectRequirementsOutputSchema
>;

export async function analyzeProjectRequirements(
  input: AnalyzeProjectRequirementsInput
): Promise<AnalyzeProjectRequirementsOutput> {
  return analyzeProjectRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProjectRequirementsPrompt',
  input: {schema: AnalyzeProjectRequirementsInputSchema},
  output: {schema: AnalyzeProjectRequirementsOutputSchema},
  prompt: `You are an expert in project management and vendor selection.

You will analyze the project requirements and suggest the most relevant skills and experience needed from vendors.

Project Description: {{{projectDescription}}}
Desired Budget: {{{desiredBudget}}}
Timeline: {{{timeline}}}

Based on the project description, budget, and timeline, suggest the skills and experience required from the vendors.

Skills should be a list of concise skills, each a few words.
Experience should be a paragraph.
`,
});

const analyzeProjectRequirementsFlow = ai.defineFlow(
  {
    name: 'analyzeProjectRequirementsFlow',
    inputSchema: AnalyzeProjectRequirementsInputSchema,
    outputSchema: AnalyzeProjectRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
