import React from 'react';
import { PiStarFourBold } from 'react-icons/pi';
import Marquee from '@/components/common/Marquee';

const strArr = [
    'Fullstack', 'Frontend', 'Animations', 'Backend',
    'Website', 'Development', 'Community', 'Design',
    'UI/UX', 'Graphics',
];

const HeroSectionMarquee: React.FC = () => {
    return (
        <section className="pt-8">
            <Marquee fade direction="left" baseVelocity={30} gap={20}>
                {strArr.map((str) => (
                    <React.Fragment key={str}>
                        <h3 className="whitespace-nowrap text-lg font-medium tracking-wide text-muted-foreground sm:text-xl">
                            {str}
                        </h3>
                        <PiStarFourBold aria-hidden className="shrink-0 text-sm text-primary" />
                    </React.Fragment>
                ))}
            </Marquee>
        </section>
    );
};

export default HeroSectionMarquee;