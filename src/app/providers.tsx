"use client";

import { ThemeProvider } from "@/config/theme.provider";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <HeroUIProvider>{children}</HeroUIProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
