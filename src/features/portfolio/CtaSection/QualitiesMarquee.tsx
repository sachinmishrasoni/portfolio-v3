import React from 'react';
import { PiStarFourBold } from 'react-icons/pi';
import Marquee from '@/components/common/Marquee';

const qualities = [
    'Clean Architecture',
    'Performance First',
    'Security Minded',
    'Responsive by Default',
    'Accessible',
    'Pixel-Perfect',
    'Maintainable Code',
    'Always Learning',
];

const QualitiesMarquee: React.FC = () => {
    return (
        <section aria-label="How I work" className="border-y border-border py-5">
            <Marquee scrollMode="reverse" fade baseVelocity={30} scrollBoost={3} gap={20}>
                {qualities.map((text) => (
                    <React.Fragment key={text}>
                        <h3 className="whitespace-nowrap text-lg font-medium tracking-wide text-muted-foreground sm:text-xl">
                            {text}
                        </h3>
                        <PiStarFourBold aria-hidden className="shrink-0 text-sm text-primary" />
                    </React.Fragment>
                ))}
            </Marquee>
        </section>
    );
};

export default QualitiesMarquee;
