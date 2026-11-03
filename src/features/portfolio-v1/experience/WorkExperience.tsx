'use client';

import React from 'react';
import Timeline from '@/components/common/Timeline';
import { WORK_EXPERIENCE } from './experience.data';

const WorkExperience: React.FC = () => <Timeline items={WORK_EXPERIENCE} />;

export default WorkExperience;
