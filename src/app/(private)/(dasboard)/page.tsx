import { Suspense } from "react";
import DashboardContent from "./_components/dashboard-content";

export default function DashboardPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <h1>Dashboard</h1>
        <DashboardContent />
      </Suspense>
    </main>
  );
}
