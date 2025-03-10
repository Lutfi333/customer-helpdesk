import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="w-screen h-[calc(100vh)] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
        {children}
      </div>
    </main>
  );
}
