'use client';

import React from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import ServiceCard from './ServiceCard';
import { SERVICES } from './services.data';

const ServicesSection: React.FC = () => (
    <section id="services" data-testid="services-section" className="relative py-24 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
            <SectionHeader
                index="05"
                label="Services"
                title="What I"
                highlight="Build"
                description="Practical engineering capabilities — scoped honestly, delivered completely."
            />

            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                ))}
            </ul>
        </div>
    </section>
);

export default ServicesSection;
