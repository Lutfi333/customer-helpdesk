"use client";
import { Button, Input, Textarea } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineArrowCircleLeft } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateProject, useUpdateProject } from "@/services/project";
import toast from "react-hot-toast";

type Form = {
  name: string;
  description: string;
};

interface Props {
  isEdit?: boolean;
  defaultValues?: Form;
  id?: string;
}

export default function CreateProject(props: Props) {
  const { isEdit, id, defaultValues } = props;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, setValue } = useForm<Form>();

  const { mutate: createProjectMutate } = useCreateProject();
  const { mutate: updateProjectMutate } = useUpdateProject(id ?? "");

  useEffect(() => {
    if (isEdit && defaultValues) {
      setValue("name", defaultValues.name);
      setValue("description", defaultValues.description);
    }
  }, [defaultValues, isEdit, setValue]);

  const onSubmit = handleSubmit((data: Form) => {
    if (isEdit) {
      updateProjectMutate(data, {
        onSuccess: () => {
          toast.success("Project updated successfully");
          router.push("/project-management");
        },
        onError: (e) => {
          toast.error("Failed to update project");
        },
      });
      return;
    }

    createProjectMutate(data, {
      onSuccess: () => {
        toast.success("Project created successfully");
        router.push("/project-management");
      },
      onError: (e) => {
        toast.error("Failed to create project");
      },
    });
  });

  return (
    <main className="bg-white h-screen w-full p-5">
      <div className="flex items-center gap-2 mb-6">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.push("/project-management")}
        >
          <HiOutlineArrowCircleLeft className="text-2xl" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Update" : "Add New"} Project
        </h1>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-xl">
        <div>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm">
                  Project Name
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  {...field}
                  type="text"
                  variant="bordered"
                  size="lg"
                  radius="sm"
                  placeholder="Project Name"
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              </div>
            )}
          />
        </div>

        <div>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm">
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  {...field}
                  variant="bordered"
                  radius="sm"
                  placeholder="Description"
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              </div>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="bordered"
            onPress={() => router.back()}
            disabled={isLoading}
            radius="sm" 
          >
            Cancel
          </Button>
          <Button type="submit" color="primary" radius="sm" isLoading={isLoading}>
            {isEdit ? "Update" : "Create"} Project
          </Button>
        </div>
      </form>
    </main>
  );
}
