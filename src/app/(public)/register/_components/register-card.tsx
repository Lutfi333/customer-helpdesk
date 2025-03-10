"use client";
import { useState } from "react";

import { Card, CardHeader, CardBody, Button, Input, Image } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Link from "next/link";
import { Env } from "@/config/env";
import toast from "react-hot-toast";
import { stat } from "fs";
import { useRegister } from "@/services/auth";

type Form = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterCard() {
  const router = useRouter();
  const { control, handleSubmit, watch } = useForm<Form>({
    mode: "all",
  });

  const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false);
  const [isVisibleConfirmPass, setIsVisibleConfirmPass] =
    useState<boolean>(false);

  const toggleVisibilityPass = () => {
    setIsVisiblePass(!isVisiblePass);
  };

  const toggleVisibilityConfirmPass = () => {
    setIsVisibleConfirmPass(!isVisibleConfirmPass);
  };

  const { mutate, isPending } = useRegister(); 

  const onSubmit = handleSubmit((data) => {
    mutate({
      name: data.fullname,
      email: data.email,
      password: data.password,
      accessKey: Env().API_ACCESS_KEY,
    }, {
      onSuccess: () => {
        toast.success("Register success");
        router.replace("/email-send");
      },
      onError: (e) => {
        toast.error(e.data.message);
      },
    });
  });

  return (
    (<Card className="w-5/12 rounded-lg p-5">
      <CardHeader className="justify-between">
        <div className="flex flex-col justify-center items-center w-full">
          <Image
            width={200}
            alt="Solutionlabs logo"
            src="/assets/solutionlabs-logo.png"
          />
          <div>
            <p className="text-xs text-default-500">Register</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-10">
            <div>
              <Controller
                name="fullname"
                rules={{
                  required: {
                    value: true,
                    message: "Fullname is required",
                  },
                }}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    type="text"
                    id="fullname"
                    data-testid="fullname"
                    label="Fullname"
                    labelPlacement="outside"
                    placeholder="Fullname"
                    size="lg"
                    radius="md"
                    variant="bordered"
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="email"
                rules={{
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    {...field}
                  />
                )}
              />
            </div>
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
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Confirm password is required",
                  },
                  validate: (value) =>
                    value === watch("password") || "The passwords do not match",
                }}
                name="confirmPassword"
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    type={isVisibleConfirmPass ? "text" : "password"}
                    id="password-confirm"
                    data-testid="password-confirm"
                    label="Confirm Password"
                    labelPlacement="outside"
                    placeholder="Confirm Password"
                    size="lg"
                    radius="md"
                    variant="bordered"
                    isInvalid={invalid}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibilityConfirmPass}
                      >
                        {isVisibleConfirmPass ? (
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
            isLoading={isPending}
            type="submit"
            className="w-full bg-primary text-white"
            data-testid="submit"
          >
            Register
          </Button>

          <p className="text-center text-xs text-default-500">
            Already have an account
          </p>

          <Button
            className="w-full"
            variant="bordered"
            as={Link}
            href="/login"
            data-testid="login"
          >
            Login
          </Button>
        </form>
      </CardBody>
    </Card>)
  );
}
