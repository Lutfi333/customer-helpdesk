"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSendEmailResetPassword } from "@/services/auth";
import { Fragment } from "react";
import EmailRecoverySent from "./email-recovery-sent";
import toast from "react-hot-toast";

type Form = {
  email: string;
};

export default function EmailRecoveryInput() {
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<Form>({
    mode: "all",
  });

  const { mutate, isPending } = useSendEmailResetPassword();

  const onSubmit = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
      },
      onError: (e) => {
        toast.error(e.data.message);
      },
    });
  });

  return (
    (<Fragment>
      {showSuccess && <EmailRecoverySent />}
      {!showSuccess && (
        <Card className="w-4/12 rounded-2xl shadow-lg p-5">
          <CardHeader className="justify-between">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="text-center">
                <p className="text-lg font-bold mt-2">Password Recovery</p>
                <p className="text-sm text-slate-500 font-normal">
                  Enter the email you use for Desk Ticketing dashboard
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
              <div className="space-y-10">
                <div>
                  <Controller
                    name="email"
                    rules={{
                      required: {
                        value: true,
                        message: "Email is required",
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="email"
                        id="email"
                        data-testid="email"
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Email"
                        size="lg"
                        radius="md"
                        variant="bordered"
                        className="border-gray-400"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                isLoading={isPending}
                disabled={isPending}
                className="w-full bg-primary text-white hover:bg-gray-600"
                data-testid="submit"
              >
                Continue
              </Button>
              <Button
                onPress={() => router.replace("/login")}
                variant="bordered"
                className="w-full boder-primary text-primary hover:bg-gray-600"
                data-testid="submit"
              >
                Cancel
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </Fragment>)
  );
}
