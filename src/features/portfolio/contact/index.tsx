'use client';

import React from 'react';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

const ContactSection: React.FC = () => (
    <section id="contact" data-testid="contact-section" className="relative py-24 lg:py-32 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
            <div className="grid grid-cols-1 items-start gap-3 md:gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-6">
                    <ContactInfo />
                </div>
                <div className="lg:col-span-6">
                    <ContactForm />
                </div>
            </div>
        </div>
    </section>
);

export default ContactSection;
