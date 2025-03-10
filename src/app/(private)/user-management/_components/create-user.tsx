"use client";
import { useCreateUser, useDetailUser, useUpdateUser } from "@/services/user";
import { Button, Input, RadioGroup, Radio } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";

type Form = {
  name: string;
  email: string;
  jobTitle: string;
  role: string;
};

interface Props {
  id?: string;
  isEdit?: boolean;
}

export default function CreateUser(props: Props) {
  const router = useRouter();
  const { id, isEdit = false } = props;
  const { control, handleSubmit, setValue } = useForm<Form>({
    mode: "all",
  });

  const { data: user } = useDetailUser(useMemo(() => id, [id]));

  useEffect(() => {
    if (user && id) {
      setValue("name", user.data.name);
      setValue("email", user.data.email);
      setValue("jobTitle", user.data.jobTitle);
      setValue("role", user.data.role);
    }
  }, [user, setValue, id]);

  const { mutate } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser(id || "");

  const onSubmit = handleSubmit((data) => {
    if (isEdit) {
      updateUser(data, {
        onSuccess: (data) => {
          toast.success("User updated successfully");
          router.back();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      });
    } else {
      mutate(data, {
        onSuccess: (data) => {
          toast.success("User created successfully");
          router.back();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      });
    }
  });

  return (
    <main className="bg-white h-screen max-w-3xl p-5">
      <div className="flex items-center gap-2 mb-6">
        <Button isIconOnly variant="light" onPress={() => router.back()}>
          <HiOutlineArrowCircleLeft className="text-2xl" />
        </Button>
        <h1>{isEdit ? "Update User" : "Add New User"}</h1>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <Controller
            name="name"
            rules={{
              required: {
                value: true,
                message: "Name is required",
              },
            }}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <label className="text-sm mb-1.5 block">
                  Name
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Name"
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              </>
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
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <label className="text-sm mb-1.5 block">
                  Email
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              </>
            )}
          />
        </div>

        <div>
          <Controller
            name="jobTitle"
            rules={{
              required: {
                value: true,
                message: "Position is required",
              },
            }}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <>
                <label className="text-sm mb-1.5 block">
                  Position
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <Input
                  type="text"
                  id="position"
                  placeholder="Position"
                  size="lg"
                  radius="sm"
                  variant="bordered"
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                />
              </>
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="role"
            rules={{
              required: {
                value: true,
                message: "Role is required",
              },
            }}
            render={({ field, fieldState: { error, invalid } }) => (
              <>
                <label className="text-sm mb-1.5 block">
                  Role
                  <span className="text-red-500 ml-0.5">*</span>
                </label>
                <RadioGroup
                  color="primary"
                  // defaultValue={defaultValue?.role || "admin"}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  {...field}
                >
                  <Radio value="admin">
                    <p className="text-sm">Admin</p>
                  </Radio>
                  <Radio value="customer">
                    <p className="text-sm">Customer</p>
                  </Radio>
                </RadioGroup>
              </>
            )}
          />
        </div>

        <div className="flex gap-2 mt-2 w-full justify-end">
          <Button variant="bordered" radius="sm" onPress={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" radius="sm" color="primary">
            {isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </main>
  );
}
