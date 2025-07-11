"use client";

import React from "react";
import DetailWrapper from "./_components/detail-wrapper";
import TicketInfo from "./_components/ticket-info";

export default function ChatWithTicketInfo({
  params,
}: {
  params: { id: string };
  searchParams: { id: string };
}) {
  return (
    <div className="flex w-full h-full space-x-4">
      <div className="w-1/2 p-4">
        <DetailWrapper id={params.id} />
      </div>

      <div className="w-1/2  p-4">
        <TicketInfo id={params.id} />
      </div>
    </div>
  );
}
