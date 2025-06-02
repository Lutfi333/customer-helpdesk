"use client";

import {
  useDetailAttachment,
  useTicketCancel,
  useTicketClose,
  useTicketDetail,
  useTicketReopen,
} from "@/services/ticket";
import { Attachment } from "@/services/ticket/types";
import { Button, Chip } from "@heroui/react";
import { DateTime } from "luxon";
import { Fragment } from "react";
import toast from "react-hot-toast";
import ImageViewModal from "./image-view-modal";

export default function TicketInfo(props: { id: string }) {
  const [open, setOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string>("");
  const [attachment, setAttachment] = useState<Attachment>({
    id: "",
    size: 0,
    url: "",
    name: "",
    type: "",
  });

  const {
    data: detail,
    isLoading,
    refetch: refetchDetail,
  } = useTicketDetail(props.id);

  const { mutate: closeTicket, isPending: isClosePending } = useTicketClose();

  const { mutate: cancelTicket, isPending: isCancelPending } =
    useTicketCancel();

  const { mutate: reopenTicket, isPending: isReopenPending } =
    useTicketReopen();
  const { mutate: getAttachment, isPending: isPendingAttachment } =
    useDetailAttachment(selectedAttachment);

  const onCloseTicket = () => {
    closeTicket(
      {
        id: detail?.data.id,
      },
      {
        onSuccess: (data) => {
          toast.success("Ticket closed");
          refetchDetail();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const onCancelTicket = () => {
    cancelTicket(
      {
        id: detail?.data.id,
      },
      {
        onSuccess: () => {
          toast.success("Ticket canceled");
          refetchDetail();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      },
    );
  };

  const onReopenTicket = () => {
    reopenTicket(
      {
        id: detail?.data.id,
      },
      {
        onSuccess: () => {
          toast.success("Ticket re opened");
          refetchDetail();
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

  const renderStatus = useCallback((status: string) => {
    let color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" = "default";
  
    switch (status) {
      case "open":
        color = "primary";      
        break;
      case "in_progress":
        color = "secondary";   
        break;
      case "close":
        color = "success";      
        break;
      case "resolve":
        color = "warning";      
        break;
      case "cancel":
        color = "danger";       
        break;
      default:
        color = "default";     
    }
  
    return (
      <Chip
        color={color}
        className="capitalize"
        size="sm"
        variant="solid"
      >
        {status.replace("_", " ")}
      </Chip>
    );
  }, []);

  return (
    <Fragment>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex justify-center items-center">
          <p className="text-lg">Ticket Information</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Category</p>
          <p>{detail?.data.category?.name || ""}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Subject</p>
          <p>{detail?.data.subject}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Project</p>
          <p>{detail?.data.project.name}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Description</p>
          <p>{detail?.data.content}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Ticket-ID</p>
          <p>{detail?.data.code}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Created on</p>
          <p>
            {DateTime.fromISO(
              detail?.data.createdAt ?? DateTime.now().toString(),
            )
              .toLocal()
              .toFormat("dd MMM yyyy, HH:mm")}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Requester</p>
          <p>{detail?.data.customer.name}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs">Status</p>
          {renderStatus(detail?.data.status ?? "open")}
        </div>

        <div>
          <p className="text-slate-400 text-xs">Priority</p>
          <p>{detail?.data.priority}</p>
        </div>
      </div>
      <div className="mt-5">
        {detail?.data.attachments &&
          detail.data.attachments.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-center p-3 gap-2 rounded-md border-[1px] border-slate-200"
            >
              <p className="w-full text-sm">{item.name}</p>
              <Button
                onPress={() => {
                  setSelectedAttachment(item.id);
                  onOpenAttachment(item.id);
                }}
                variant="light"
                size="sm"
                color="primary"
                className="ml-auto font-bold"
              >
                View
              </Button>
            </div>
          ))}
      </div>
      <div className="w-full flex justify-center pt-5">
        {detail?.data.status === "closed" ? (
          <Button
            onPress={() => {
              onReopenTicket();
            }}
            className="bg-green-400 text-white rounded-md"
            isLoading={isReopenPending}
          >
            Re Open
          </Button>
        ) : (
          <>
            {detail?.data.status === "open" ? (
              <Button
                isDisabled={detail?.data.logTime.status == "running"}
                disabled={detail?.data.logTime.status == "running"}
                isLoading={isCancelPending}
                onPress={() => {
                  onCancelTicket();
                }}
                className="bg-red-400 text-white rounded-md"
              >
                Cancel
              </Button>
            ) : (
              <Fragment>
                {detail?.data.status !== "closed" && (
                  <Button
                    isDisabled={detail?.data.logTime.status == "running"}
                    disabled={detail?.data.logTime.status == "running"}
                    isLoading={isClosePending}
                    onPress={() => {
                      onCloseTicket();
                    }}
                    className="bg-red-400 text-white rounded-md"
                  >
                    Close Issue
                  </Button>
                )}
              </Fragment>
            )}
          </>
        )}
      </div>
      <ImageViewModal
        isOpen={open}
        data={attachment}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Fragment>
  );
}
