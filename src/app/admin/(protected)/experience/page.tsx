"use client";

import ExperienceList from '@/features/admin/experience/components/list'
import { useExperiencesQuery } from '@/features/admin/experience/hooks/experience.queries';

export default function ExperiencePage() {
  const { data: experiences = [], isLoading } = useExperiencesQuery();

  return (
    <ExperienceList
      experiences={experiences}
      loading={isLoading}
    />
  )
}
