import type { IconType } from 'react-icons';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export const CONTACT_EMAIL = 'sachunmishraf103@gmail.com';
export const LOCATION = 'Karol Bagh, New Delhi, India';

export type ContactLink = {
    id: string;
    label: string;
    href: string;
    icon: IconType;
    /** Opens in a new tab. mailto: links stay in the same tab. */
    external: boolean;
};

export const CONTACT_LINKS: ContactLink[] = [
    {
        id: 'email',
        label: 'Email Me',
        href: `mailto:${CONTACT_EMAIL}`,
        icon: FiMail,
        external: false,
    },
    {
        id: 'linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/your-handle', // TODO: your real LinkedIn URL
        icon: FiLinkedin,
        external: true,
    },
    {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/sachinmishrasoni',
        icon: FiGithub,
        external: true,
    },
];
