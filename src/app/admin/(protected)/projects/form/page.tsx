"use client";
import React from 'react';
import ProjectForm from '@/features/admin/projects/components/ProjectForm';
import Paper from '@/components/common/Paper';

const Form: React.FC = () => {
  return (
    <Paper>
        <ProjectForm onSubmit={() => {}} />
    </Paper>
  )
}

export default Form;
