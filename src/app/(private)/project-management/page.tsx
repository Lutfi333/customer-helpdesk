"use client";
import { Suspense } from "react";
import ProjectManagementWrapper from "./_components/project-management-wrapper";

export default function ProjectManagement() {
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectManagementWrapper/>
    </Suspense>
  );
}
