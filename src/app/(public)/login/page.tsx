"use client";

import LoginCard from "./_components/login-card";
import { Image } from "@heroui/react";
import Cookie from "js-cookie";
import { COMPANY_DATA } from "@/constants/auth";

export default function LoginPage() {
  // const companyLogo = JSON.parse(Cookie.get(COMPANY_DATA) as string);
  return (
    <div className="mx-auto w-screen h-full bg-[#f8f5f5]">
      <div className="z-20 h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={
              // companyLogo.logo
              //   ? companyLogo.logo.url
              "/assets/logo-solutionlabs.png"
            }
            width={200}
            height={200}
            className="w-auto h-auto object-contain"
            alt="SolutionLabs Logo h-auto w-auto"
          />
        </div>
        <LoginCard />
        <footer className="text-center mt-10 text-xs text-gray-500">
          © 2024 SolutionLab
        </footer>
      </div>
    </div>
  );
}
