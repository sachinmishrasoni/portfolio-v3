import type { IconType } from 'react-icons';
import {
    LuBraces,
    LuDatabase,
    LuLayers,
    LuLayoutDashboard,
    LuMonitorSmartphone,
    LuPaintbrush,
} from 'react-icons/lu';

export type Service = {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    tags: string[];
};

export const SERVICES: Service[] = [
    {
        id: 'frontend',
        title: 'Frontend Development',
        description:
            'Modern, responsive interfaces using React, TypeScript and modern UI systems — with clean component architecture.',
        icon: LuMonitorSmartphone,
        tags: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
        id: 'full-stack',
        title: 'Full Stack Applications',
        description:
            'Complete applications from frontend to backend — data models, business logic, deployment and everything between.',
        icon: LuLayers,
        tags: ['MERN', 'Next.js', 'MySQL'],
    },
    {
        id: 'api',
        title: 'API Development',
        description:
            'REST APIs with authentication, database integration and business logic — documented and built to be consumed.',
        icon: LuBraces,
        tags: ['Node.js', 'Express.js', 'REST'],
    },
    {
        id: 'dashboards',
        title: 'Dashboard & Admin Systems',
        description:
            'Complex dashboards, tables, filters, forms and role-based systems that stay fast as the data grows.',
        icon: LuLayoutDashboard,
        tags: ['Analytics', 'RBAC', 'Data Tables'],
    },
    {
        id: 'database',
        title: 'Database Design',
        description:
            'Schema design, queries and indexing for MongoDB and MySQL — built around data integrity and scalability.',
        icon: LuDatabase,
        tags: ['MongoDB', 'MySQL', 'Schema Design'],
    },
    {
        id: 'ui-modernization',
        title: 'UI Modernization',
        description:
            'Transform outdated interfaces into modern, responsive experiences — without breaking what already works.',
        icon: LuPaintbrush,
        tags: ['Redesign', 'Responsive', 'Performance'],
    },
];
