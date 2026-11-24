"use client";

import EducationList from "@/features/admin/education/components/list";
import { useEducationsQuery } from "@/features/admin/education/hooks/education.queries";

export default function EducationPage() {
  const { data: educations = [], isLoading } = useEducationsQuery();

  return (
    <EducationList
      educations={educations}
      loading={isLoading}
    />
  );
}
