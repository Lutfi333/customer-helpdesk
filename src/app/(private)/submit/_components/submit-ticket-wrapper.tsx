"use client";
import {
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
  Button,
  Textarea,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import {
  HiOutlineArrowCircleLeft,
  HiOutlinePlusCircle,
  HiTrash,
} from "react-icons/hi";
import Cookie from "js-cookie";
import { USER } from "@/constants/auth";
import toast from "react-hot-toast";
import { priorities } from "@/constants/ticket";
import { ChangeEvent } from "react";
import { DateTime } from "luxon";
import { useProjectList } from "@/services/project";
import { ProjectList } from "@/services/project/types";
import { useSubmitTicket, useUploadAttachment } from "@/services/ticket";
import { User } from "@/services/auth/types";
import { useCategoryList } from "@/services/category";
import { CategoryList } from "@/services/category/types";

type Form = {
  email: string;
  subject: string;
  priority: string;
  project: string;
  category: string;
  description: string;
  attachment: string;
};

type FileList = {
  url: string;
  size: number;
  fileName: string;
  id: string;
};

export default function SubmitTicketWrapper() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { control, handleSubmit, setValue } = useForm<Form>({
    mode: "all",
  });
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [user, setUser] = useState<User>({
    id: "",
    company: {
      id: "",
      name: "",
    },
    name: "",
    email: "",
    role: "",
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const { data: project } = useProjectList({
    page: 1,
    limit: 100,
  });

  const { data: category } = useCategoryList();

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const { mutate: submitTicket, isPending } = useSubmitTicket();

  const { mutate: uploadAttachment } = useUploadAttachment();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File ${file.name} is too large. Maximum size is 2 MB`);
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "title",
            `Attachment-${DateTime.now().toMillis().toString()}`,
          );
          uploadAttachment(formData, {
            onSuccess: (data) => {
              toast.success("Attachment uploaded");
              setFileList((prev) => [
                ...prev,
                {
                  url: data.data.url,
                  size: data.data.size,
                  fileName: data.data.name,
                  id: data.data.id,
                },
              ]);
            },
            onError: (e) => {
              toast.error(e.data.message);
            },
          });
        }
      });
    }
  };

  const onSubmit = handleSubmit((data) => {
    submitTicket(
      {
        companyProductId: data.project,
        subject: data.subject,
        content: data.description,
        priority: data.priority,
        attachIds: fileList.map((item) => item.id),
        projectId: data.project,
        categoryId: data.category,
      },
      {
        onSuccess: (data) => {
          toast.success("Ticket submitted");
          router.back();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  });

  const onDeleteItem = useCallback(
    (index: number) => {
      var list = [...fileList];
      list.splice(index, 1);
      setFileList(list);
    },
    [fileList, setFileList],
  );

  useEffect(() => {
    const getSession = () => {
      const session = Cookie.get(USER);
      if (session) {
        setUser(JSON.parse(session));
        const user = JSON.parse(session);
        setValue("email", user.email);
      }
      return null;
    };
    getSession();
  }, [setValue]);

  const DataList = useCallback(() => {
    return fileList.map((item, index) => (
      <div key={item.id} className="flex space-x-2">
        <p className="text-xs font-semibold text-clip">{item.fileName}</p>
        <p className="text-xs text-default-400">{item.size} KB</p>
        <div
          onClick={() => onDeleteItem(index)}
          role="button"
          className="cursor-pointer"
        >
          <HiTrash className="text-red-500" />
        </div>
      </div>
    ));
  }, [fileList, onDeleteItem]);

  return (
    <div>
      <div
        role="button"
        onClick={() => {
          router.back();
        }}
        className="flex space-x-3 items-center mb-5"
      >
        <HiOutlineArrowCircleLeft className="text-2xl" />
        <p className="font-semibold">Submit Ticket</p>
      </div>
      <div className="flex flex-col space-y-4">
        <Card className="z-0">
          <CardBody>
            <form onSubmit={onSubmit} className="mt-4">
              <div className="flex-col space-y-10">
                <div>
                  <Controller
                    name="project"
                    rules={{
                      required: {
                        value: true,
                        message: "Project is required",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        label="Project"
                        labelPlacement="outside"
                        placeholder="Select Project"
                        size="lg"
                        radius="md"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      >
                        {project?.data?.list?.map((product: ProjectList) => (
                          <SelectItem value={product.id} key={product.id}>
                            {product.name}
                          </SelectItem>
                        )) || []}
                      </Select>
                    )}
                  />
                </div>
                <div className="mt-2">
                  <Controller
                    name="subject"
                    rules={{
                      required: {
                        value: true,
                        message: "Subject is required",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Input
                        type="text"
                        id="subject"
                        data-testid="subject"
                        label="Subject"
                        labelPlacement="outside"
                        placeholder="Subject"
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
                    name="category"
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        label="Category"
                        labelPlacement="outside"
                        placeholder="Select Category"
                        size="lg"
                        radius="md"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      >
                        {category?.data?.list?.map(
                          (categoryData: CategoryList) => (
                            <SelectItem
                              value={categoryData.id}
                              key={categoryData.id}
                            >
                              {categoryData.name}
                            </SelectItem>
                          ),
                        ) || []}
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="priority"
                    rules={{
                      required: {
                        value: true,
                        message: "Priority is required",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Select
                        label="Priority"
                        labelPlacement="outside"
                        placeholder="Select Priority"
                        size="lg"
                        radius="md"
                        variant="bordered"
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        {...field}
                      >
                        {priorities.map((item: string) => (
                          <SelectItem value={item} key={item}>
                            {item}
                          </SelectItem>
                        )) || []}
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-5 mt-5">
                <div>
                  <Controller
                    name="description"
                    rules={{
                      required: {
                        value: true,
                        message: "Description is required",
                      },
                    }}
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <Textarea
                        type="text"
                        id="description"
                        data-testid="description"
                        label={<h1 className="text-[1rem]">Description</h1>}
                        labelPlacement="outside"
                        classNames={{ innerWrapper: "text-lg" }}
                        className="text-sm"
                        placeholder="Description..."
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
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <p>Attachment</p>
                    <div
                      role="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      <input
                        accept="image/*, application/pdf, video/*"
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <HiOutlinePlusCircle
                        size={20}
                        className="text-gray-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">{DataList()}</div>
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-3">
                <Button
                  onPress={() => router.back()}
                  variant="bordered"
                  className="bg-white text-default-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md"
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
