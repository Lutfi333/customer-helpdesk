"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function EmailRecoverySent() {
  const router = useRouter();

  return (
    <Card className="w-4/12 rounded-2xl shadow-lg p-5">
      <CardHeader className="justify-between">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="text-center">
            <p className="text-lg font-bold mt-2">Reset Your Password</p>
            <p className="text-sm text-slate-500 font-normal">
              If an account exists, we’ll send instructions for resetting your
              password. Didn’t get them? Check the email address or ask to
              resend the instructions.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Button
          onPress={() => {
            router.replace("/login");
          }}
          className="w-full bg-primary text-white hover:bg-gray-600"
          data-testid="submit"
        >
          Back to Login
        </Button>
      </CardBody>
    </Card>
  );
}
