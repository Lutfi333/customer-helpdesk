"use client";
import { Button, Card, CardBody } from "@heroui/react";
import { HiMailOpen } from "react-icons/hi";

export default function EmailSendCard() {
  const router = useRouter();
  return (
    <Card className="w-5/12 h-2/5 rounded-lg p-5 flex items-center">
      <CardBody>
        <div className="flex flex-col h-full items-center justify-center space-y-3">
          <HiMailOpen size={100} className="text-primary" />
          <div className="mt-3">
            <p className="text-center text-slate-500 ">
              Please check your inbox and click the confirmation link to confirm
              your email address.
            </p>
          </div>
          <p className="text-center text-xs text-slate-500">
            Already verified?
          </p>
          <Button
            className="w-full mt-3 bg-primary text-white"
            onPress={() => {
              router.replace("/login");
            }}
          >
            Login
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
