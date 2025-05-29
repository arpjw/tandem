
'use server';
/**
 * @fileOverview Analyzes inventory data and suggests reordering needs for the Tandem platform.
 * - analyzeInventory - A function that analyzes inventory.
 * - AnalyzeInventoryInput - The input type for the analyzeInventory function.
 * - AnalyzeInventoryOutput - The return type for the analyzeInventory function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AnalyzeInventoryInputSchema, AnalyzeInventoryOutputSchema } from '@/ai/schemas/inventory-schemas';

export type AnalyzeInventoryInput = z.infer<typeof AnalyzeInventoryInputSchema>;
export type AnalyzeInventoryOutput = z.infer<typeof AnalyzeInventoryOutputSchema>;

export async function analyzeInventory(input: AnalyzeInventoryInput): Promise<AnalyzeInventoryOutput> {
  return inventoryAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inventoryAnalysisPrompt',
  input: {schema: AnalyzeInventoryInputSchema},
  output: {schema: AnalyzeInventoryOutputSchema},
  prompt: `You are an inventory management expert for the Tandem platform.
Analyze the following inventory data for a buyer in the '{{{industry}}}' industry.
Based on this data, identify items that likely need reordering, list key materials present, and provide a brief summary of the inventory status.

Inventory Data:
{{{inventoryData}}}

Focus on actionable insights for reordering. If the data is too vague, provide general advice based on the industry.
If no specific reorder suggestions or key materials can be confidently identified, return empty arrays for those fields.
If no summary can be made, the analysisSummary can be omitted.
`,
});

const inventoryAnalyzerFlow = ai.defineFlow(
  {
    name: 'inventoryAnalyzerFlow',
    inputSchema: AnalyzeInventoryInputSchema,
    outputSchema: AnalyzeInventoryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback for safety
      return { 
        reorderSuggestions: [], 
        keyMaterials: [], 
        analysisSummary: "AI analysis could not be completed. Please review inventory manually or provide more detailed data." 
      };
    }
    return output;
  }
);
