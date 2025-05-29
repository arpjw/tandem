
import { z } from 'genkit';

export const AnalyzeInventoryInputSchema = z.object({
  inventoryData: z.string().describe("Raw text or structured data describing current inventory levels and items."),
  industry: z.string().describe("The industry of the buyer, to provide context for inventory items."),
});

export const AnalyzeInventoryOutputSchema = z.object({
  reorderSuggestions: z.array(z.string()).optional().describe("List of items or materials that likely need reordering."),
  keyMaterials: z.array(z.string()).optional().describe("List of key materials identified from the inventory data."),
  analysisSummary: z.string().optional().describe("A brief summary of the inventory status."),
});
