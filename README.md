
# SubConnect

SubConnect is an AI-powered matchmaking and qualification platform designed to connect small businesses (SMBs) with subcontracting opportunities from large enterprises, government contractors, and prime vendors.

It streamlines the process of finding qualified small business partners, aiding enterprises in meeting compliance requirements (like supplier diversity quotas) while providing SMBs access to large-scale contracts.

## Core Features:

*   **For Small Businesses (Vendors):**
    *   Smart Matchmaking: AI connects vendors to relevant subcontracting opportunities.
    *   Opportunity Feed: Real-time listings of subcontracts.
    *   Profile Builder: Guided setup for project history, certifications, etc.
    *   Readiness Check (Conceptual): Helps vendors understand qualification needs.
*   **For Large Businesses (Buyers / Contractors):**
    *   Vendor Discovery: Find qualified, verified SMB partners.
    *   Compliance Dashboard (Conceptual): Track SMB engagement metrics.
    *   RFP & Subcontract Posting: Manage subcontracting needs.
    *   Automated Shortlisting: AI curates top vendor matches.

## Getting Started

To explore the application:

1.  The main dashboard is at `src/app/(app)/page.tsx`.
2.  Vendor (SMB) related pages are in `src/app/(app)/vendors/`.
3.  Opportunity (Subcontract) related pages are in `src/app/(app)/opportunities/`.
4.  AI logic (Genkit flows) can be found in `src/ai/flows/`.

This is a Next.js application using React, ShadCN UI, Tailwind CSS, and Genkit for AI functionalities.
