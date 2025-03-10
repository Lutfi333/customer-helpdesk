"use client";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { useResetPassword } from "@/services/auth";
import toast from "react-hot-toast";

type Form = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordInput(props: { token: string }) {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<Form>({
    mode: "all",
  });
  const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false);

  const { mutate, isPending } = useResetPassword();

  const toggleVisibilityPass = () => {
    setIsVisiblePass(!isVisiblePass);
  };

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        token: props.token,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.replace("/login");
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  });

  return (
    <Card className="w-4/12 rounded-2xl shadow-lg p-5">
      <CardHeader className="justify-between">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="text-center">
            <p className="text-lg font-bold mt-2">Password Recovery</p>
            <p className="text-sm text-slate-500 font-normal">
              Enter the new password you use for Desk Ticketing dashboard
            </p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-5" autoComplete="off">
          <div className="space-y-10">
            <div>
              <Controller
                name="password"
                rules={{
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                }}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    type={isVisiblePass ? "text" : "password"}
                    id="password"
                    data-testid="password"
                    label="Password"
                    labelPlacement="outside"
                    placeholder="Password"
                    size="lg"
                    radius="md"
                    variant="bordered"
                    className="border-gray-400"
                    isInvalid={invalid}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityPass}
                      >
                        {isVisiblePass ? (
                          <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                        ) : (
                          <HiOutlineEye className="h-5 w-5 text-default-500" />
                        )}
                      </button>
                    }
                    errorMessage={error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="confirmPassword"
                rules={{
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                }}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    type={isVisiblePass ? "text" : "password"}
                    id="password"
                    data-testid="password"
                    label="Confirm Password"
                    labelPlacement="outside"
                    placeholder="Confirm Password"
                    size="lg"
                    radius="md"
                    variant="bordered"
                    className="border-gray-400"
                    isInvalid={invalid}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityPass}
                      >
                        {isVisiblePass ? (
                          <HiOutlineEyeOff className="h-5 w-5 text-default-500" />
                        ) : (
                          <HiOutlineEye className="h-5 w-5 text-default-500" />
                        )}
                      </button>
                    }
                    errorMessage={error?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            isDisabled={isPending}
            isLoading={isPending}
            disabled={isPending}
            className="w-full bg-primary text-white hover:bg-gray-600"
            data-testid="submit"
          >
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
