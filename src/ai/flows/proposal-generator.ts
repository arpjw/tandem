
'use server';
/**
 * @fileOverview Generates a project proposal based on inventory analysis for the Tandem platform.
 * - generateProposalFromInventory - A function that generates a proposal.
 * - GenerateProposalFromInventoryInputSchema - The input type.
 * - GenerateProposalFromInventoryOutputSchema - The return type.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeInventoryOutputSchema } from '@/ai/schemas/inventory-schemas'; 

export const GenerateProposalFromInventoryInputSchema = z.object({
  inventoryAnalysis: AnalyzeInventoryOutputSchema.describe("The output from the inventory analysis flow."),
  industry: z.string().describe("The industry of the buyer."),
  buyerCompanyName: z.string().optional().describe("The name of the buyer's company."),
});
export type GenerateProposalFromInventoryInput = z.infer<typeof GenerateProposalFromInventoryInputSchema>;

export const GenerateProposalFromInventoryOutputSchema = z.object({
  generatedOpportunityTitle: z.string().describe("A concise title for the subcontracting opportunity."),
  generatedOpportunityDescription: z.string().describe("A detailed description of the work needed, based on inventory shortages or needs."),
  suggestedSkills: z.array(z.string()).optional().describe("Skills likely required from a supplier."),
  estimatedBudgetRange: z.string().optional().describe("A suggested budget range for the opportunity."),
});
export type GenerateProposalFromInventoryOutput = z.infer<typeof GenerateProposalFromInventoryOutputSchema>;

export async function generateProposalFromInventory(input: GenerateProposalFromInventoryInput): Promise<GenerateProposalFromInventoryOutput> {
  return proposalFromInventoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proposalFromInventoryPrompt',
  input: {schema: GenerateProposalFromInventoryInputSchema},
  output: {schema: GenerateProposalFromInventoryOutputSchema},
  prompt: `You are a proposal writing assistant for the Tandem platform.
A buyer in the '{{{industry}}}' industry {{#if buyerCompanyName}}from '{{{buyerCompanyName}}}'{{/if}} has received an inventory analysis.
Inventory Analysis Summary: {{{inventoryAnalysis.analysisSummary}}}
Identified Reorder Needs: {{#if inventoryAnalysis.reorderSuggestions}}{{#each inventoryAnalysis.reorderSuggestions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None specified{{/if}}
Key Materials: {{#if inventoryAnalysis.keyMaterials}}{{#each inventoryAnalysis.keyMaterials}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None specified{{/if}}

Based on this, draft a subcontracting opportunity (proposal).
The proposal should clearly state the need for procuring the items/materials identified in the reorder suggestions.
Generate a compelling title and description.
Suggest key skills a supplier might need to fulfill this opportunity.
Optionally, suggest an estimated budget range if possible based on common knowledge for such materials/services in the '{{{industry}}}' industry.

Example: If reorder suggestions include 'microcontrollers' and 'circuit boards', the proposal could be about finding a supplier for electronic components.
If reorder suggestions are empty or too vague, create a generic proposal title and description for seeking suppliers in the '{{{industry}}}' industry.
`,
});

const proposalFromInventoryFlow = ai.defineFlow(
  {
    name: 'proposalFromInventoryFlow',
    inputSchema: GenerateProposalFromInventoryInputSchema,
    outputSchema: GenerateProposalFromInventoryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
     if (!output) {
      return { 
        generatedOpportunityTitle: "Manual Proposal Recommended", 
        generatedOpportunityDescription: "AI could not generate a proposal based on the inventory analysis. Please fill out the proposal details manually.", 
        suggestedSkills: [],
        estimatedBudgetRange: "To be determined"
    };
    }
    return output;
  }
);
