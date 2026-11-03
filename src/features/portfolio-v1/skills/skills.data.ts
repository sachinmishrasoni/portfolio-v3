import type { IconType } from 'react-icons';
import { FaCss3Alt, FaHtml5 } from 'react-icons/fa';
import {
    SiBootstrap,
    SiExpress,
    SiFigma,
    SiGit,
    SiGithub,
    SiJavascript,
    SiMongodb,
    SiMui,
    SiMysql,
    SiNextdotjs,
    SiNodedotjs,
    SiPostman,
    SiReact,
    SiRedux,
    SiTailwindcss,
    SiTypescript,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export type SkillCategory = 'frontend' | 'backend' | 'databases' | 'tools';
export type SkillFilterValue = 'all' | SkillCategory;

export type Skill = {
    id: string;
    name: string;
    description: string;
    category: SkillCategory;
    icon: IconType;
    /**
     * Brand colour for the icon and the hover glow.
     * Leave it out for icons that should follow the theme (e.g. Next.js, Express, GitHub).
     */
    color?: string;
};

export const SKILL_FILTERS: { label: string, value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Databases', value: 'databases' },
    { label: 'Tools', value: 'tools' },
];

/** Small label shown at the top-right of each card. */
export const CATEGORY_LABEL: Record<SkillCategory, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    databases: 'Database',
    tools: 'Tools',
};

export const SKILLS: Skill[] = [
    // ── Frontend ──────────────────────────────────────────────
    {
        id: 'react',
        name: 'React',
        description: 'Component-driven UIs, hooks and modern state patterns.',
        category: 'frontend',
        icon: SiReact,
        color: '#61DAFB',
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        description: 'Server-side rendering and app-scale routing.',
        category: 'frontend',
        icon: SiNextdotjs,
        color: '#fff',
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        description: 'The language of the web — ES2020+ fluency.',
        category: 'frontend',
        icon: SiJavascript,
        color: '#F7DF1E',
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        description: 'Type-safe architectures across the whole stack.',
        category: 'frontend',
        icon: SiTypescript,
        color: '#3178C6',
    },
    {
        id: 'html',
        name: 'HTML',
        description: 'Semantic, accessible document structure.',
        category: 'frontend',
        icon: FaHtml5,
        color: '#E34F26',
    },
    {
        id: 'css',
        name: 'CSS',
        description: 'Layout systems, animation and responsive design.',
        category: 'frontend',
        icon: FaCss3Alt,
        color: '#1572B6',
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: 'Utility-first styling with design-token discipline.',
        category: 'frontend',
        icon: SiTailwindcss,
        color: '#06B6D4',
    },
    {
        id: 'mui',
        name: 'Material UI',
        description: 'Enterprise-grade React component systems.',
        category: 'frontend',
        icon: SiMui,
        color: '#007FFF',
    },
    {
        id: 'bootstrap',
        name: 'Bootstrap',
        description: 'Rapid, grid-based responsive prototyping.',
        category: 'frontend',
        icon: SiBootstrap,
        color: '#7952B3',
    },
    {
        id: 'redux',
        name: 'Redux Toolkit',
        description: 'Predictable state management at scale.',
        category: 'frontend',
        icon: SiRedux,
        color: '#764ABC',
    },

    // ── Backend ───────────────────────────────────────────────
    {
        id: 'nodejs',
        name: 'Node.js',
        description: 'JavaScript runtime for fast, scalable servers.',
        category: 'backend',
        icon: SiNodedotjs,
        color: '#5FA04E',
    },
    {
        id: 'express',
        name: 'Express.js',
        description: 'Minimal, composable HTTP frameworks and middleware.',
        category: 'backend',
        icon: SiExpress,
    },

    // ── Databases ─────────────────────────────────────────────
    {
        id: 'mongodb',
        name: 'MongoDB',
        description: 'Flexible document modeling for fast-moving products.',
        category: 'databases',
        icon: SiMongodb,
        color: '#47A248',
    },
    {
        id: 'mysql',
        name: 'MySQL',
        description: 'Relational schemas, joins and query optimization.',
        category: 'databases',
        icon: SiMysql,
        color: '#4479A1',
    },

    // ── Tools ─────────────────────────────────────────────────
    {
        id: 'git',
        name: 'Git',
        description: 'Version control and clean branching workflows.',
        category: 'tools',
        icon: SiGit,
        color: '#F05032',
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Pull requests, code review and team collaboration.',
        category: 'tools',
        icon: SiGithub,
        color: '#fff',
    },
    {
        id: 'postman',
        name: 'Postman',
        description: 'Designing, testing and documenting REST APIs.',
        category: 'tools',
        icon: SiPostman,
        color: '#FF6C37',
    },
    {
        id: 'vscode',
        name: 'VS Code',
        description: 'A fast, extensible editor tuned for productivity.',
        category: 'tools',
        icon: VscVscode,
        color: '#007ACC',
    },
    {
        id: 'figma',
        name: 'Figma',
        description: 'Turning design files into pixel-accurate UI.',
        category: 'tools',
        icon: SiFigma,
        color: '#F24E1E',
    },
];
