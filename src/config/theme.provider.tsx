"use client";

import { COMPANY_COLOR } from "@/constants/auth";
import Cookies from "js-cookie";

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [primaryColor, setPrimaryColor] = useState<string | undefined>();

  useEffect(() => {
    const cookieValue = Cookies.get(COMPANY_COLOR);
    if (cookieValue) {
      setPrimaryColor(cookieValue);
    } else {
      setPrimaryColor("#77C045"); // Fallback color
    }
    document.documentElement.style.setProperty(
      "--primary-color",
      cookieValue || "#77C045"
    )
  }, []);

  if (!primaryColor) {
    return <div className="h-screen w-full flex items-center justify-center">Checking Data...</div>;
  }

  return (
    <div
      suppressHydrationWarning
      style={{ "--primary-color": primaryColor } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
