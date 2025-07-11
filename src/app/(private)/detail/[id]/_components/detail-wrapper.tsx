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
import {
  RiArrowLeftLine,
  RiAttachment2,
  RiSendPlane2Line,
} from "react-icons/ri";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { Textarea } from "@heroui/react";

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
  const EmojiPicker = dynamic(() => import("./emoji-picker"), {
    ssr: false,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const subdomain = domain?.split(".")[0];

  const { data: company, isFetching: isFetchingCompany } =
    useDetailCompany(subdomain);

  const { mutate: submitComment, isPending } = useSubmitComment();

  const { mutate: getAttachment, isPending: isPendingAttachment } =
    useDetailAttachment(selectedAttachment);

  const { mutate: uploadAttachment } = useUploadAttachment();
  const { setValue, getValues } = useForm<{ comment: string }>();

  const addEmoji = (emoji: any) => {
    const symbol = emoji.native ?? "";
    if (!symbol) return;

    const next = inputMessage + symbol;

    setInputMessage(next); // update input visual
    setValue("comment", next); // update react-hook-form
    // inputRef.current?.focus(); // balikin fokus
    setShowEmojiPicker(false); // tutup modal
  };

  const renderMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="!text-blue-600 underline hover:!text-blue-800"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

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

      <div className="w-full rounded-md shadow-xl bg-white">
        <div className="flex items-center justify-between m-2">
          <div className="flex items-center space-x-2">
            {/* <p>{company?.data?.logo.url}</p> */}
            <div className="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex items-center justify-center">
              {!isFetchingCompany && (
                <Image
                  src={company?.data?.logo.url}
                  alt="company logo"
                  height={50}
                  width={50}
                  className="w-full h-full object-contain aspect-square"
                />
              )}
            </div>
            <p>{company?.data?.name}</p>
          </div>
        </div>
        <div className="relative rounded-md h-[560px] bg-slate-700 overflow-auto">
          <div className="flex-1 overflow-auto px-2 pt-2 pb-36"></div>
          {loadingComment ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size="sm" />
            </div>
          ) : comment.length === 0 ? (
            <div className="w-full h-full flex flex-col justify-center items-center text-white">
              <p className="font-semibold">
                You’re starting a new conversation
              </p>
              <p className="text-sm">Type your first message below.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-2">
              {(comments?.data.totalPage ?? 0) > pagination.page && (
                <div className="w-full flex justify-center">
                  <Button onPress={onLoadMore} className="bg-white">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-slate-700">
                        Load More Older Comment
                      </p>
                      <HiArrowUp size={15} className="text-blue-500" />
                    </div>
                  </Button>
                </div>
              )}
              {comment.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.sender === "customer" ? "items-end" : "items-start"}`}
                >
                  <div className="text-xs text-gray-400 mb-0.5">
                    {DateTime.fromISO(
                      message.createdAt ?? DateTime.now().toString(),
                    )
                      .toLocal()
                      .toFormat("dd LLL yyyy, HH:mm")}
                  </div>
                  <div
                    className={`max-w-[80%] border border-gray-500 p-2 rounded-lg ${message.sender === "customer" ? "bg-primary text-white" : "bg-white text-slate-800"}`}
                  >
                    <div>{renderMessage(message.content)}</div>
                    {message.attachments.length > 0 && (
                      <>
                        <Divider className="my-1" />
                        <div className="space-y-1 mt-1">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-2"
                            >
                              <p className="text-xs">{attachment.name}</p>
                              <p className="text-[10px] opacity-70">
                                {attachment.size} Kb
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAttachment(attachment.id);
                                  onOpenAttachment(attachment.id);
                                }}
                                className="text-xs text-success-400 font-semibold"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sticky input at bottom */}
          <div className="bg-slate-700 p-2 border-t border-gray-600">
            {" "}
            <form onSubmit={onSubmit}>
              <Textarea
                type="text"
                variant="flat"
                radius="sm"
                placeholder="Type your message here"
                className="w-full"
                classNames={{ inputWrapper: "bg-white focused:bg-white" }}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  setValue("comment", e.target.value);
                }}
                endContent={
                  <>
                    <div className="flex items-center space-x-2">
                      <Button
                        aria-label="emoji"
                        isIconOnly
                        variant="bordered"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowEmojiPicker((prev) => !prev);
                        }}
                        className="cursor-pointer border-primary"
                      >
                        😊
                      </Button>
                      <Button
                        aria-label="attachment"
                        isIconOnly
                        variant="bordered"
                        onClick={(event) => {
                          event.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="cursor-pointer border-primary"
                      >
                        <RiAttachment2 size={20} className="text-primary" />
                      </Button>

                      <Button
                        aria-label="send"
                        isIconOnly
                        type="submit"
                        className="cursor-pointer bg-primary"
                      >
                        <RiSendPlane2Line size={20} className="text-white" />
                      </Button>
                    </div>
                    {showEmojiPicker && (
                      <div className="absolute bottom-14 right-0 z-50">
                        <EmojiPicker onEmojiSelect={addEmoji} />
                      </div>
                    )}
                  </>
                }
              />
            </form>
            {fileList.length > 0 && (
              <div className="space-y-1 px-2 pt-2">
                {fileList.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <p className="text-xs font-semibold">{item.fileName}</p>
                    <p className="text-xs text-default-500">({item.size}Kb)</p>
                    {item.isUploaded ? (
                      <button onClick={() => onDeleteItem(index)} type="button">
                        <HiTrash className="text-red-500" />
                      </button>
                    ) : (
                      <p className="text-xs text-default-500">Uploading...</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
