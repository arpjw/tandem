
import type { Vendor, Opportunity, CommunicationMessage, Industry } from './types';

export const mockVendors: Vendor[] = [
  {
    id: 'smb1',
    name: 'TechSpark Innovations LLC',
    businessDescription: 'MBE certified software development firm specializing in secure government and enterprise solutions. Proven expertise in cloud migration, data analytics, and cybersecurity compliance.',
    expertise: ['Java', 'Python', 'AWS GovCloud', 'Cybersecurity', 'Data Analytics'],
    services: ['Custom Software Development', 'Cloud Solutions Architecture', 'Security Audits', 'System Integration'],
    certifications: ['minority-owned', 'SBA 8a', 'HUBZone Certified'],
    capacitySummary: 'Team of 25 engineers, can handle projects up to $2M. Experience with Agile and DevSecOps.',
    projectHistory: [
      { title: 'DOD Logistics Platform Modernization', client: 'US Department of Defense (via Prime)', description: 'Led backend development for a critical logistics tracking system.', outcome: 'Improved system efficiency by 30%', year: 2022 },
      { title: 'State Health Data Exchange Portal', client: 'State Government Agency', description: 'Developed secure data exchange portal meeting HIPAA compliance.', outcome: 'Enabled seamless data sharing for 50+ healthcare providers', year: 2021 },
    ],
    isVerified: true,
    industry: 'Information Technology (IT)',
    naicsCodes: ['541511', '541512', '518210'],
    dunsNumber: '123456789',
    portfolioLinks: ['https://techspark.dev/casestudies'],
    imageUrl: 'https://placehold.co/600x400.png',
    aiGeneratedProfile: 'TechSpark Innovations LLC is a highly qualified, minority-owned small business with SBA 8a and HUBZone certifications. They offer specialized software development and cybersecurity services, particularly for government and large enterprise clients. Their project history demonstrates capability in delivering complex, secure solutions, making them an ideal partner for high-stakes subcontracting.',
    yearsOfExperience: 7,
    companySize: 'Medium (11-50)',
    industryFocus: ['Government Contracting', 'Defense', 'Healthcare IT'],
    availability: 'Available for new subcontracts starting Q3.',
    awardsAndCertifications: ['NIST SP 800-171 Compliant', 'ISO 27001 Certified'],
  },
  {
    id: 'smb2',
    name: 'GreenLeaf Construction Services',
    businessDescription: 'Veteran-owned general contracting and specialized trade services for commercial and public works projects. Focus on sustainable building practices.',
    expertise: ['General Contracting', 'HVAC Installation', 'LEED Certification', 'Project Management'],
    services: ['Commercial Construction', 'Renovation Projects', 'Sustainable Building Consulting'],
    certifications: ['veteran-owned', 'LEED AP'],
    capacitySummary: 'Licensed in 3 states, bonding capacity up to $5M.',
    projectHistory: [
      { title: 'University Science Building HVAC Retrofit', client: 'State University System (via Prime)', description: 'Managed HVAC system upgrade for a 5-story building.', outcome: 'Achieved 25% energy savings, completed on schedule.', year: 2023 },
    ],
    isVerified: true,
    industry: 'Construction',
    naicsCodes: ['236220', '238220'],
    imageUrl: 'https://placehold.co/600x400.png',
    yearsOfExperience: 12,
    companySize: 'Small (2-10)',
    industryFocus: ['Commercial Construction', 'Public Works', 'Education Facilities'],
    availability: 'Currently bidding on new projects.',
  },
  {
    id: 'smb3',
    name: 'AeroPrecision Engineering',
    businessDescription: 'AS9100 certified engineering firm specializing in aerospace component design and analysis.',
    expertise: ['Mechanical Engineering', 'FEA Analysis', 'CAD/CAM', 'AS9100'],
    services: ['Component Design', 'Stress Analysis', 'Prototyping'],
    certifications: ['woman-owned', 'AS9100D Certified'],
    capacitySummary: 'Team of 8 engineers, ITAR compliant facilities.',
    isVerified: false,
    industry: 'Aerospace & Defense',
    naicsCodes: ['541330'],
    dunsNumber: '987654321',
    imageUrl: 'https://placehold.co/600x400.png',
    aiGeneratedProfile: 'AeroPrecision Engineering is a woman-owned small business holding AS9100D certification, critical for aerospace manufacturing. They provide specialized engineering design and analysis services. Their ITAR compliance and focus on precision make them a strong candidate for defense and aerospace subcontracts.',
    yearsOfExperience: 6,
    companySize: 'Small (2-10)',
    industryFocus: ['Aerospace', 'Defense'],
    availability: 'Accepting new design projects.',
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp1',
    title: 'Subcontract: Cybersecurity Support for Federal Agency Portal',
    description: 'Prime contractor seeks a certified small business to provide cybersecurity monitoring, vulnerability assessment, and incident response services for a high-traffic federal agency web portal. Must have experience with FISMA and NIST guidelines.',
    budget: '$150,000 - $250,000 per year',
    timeline: '12-month base period + 2 option years',
    requiredSkills: ['Cybersecurity', 'NIST RMF', 'SIEM Tools', 'Incident Response', 'Vulnerability Management'],
    opportunityType: 'Subcontract',
    diversityGoals: [{ type: 'SBA 8(a) Certified Small Business', description: 'Preference for 8(a) certified vendors.' }],
    complianceRequirements: ['FISMA Moderate', 'NIST SP 800-53 controls', 'US Citizenship for personnel'],
    setAsideStatus: 'SBA 8(a) Competitive',
    imageUrl: 'https://placehold.co/600x400.png',
    aiSuggestedSkills: ['Splunk', 'Qualys', 'Penetration Testing', 'Security Operations Center (SOC)'],
    aiSuggestedExperience: 'Vendor should have a strong track record supporting federal government cybersecurity initiatives, with demonstrable experience in FISMA compliance and managing security for public-facing systems. CMMC certification (Level 2 or higher) is a plus.',
    aiSuggestedVendorQualifications: 'Ideal vendors will possess SBA 8(a) certification, relevant cybersecurity certifications (CISSP, CISM), and a portfolio of federal projects. Look for experience with specific government security frameworks.',
    companyBackground: 'GovServe Prime Inc. is a leading systems integrator for federal civilian agencies.',
    keyDeliverables: ['Monthly Vulnerability Reports', '24/7 Security Monitoring', 'Incident Response Plan Execution'],
  },
  {
    id: 'opp2',
    title: 'RFP: Manufacturing of Specialized Components for EV Charging Stations',
    description: 'Large manufacturing enterprise seeks proposals from small to medium-sized businesses for the production of custom-designed enclosures and mounting hardware for a new line of electric vehicle (EV) charging stations. High precision and quality control are critical.',
    budget: 'Volume-based pricing, est. $500k annual spend',
    timeline: 'Long-term supply agreement',
    requiredSkills: ['Precision Machining', 'Sheet Metal Fabrication', 'Quality Control (ISO 9001)', 'Supply Chain Management'],
    opportunityType: 'RFP Response',
    diversityGoals: [{ type: 'Minority-Owned Business Enterprise (MBE)', percentage: 15, description: 'Seeking at least 15% MBE participation.' }, {type: 'Woman-Owned Small Business (WOSB)', description: "WOSBs strongly encouraged to bid."}],
    complianceRequirements: ['ISO 9001 Certification (or equivalent)', 'Material Traceability'],
    imageUrl: 'https://placehold.co/600x400.png',
    companyBackground: 'ElectroCharge Corp. is a major player in the EV infrastructure market, expanding rapidly.',
    keyDeliverables: ['Production parts meeting specifications', 'Quality assurance documentation', 'On-time delivery performance'],
  },
  {
    id: 'opp3',
    title: 'Teaming: Logistics Support for National Disaster Relief Operations',
    description: 'Seeking logistics partners (trucking, warehousing) to team on a proposal for a large federal contract providing disaster relief logistics. Need partners with rapid deployment capabilities and experience in challenging environments.',
    budget: 'TBD based on prime contract award',
    timeline: 'Multi-year contract potential',
    requiredSkills: ['Freight Transportation', 'Warehouse Management', 'Inventory Control', 'Rapid Deployment'],
    opportunityType: 'Teaming Agreement',
    diversityGoals: [{ type: 'Veteran-Owned Small Business (VOSB)', description: 'Significant preference for VOSBs.' }, { type: 'HUBZone Certified Businesses', description: 'HUBZone businesses are encouraged.'}],
    setAsideStatus: 'Partial Small Business Set-Aside',
    imageUrl: 'https://placehold.co/600x400.png',
    aiSuggestedSkills: ['Emergency Logistics', 'FEMA regulations', 'Cold Chain Logistics (if applicable)'],
    aiSuggestedExperience: 'Partners should have documented experience in disaster relief or emergency response logistics, capable of mobilizing resources quickly. Experience with government contracting and FEMA requirements is highly beneficial.',
    aiSuggestedVendorQualifications: 'Look for VOSB or HUBZone certifications, strong past performance in logistics, and evidence of a flexible, scalable operational capacity. Asset ownership (trucks, warehouses) is a plus.',
    companyBackground: 'RapidResponse Logistics is a prime contractor specializing in emergency management services.',
  },
];

export const mockMessages: CommunicationMessage[] = [
    {
        id: 'msg1',
        opportunityId: 'opp1',
        vendorId: 'smb1',
        sender: 'user', 
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        content: 'Hello TechSpark, we are impressed with your 8(a) certification and cybersecurity experience for the Federal Agency Portal subcontract.'
    },
    {
        id: 'msg2',
        opportunityId: 'opp1',
        vendorId: 'smb1',
        sender: 'vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        content: 'Thank you for your interest! We are confident in our ability to meet the requirements. Would you be available for a capabilities briefing next week?'
    },
    {
        id: 'msg3',
        opportunityId: 'opp2',
        vendorId: 'smb3',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        content: 'AeroPrecision, regarding the EV charging components RFP, can you detail your AS9100 quality processes?'
    }
];

export const getSuggestedDocuments = (industry?: Industry | string): string[] => {
  if (!industry) return ['General Business License', 'Proof of Insurance'];
  switch (industry) {
    case 'Construction':
      return ['Contractor License', 'Bonding Information', 'Safety Certifications (e.g., OSHA 30)', 'Liability Insurance'];
    case 'Manufacturing':
      return ['ISO 9001 Certification (if applicable)', 'Quality Control Manual', 'Equipment List', 'Supplier Diversity Certifications'];
    case 'Professional, Scientific & Technical Services':
      return ['Professional Licenses (e.g., PE, CPA)', 'Errors & Omissions Insurance', 'Case Studies/Portfolio', 'Resumes of Key Personnel'];
    case 'Administrative & Support Services':
      return ['Business License', 'Client Testimonials', 'Service Level Agreements (SLAs) examples', 'Proof of Insurance'];
    case 'Transportation & Warehousing':
      return ['DOT Number', 'MC Number', 'Hazmat Certifications (if applicable)', 'Vehicle/Fleet List', 'Warehouse Certifications'];
    case 'Information Technology (IT)':
      return ['Relevant Tech Certifications (e.g., AWS, Cisco, CompTIA)', 'Cybersecurity Policies (e.g., SOC 2 report)', 'Data Privacy Policy', 'Service Organization Control (SOC) reports'];
    case 'Aerospace & Defense':
      return ['AS9100/AS9110 Certification', 'ITAR Registration Confirmation', 'CMMC Certification (if applicable)', 'Facility Security Clearance (FCL) details'];
    default:
      return ['General Business License', 'Proof of Insurance', 'Company Overview/Capability Statement'];
  }
};
