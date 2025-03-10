"use client";

import { COMPANY_SUBDOMAIN } from "@/constants/auth";
import { useDetailCompany } from "@/services/company";
import {
  useCommentList,
  useDetailAttachment,
  useSubmitComment,
  useUploadAttachment,
} from "@/services/ticket";
import { Attachment, ListCommentData } from "@/services/ticket/types";
import { Button, Divider, Image, Input, Spinner } from "@heroui/react";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineFileAdd, AiOutlineSend } from "react-icons/ai";
import { HiArrowUp, HiOutlineArrowCircleLeft, HiTrash } from "react-icons/hi";
import ImageViewModal from "./image-view-modal";

type FileList = {
  url: string;
  size: number;
  fileName: string;
  id: string;
  isUploaded: boolean;
  file: File;
};

export default function DetailWrapper(props: { id: string }) {
  const LIMIT_COMMENT = 4;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [attachment, setAttachment] = useState<Attachment>({
    id: "",
    size: 0,
    url: "",
    name: "",
    type: "",
  });
  const [inputMessage, setInputMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    sort: "createdAt",
    dir: "desc",
  });
  const [comment, setComment] = useState<ListCommentData[]>([]);
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [selectedAttachment, setSelectedAttachment] = useState<string>("");

  const {
    data: comments,
    isLoading: loadingComment,
    refetch,
  } = useCommentList(props.id, pagination);

  const domain = useMemo(() => {
    return Cookies.get(COMPANY_SUBDOMAIN);
  }, []);

  const { data: company, isFetching: isFetchingCompany } =
    useDetailCompany(domain);

  const { mutate: submitComment, isPending } = useSubmitComment();

  const { mutate: getAttachment, isPending: isPendingAttachment } =
    useDetailAttachment(selectedAttachment);

  const { mutate: uploadAttachment } = useUploadAttachment();

  useEffect(() => {
    var dataComment: ListCommentData[] = comments?.data.list ?? [];
    if (dataComment) {
      let reversed = dataComment.reverse();
      setComment(() => reversed);
      return;
    }
  }, [comments]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (e.target.files) {
      var data = await Promise.all(
        Array.from(e.target.files).map((item) => {
          const file = item;

          if (file.size > MAX_FILE_SIZE) {
            toast.error(`File ${file.name} is too large. Maximum size is 2 MB`);
            return null;
          }

          return {
            file,
            url: URL.createObjectURL(file),
            size: file.size,
            fileName: `Attachment-${DateTime.now().toMillis().toString()}`,
            id: "",
            isUploaded: false,
          };
        }),
      );

      data = data.filter((item): item is FileList => item !== null);

      if (data.length > 0) {
        setFileList((prev) => [
          ...prev,
          ...(data.filter((item) => item !== null) as FileList[]),
        ]);
        onUploadAttachment(data.filter((item) => item !== null) as FileList[]);
      }
    }
  };

  const onUploadAttachment = (data: FileList[]) => {
    data.forEach((item) => {
      if (!item.isUploaded) {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("title", item.fileName);
        uploadAttachment(formData, {
          onSuccess: (data) => {
            toast.success("Attachment uploaded");
            setFileList((prev) =>
              prev.map((item) =>
                item.fileName === data.data.name
                  ? { ...item, isUploaded: true, id: data.data.id }
                  : item,
              ),
            );
          },
          onError: (e) => {
            toast.error(e.data.message);
          },
        });
      }
    });
  };

  const onDeleteItem = (index: number) => {
    var list = [...fileList];
    list.splice(index, 1);
    setFileList(list);
  };

  const dateDiff = (date?: string) => {
    const now = DateTime.now();
    const created = DateTime.fromISO(date ?? now.toString());
    const diff = now
      .diff(created, ["second", "minutes", "hours", "days"])
      .toObject();

    if ((diff.days ?? 0) > 2) {
      return created.toFormat("DDDD");
    } else if (diff.days) {
      return `${Math.abs(Math.floor(diff.days))} day(s) ago`;
    } else if (diff.hours) {
      return `${Math.abs(Math.floor(diff.hours))} hour(s) ago`;
    } else if (diff.minutes) {
      return `${Math.abs(Math.floor(diff.minutes))} minute(s) ago`;
    } else if (diff.seconds) {
      return `${Math.abs(Math.floor(diff.seconds))} second(s) ago`;
    }
    return "Just now";
  };

  const onSubmitComment = (arr: string[]) => {
    submitComment(
      {
        ticketId: props.id,
        content: inputMessage,
        attachIds: arr,
      },
      {
        onSuccess: async (data) => {
          setComment([]);
          setPagination((prev) => ({ ...prev, limit: pagination.limit + 1 }));
          setInputMessage("");
          setFileList([]);
          toast.success("Comment submitted");
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const onOpenAttachment = (id: string) => {
    getAttachment(
      {},
      {
        onSuccess: (data) => {
          setAttachment({
            id: data.data.id,
            size: data.data.size,
            url: data.data.url,
            name: data.data.name,
            type: data.data.type,
          });
          setOpen(true);
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    var arr: string[] = [];
    if (fileList.length > 0) {
      arr = fileList.map((item) => item.id);
    }
    onSubmitComment(arr);
  };

  const onLoadMore = () => {
    setPagination((prev) => ({ ...prev, limit: prev.limit + LIMIT_COMMENT }));
  };

  return (
    <div className="w-full space-y-4">
      <div
        onClick={() => {
          router.back();
        }}
        role="button"
        className="flex space-x-3 items-center cursor-pointer"
      >
        <HiOutlineArrowCircleLeft className="text-2xl text-slate-700" />
        <p className="font-semibold text-slate-700">Ticket Detail</p>
      </div>

      <div className="w-full border-[1px] border-slate-400 rounded-md">
        <div className="flex items-center justify-between m-2">
          <div className="flex items-center space-x-2">
            {/* <p>{company?.data.logo.url}</p> */}
            <div className="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex items-center justify-center">
              {!isFetchingCompany && (
                <Image
                  src={company?.data.logo.url}
                  alt="company logo"
                  height={50}
                  width={50}
                  className="w-full h-full object-contain aspect-square"
                />
              )}
            </div>
            <p>{company?.data.name}</p>
          </div>
        </div>

        <div className="bg-slate-700 relative rounded-md p-2 space-y-2 h-[560px] overflow-auto">
          {loadingComment ? (
            <div className="w-full mx-auto flex justify-center items-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <>
              {(comments?.data.totalPage ?? 0) > pagination.page && (
                <div className="w-full mx-auto flex justify-center items-center">
                  <Button
                    onPress={() => {
                      onLoadMore();
                    }}
                    className="bg-white"
                  >
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-slate-700">
                        Load More Older Comment
                      </p>
                      <HiArrowUp size={15} className="text-blue-500" />
                    </div>
                  </Button>
                </div>
              )}
            </>
          )}
          {comments?.data.list.length === 0 && (
            <div className="w-full h-[30vh] mx-auto flex justify-center items-center">
              <p className="text-sm text-slate-400">No comment found</p>
            </div>
          )}
          {comments?.data.list.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col w-full ${
                message.sender === "customer" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`w-fit bg-white p-2 ${
                  message.sender === "customer"
                    ? "self-end rounded-tl-lg rounded-tr-none"
                    : "self-start rounded-tl-none rounded-tr-lg"
                } rounded-b-lg`}
              >
                <div className="font-semibold text-xs">
                  {message.sender === "customer" ? "Customer" : "Agent"}
                </div>
                <div className="text-sm">{message.content}</div>
                {message.attachments.length > 0 && (
                  <>
                    <Divider />
                    <div className="space-y-1 mt-1">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex justify-start items-center p-1 space-x-2"
                        >
                          <p className="text-xs text-slate-600">
                            {attachment.name}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {attachment.size} Kb
                          </p>
                          <div
                            onClick={() => {
                              setSelectedAttachment(attachment.id);
                              onOpenAttachment(attachment.id);
                            }}
                            role="button"
                            className="text-success-600 text-xs font-semibold"
                          >
                            View
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <div className="text-xs text-slate-400">
                  {DateTime.fromISO(
                    message.createdAt ?? DateTime.now().toString(),
                  )
                    .toLocal()
                    .toFormat("dd MMM yyyy, HH:mm")}
                </div>
              </div>
            </div>
          ))}
        </div>
        <input
          accept="image/*,application/pdf, video/*"
          multiple
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <form onSubmit={onSubmit}>
          <div className="p-2 bg-transparent rounded-md">
            <Input
              type="text"
              variant="flat"
              radius="sm"
              placeholder="Type your message here"
              className="w-full"
              classNames={{ inputWrapper: "bg-white focused:bg-white" }}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              endContent={
                <div className="flex items-center space-x-2">
                  <Button
                    onPress={() => fileInputRef.current?.click()}
                    isIconOnly
                    className="bg-transparent text-slate-400"
                  >
                    <AiOutlineFileAdd />
                  </Button>
                  <Button
                    isIconOnly
                    className="bg-transparent text-slate-400"
                    type="submit"
                  >
                    <AiOutlineSend />
                  </Button>
                </div>
              }
            />
          </div>
        </form>
        {fileList.length > 0 && (
          <div className="space-y-1 px-4 mb-2">
            {fileList.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div className="text-xs font-semibold">{item.fileName}</div>
                <div className="text-xs text-default-500">({item.size}Kb)</div>
                {item.isUploaded ? (
                  <div
                    role="button"
                    onClick={() => {
                      onDeleteItem(index);
                    }}
                  >
                    <HiTrash className="text-red-500" />
                  </div>
                ) : (
                  <div className="text-xs text-default-500">Uploading...</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <ImageViewModal
        isOpen={open}
        data={attachment}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
