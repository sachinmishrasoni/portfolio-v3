import type { TimelineItem } from '@/components/common/Timeline';

export type ExperienceTab = 'work' | 'education';

export const WORK_EXPERIENCE: TimelineItem[] = [
    {
        id: 'alobha',
        period: 'Apr 2023 — Present',
        title: 'MERN Stack Developer',
        subtitle: 'Alobha Technology Pvt. LTD',
        description:
            'Building and maintaining scalable web applications. Implementing responsive UIs, developing RESTful APIs, integrating databases, and ensuring application performance and security. Collaborating with team members to deliver high-quality features aligned with business requirements.',
        tags: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    },
    {
        id: 'misemind',
        period: 'Feb 2024 — Mar 2024',
        title: 'Software Engineer',
        subtitle: 'Misemind Technology Pvt. LTD',
        description:
            'Contributed to the design, development, and maintenance of enterprise-level applications. Involved in the complete software development life cycle, from requirement analysis to deployment. Focused on delivering scalable and user-friendly solutions while collaborating with cross-functional teams.',
        tags: ['SDLC', 'Enterprise Apps', 'Deployment'],
    },
    {
        id: 'ducat-trainee',
        period: 'Mar 2022 — Dec 2023',
        title: 'Full-Stack Developer (Trainee)',
        subtitle: 'Ducat Pitampura, New Delhi',
        description:
            'Completed intensive training as a Full-Stack Developer, gaining hands-on experience in both frontend and backend development. Built web applications with HTML, CSS, JavaScript, React, Node.js, and MongoDB — learning to create RESTful APIs, manage databases, and implement responsive designs.',
        tags: ['React', 'Node.js', 'MongoDB', 'Fundamentals'],
    },
];

export const EDUCATION: TimelineItem[] = [
    {
        id: 'ducat-cert',
        period: '2022 — 2023',
        title: 'Certification — Full Stack Development',
        subtitle: 'Ducat Pitampura, New Delhi',
        description:
            'Intensive Full Stack Development course covering frontend and backend technologies. Hands-on work with React, Node.js, Express, and MongoDB — developing full-fledged web applications with clean code, responsive design, and robust architecture, plus a solid grounding in MVC frameworks and RESTful APIs.',
    },
    {
        id: 'ipu-bachelors',
        period: '2019 — 2022',
        title: 'Bachelor’s Degree — Software Development',
        subtitle: 'IPU University, Dwarka, New Delhi',
        description:
            'Degree focused on the theoretical and practical aspects of computing: designing algorithms, optimizing code, and applying software engineering principles. Proficiency in Java, Python, and C++, alongside workshops on emerging technologies like AI and cloud computing.',
    },
    {
        id: 'bseb-12th',
        period: '2017 — 2019',
        title: 'Higher Secondary (+2) — Science',
        subtitle: 'BSEB, Patna',
        description:
            'Specialized in Physics, Chemistry, and Mathematics — a curriculum that sharpened analytical and logical reasoning and built the foundation for understanding complex technical concepts in engineering.',
    },
];
