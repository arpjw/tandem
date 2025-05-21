'use server';
/**
 * @fileOverview Generates a vendor profile based on a short description of the business.
 *
 * - generateVendorProfile - A function that generates a vendor profile.
 * - VendorProfileInput - The input type for the generateVendorProfile function.
 * - VendorProfileOutput - The return type for the generateVendorProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VendorProfileInputSchema = z.object({
  businessDescription: z
    .string()
    .describe('A short description of the business, including its expertise, services, and portfolio.'),
});
export type VendorProfileInput = z.infer<typeof VendorProfileInputSchema>;

const VendorProfileOutputSchema = z.object({
  profile: z.string().describe('A detailed vendor profile generated from the business description.'),
});
export type VendorProfileOutput = z.infer<typeof VendorProfileOutputSchema>;

export async function generateVendorProfile(input: VendorProfileInput): Promise<VendorProfileOutput> {
  return generateVendorProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'vendorProfilePrompt',
  input: {schema: VendorProfileInputSchema},
  output: {schema: VendorProfileOutputSchema},
  prompt: `You are an expert profile generator for small businesses.

You will generate a detailed profile showcasing their expertise, services, and portfolio based on the provided description.

Description: {{{businessDescription}}}`,
});

const generateVendorProfileFlow = ai.defineFlow(
  {
    name: 'generateVendorProfileFlow',
    inputSchema: VendorProfileInputSchema,
    outputSchema: VendorProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
