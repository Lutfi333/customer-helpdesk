"use client";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Image,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { AUTH_KEY, COMPANY_DATA, USER } from "@/constants/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { ResponseLogin } from "@/services/auth/types";
import { useLogin } from "@/services/auth";
import Cookies from "js-cookie";

type Form = {
  email: string;
  password: string;
};

export default function LoginCard() {
  const router = useRouter();
  const { control, handleSubmit, watch, setValue } = useForm<Form>({
    mode: "all",
  });

  const [isVisiblePass, setIsVisiblePass] = useState<boolean>(false);
  const [compayLogo, setCompanyLogo] = useState<string>("");

  const toggleVisibilityPass = () => {
    setIsVisiblePass(!isVisiblePass);
  };

  useEffect(() => {
    setValue("email", "");
    setValue("password", "");
  }, [setValue]);

  const { mutate, isPending } = useLogin();

  const onSubmit = handleSubmit((data) => {
    const accessKey = JSON.parse(Cookie.get(COMPANY_DATA) as string).accessKey;
    // const accessKey = "6dee01d9-0de0-4cd7-8907-caa5264be1a4";

    mutate(
      {
        email: data.email,
        password: data.password,
        accessKey: accessKey,
      },
      {
        onSuccess: (data: ResponseLogin) => {
          toast.success("Login success");
          Cookie.set(AUTH_KEY, data.data.token);
          Cookie.set(USER, JSON.stringify(data.data.user));
          router.push("/");
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  });

  return (
    <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto rounded-2xl shadow-lg p-5">
      <CardHeader className="justify-center">
        <div className="flex flex-col justify-center items-center w-full">
          <div>
            <p className="text-lg font-bold mt-2">Login</p>
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
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
          </div>
          <Button
            isLoading={isPending}
            disabled={isPending}
            type="submit"
            className="w-full bg-primary text-white hover:bg-gray-600"
            data-testid="submit"
          >
            Login
          </Button>
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-center text-xs text-slate-500"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
