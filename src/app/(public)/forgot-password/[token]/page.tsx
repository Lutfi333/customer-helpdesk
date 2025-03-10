
import Image from "next/image";
import ResetPasswordInput from "./_components/reset-password-input";
export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
  searchParams: { id: string };
}) {
  return (
    <div className="mx-auto w-screen h-full bg-[#f8f5f5]">
      <div className="z-20 h-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/assets/logo-solutionlabs.png"
            width={200}
            height={100}
            alt="SolutionLabs Logo"
          />
        </div>
        <ResetPasswordInput token={params.token} />
        <footer className="text-center mt-10 text-xs text-gray-500">
          © 2024 SolutionLab
        </footer>
      </div>
    </div>
  );
}
