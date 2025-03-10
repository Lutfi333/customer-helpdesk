"use client";
import React from "react";
import LeftSidebar from "@/app/_components/sidebar";
import TopNavbar from "../_components/navbar-top";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="w-screen h-screen flex overflow-hidden">
        <LeftSidebar />
        <div className="w-full">
          <TopNavbar />
          <div className="bg-white p-5 mx-auto h-[calc(100vh-64px)] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
