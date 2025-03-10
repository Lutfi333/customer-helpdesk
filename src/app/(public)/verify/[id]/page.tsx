import { Suspense } from "react";
import VerifyCard from "./_components/verify-card";
import { Spinner } from "@heroui/react";

export default function VerifyPage({
  params,
}: {
  params: { id: string };
  searchParams: { id: string };
}) {
  return (
    <div className="mx-auto w-screen h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 ">
      <div className="z-20 h-full flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex space-x-2 items-center">
              <Spinner /> <p>Loading...</p>{" "}
            </div>
          }
        >
          <VerifyCard id={params.id} />
        </Suspense>
      </div>
    </div>
  );
}
