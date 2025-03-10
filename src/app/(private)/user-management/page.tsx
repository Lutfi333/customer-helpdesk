"use client";
import { Suspense } from "react";
import UserManagementWrapper from "./_components/user-management-wrapper";

export default function UserManagement() {
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserManagementWrapper />
    </Suspense>
  );
}
