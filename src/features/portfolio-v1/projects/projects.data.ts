export type ProjectTab = 'professional' | 'personal';

export type Project = {
    id: string;
    /** Used for the details page: /projects/<slug> */
    slug: string;
    title: string;
    description: string;
    tags: string[];
    /** Path inside /public, e.g. "/projects/alpha.jpg". Leave out to show a themed fallback. */
    image?: string;
    github?: string;
    demo?: string;
    /** Shows the amber PLACEHOLDER badge. Remove it once the entry is real. */
    placeholder?: boolean;
};

export type ProjectGroup = {
    featured: Project;
    items: Project[];
};

export const PROJECT_TABS: { value: ProjectTab; label: string }[] = [
    { value: 'professional', label: 'Professional' },
    { value: 'personal', label: 'Personal' },
];

const GITHUB = 'https://github.com/sachinmishrasoni';
const DEMO = 'https://example.com';

export const PROJECTS: Record<ProjectTab, ProjectGroup> = {
    // Projects built for companies / clients
    professional: {
        featured: {
            id: 'alpha',
            slug: 'project-alpha',
            title: 'Project Alpha — Full-Stack Platform',
            description:
                'Placeholder entry for the featured project slot. Replace this with the strongest real project — it renders as the large hero card of the Selected Work section.',
            tags: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
            github: GITHUB,
            demo: DEMO,
            placeholder: true,
        },
        items: [
            {
                id: 'beta',
                slug: 'project-beta',
                title: 'Project Beta — Dashboard & Admin',
                description:
                    'Placeholder entry. Replace with a real dashboard/admin project — this slot renders as a card in the Selected Work grid.',
                tags: ['React', 'Redux Toolkit', 'Node.js', 'MySQL'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
            {
                id: 'gamma',
                slug: 'project-gamma',
                title: 'Project Gamma — API Platform',
                description:
                    'Placeholder entry. Replace with a real backend/API project — authentication, integrations, and business logic.',
                tags: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
            {
                id: 'delta',
                slug: 'project-delta',
                title: 'Project Delta — Web Application',
                description:
                    'Placeholder entry. Replace with a real frontend/UI project — the fourth card of the Selected Work grid.',
                tags: ['React', 'TypeScript', 'Tailwind CSS'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
        ],
    },

    // Side projects
    personal: {
        featured: {
            id: 'nova',
            slug: 'project-nova',
            title: 'Project Nova — Personal Flagship',
            description:
                'Placeholder entry for your best personal project. Replace this with the side project you are proudest of — it renders as the large hero card of this tab.',
            tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MongoDB'],
            github: GITHUB,
            demo: DEMO,
            placeholder: true,
        },
        items: [
            {
                id: 'orbit',
                slug: 'project-orbit',
                title: 'Project Orbit — Productivity App',
                description:
                    'Placeholder entry. Replace with a real personal project — a tool you built to solve your own problem.',
                tags: ['React', 'Redux Toolkit', 'Node.js'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
            {
                id: 'pulse',
                slug: 'project-pulse',
                title: 'Project Pulse — Realtime Chat',
                description:
                    'Placeholder entry. Replace with a real personal project — something that experiments with sockets, auth or realtime data.',
                tags: ['Node.js', 'Express.js', 'MongoDB', 'Socket.io'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
            {
                id: 'atlas',
                slug: 'project-atlas',
                title: 'Project Atlas — Open Source Tool',
                description:
                    'Placeholder entry. Replace with a real personal project — a small library, CLI or UI kit you shared with others.',
                tags: ['TypeScript', 'React', 'Tailwind CSS'],
                github: GITHUB,
                demo: DEMO,
                placeholder: true,
            },
        ],
    },
};
