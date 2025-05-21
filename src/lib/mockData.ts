import type { Vendor, Project, CommunicationMessage } from './types';

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Innovate Solutions Ltd.',
    businessDescription: 'Innovate Solutions Ltd. specializes in custom software development and cloud solutions. We have a strong portfolio in fintech and e-commerce.',
    expertise: ['React', 'Node.js', 'AWS', 'Fintech'],
    services: ['Web Development', 'Mobile App Development', 'Cloud Migration'],
    portfolioLinks: ['https://example.com/portfolio1', 'https://example.com/portfolio2'],
    imageUrl: 'https://placehold.co/600x400.png',
    aiGeneratedProfile: 'Innovate Solutions Ltd. is a dynamic technology partner renowned for crafting bespoke software applications and pioneering cloud infrastructure services. With a proven track record in the demanding fintech and rapidly evolving e-commerce sectors, they deliver robust, scalable, and secure solutions. Their expertise encompasses modern web and mobile technologies, ensuring clients receive cutting-edge products tailored to their specific business needs.',
    yearsOfExperience: 8,
    companySize: 'Medium (11-50)',
    industryFocus: ['Fintech', 'E-commerce', 'SaaS'],
    availability: 'Available for new projects starting next month.',
    awardsAndCertifications: ['AWS Certified Solutions Architect', 'Top Software Developer 2023 (Tech Magazine)'],
  },
  {
    id: '2',
    name: 'Creative Designs Co.',
    businessDescription: 'We are a creative agency focusing on UI/UX design, branding, and digital marketing. Our clients range from startups to Fortune 500 companies.',
    expertise: ['UI/UX Design', 'Branding', 'Digital Marketing', 'Figma'],
    services: ['Website Design', 'Logo Design', 'Social Media Campaigns'],
    portfolioLinks: ['https://example.com/portfolio3'],
    imageUrl: 'https://placehold.co/600x400.png',
    yearsOfExperience: 5,
    companySize: 'Small (2-10)',
    industryFocus: ['Retail', 'Healthcare', 'Education'],
    availability: 'Currently accepting new clients.',
    awardsAndCertifications: ['Best UI/UX Agency 2022 (Design Awards)'],
  },
  {
    id: '3',
    name: 'Data Analytics Pros',
    businessDescription: 'Expert in data analysis, machine learning model development, and business intelligence dashboards.',
    expertise: ['Python', 'Machine Learning', 'Tableau', 'SQL'],
    services: ['Data Visualization', 'Predictive Analytics', 'BI Reporting'],
    portfolioLinks: [],
    imageUrl: 'https://placehold.co/600x400.png',
    aiGeneratedProfile: 'Data Analytics Pros stands as a leader in transforming raw data into actionable insights. They possess deep expertise in data analysis, the development of sophisticated machine learning models, and the creation of intuitive business intelligence dashboards. Leveraging tools like Python, Tableau, and SQL, they empower organizations to make data-driven decisions, optimize operations, and uncover new growth opportunities.',
    yearsOfExperience: 10,
    companySize: 'Medium (11-50)',
    industryFocus: ['Finance', 'Healthcare', 'Logistics'],
    availability: 'Limited availability, inquire for details.',
    awardsAndCertifications: ['Certified Data Scientist (CDP)', 'Tableau Certified Professional'],
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'E-commerce Platform Revamp',
    description: 'We need to revamp our existing e-commerce platform to improve user experience and scalability. The project involves redesigning the frontend, optimizing the backend, and migrating to a new cloud server.',
    budget: '$50,000 - $70,000',
    timeline: '6 months',
    requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'UX Design'],
    imageUrl: 'https://placehold.co/600x400.png',
    aiSuggestedSkills: ['React', 'Next.js', 'REST API Design', 'Microservices', 'AWS Lambda', 'DynamoDB'],
    aiSuggestedExperience: 'The ideal vendor should have extensive experience in developing and scaling e-commerce platforms, particularly with modern JavaScript frameworks and AWS cloud services. A portfolio showcasing successful large-scale e-commerce projects is highly desirable. Experience with payment gateway integrations and security best practices is crucial.',
    projectGoals: ['Improve conversion rate by 15%', 'Reduce page load time by 50%', 'Enhance mobile responsiveness'],
    targetAudience: 'Millennials and Gen Z online shoppers interested in sustainable fashion.',
    keyDeliverables: ['Fully redesigned UI/UX mockups', 'Developed and tested frontend application', 'Optimized backend API', 'Migration plan and execution to new cloud infrastructure', 'Post-launch support plan'],
    companyBackground: 'FashionForward Co. is a mid-sized online retailer specializing in eco-friendly clothing and accessories. We have been in business for 5 years and are looking to expand our digital presence.',
  },
  {
    id: 'p2',
    title: 'Mobile App for Logistics',
    description: 'Develop a cross-platform mobile application for our logistics company to track shipments, manage routes, and communicate with drivers in real-time.',
    budget: '$30,000 - $45,000',
    timeline: '4 months',
    requiredSkills: ['React Native', 'Firebase', 'Geolocation', 'Real-time Communication'],
    imageUrl: 'https://placehold.co/600x400.png',
    projectGoals: ['Streamline driver communication', 'Improve shipment tracking accuracy', 'Optimize delivery routes'],
    keyDeliverables: ['Cross-platform mobile app (iOS & Android)', 'Admin dashboard for route management', 'Real-time tracking feature'],
    companyBackground: 'SwiftLogistics Inc. provides nationwide freight services with a fleet of over 100 trucks.',
  },
  {
    id: 'p3',
    title: 'AI-Powered Recommendation Engine',
    description: 'Build a recommendation engine for our content platform using machine learning. The engine should provide personalized content suggestions to users based on their viewing history and preferences.',
    budget: '$40,000 - $60,000',
    timeline: '5 months',
    requiredSkills: ['Python', 'TensorFlow', 'SaaS', 'API Development'],
    imageUrl: 'https://placehold.co/600x400.png',
    aiSuggestedSkills: ['Python', 'PyTorch', 'Collaborative Filtering', 'Content-Based Filtering', 'API Design', 'Scalable ML Systems'],
    aiSuggestedExperience: 'Vendors should demonstrate strong capabilities in machine learning, particularly in building recommendation systems. Experience with large datasets, NLP (if applicable to content), and deploying ML models in a production environment is key. Familiarity with A/B testing methodologies for model evaluation would be a plus.',
    projectGoals: ['Increase user engagement by 20%', 'Improve content discovery', 'Personalize user experience'],
    keyDeliverables: ['Functional recommendation API', 'Integration with existing content platform', 'Performance metrics dashboard'],
  },
];

export const mockMessages: CommunicationMessage[] = [
    {
        id: 'msg1',
        projectId: 'p1',
        vendorId: '1',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        content: 'Hello Innovate Solutions, we are interested in your proposal for the E-commerce Platform Revamp.'
    },
    {
        id: 'msg2',
        projectId: 'p1',
        vendorId: '1',
        sender: 'vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
        content: 'Thank you for reaching out! We are excited about this opportunity. Do you have a specific time for a call?'
    },
    {
        id: 'msg3',
        projectId: 'p2',
        vendorId: '2',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 120 minutes ago
        content: 'Hi Creative Designs Co., can you share more examples of mobile apps you have designed?'
    }
];
