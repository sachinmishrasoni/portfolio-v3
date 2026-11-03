'use client';

import React from 'react';
import AboutLeft from './AboutLeft';
import AboutRight from './AboutRight';
import AboutStats from './AboutStats';

const AboutSection: React.FC = () => {
    return (
        <section id="about" data-testid="about-section" className="relative py-24 lg:py-32">
            <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <AboutLeft />
                    </div>
                    <div className="lg:col-span-7">
                        <AboutRight />
                    </div>
                </div>

                <div className="mt-6 lg:mt-8">
                    <AboutStats />
                </div>
            </div>
        </section>
    );
};

export default AboutSection;