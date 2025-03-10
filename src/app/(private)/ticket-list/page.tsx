import { Suspense } from "react";
import TicketListWrapper from "./_components/ticket-list-wrapper";

export default function TicketListPage() {
  return (
    <main className="bg-white rounded-lg h-fit">
      <Suspense fallback={<div>Loading...</div>}>
        <TicketListWrapper />
      </Suspense>
    </main>
  );
}
