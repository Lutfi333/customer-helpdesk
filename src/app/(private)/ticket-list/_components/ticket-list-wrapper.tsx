"use client";

import { USER } from "@/constants/auth";
import { useTicketList } from "@/services/ticket";
import { ListTicketDatum } from "@/services/ticket/types";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import Cookie from "js-cookie";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { HiOutlineClock, HiOutlineFilter, HiPlus } from "react-icons/hi";
import { PiFolderMinusLight } from "react-icons/pi";
import FilterModal from "./filter-modal";

export default function TicketListWrapper() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [subject, setSubject] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const [columns, setColumns] = useState([
    {
      key: "ticket_id",
      uid: "ticket_id",
      name: "Ticket ID",
      sortable: false,
    },
    {
      key: "subject",
      uid: "subject",
      name: "Subject",
      sortable: false,
    },
    // {
    //   key: "project",
    //   uid: "project",
    //   name: "Project",
    //   sortable: false,
    // },
    {
      ket: "category",
      uid: "category",
      name: "Category",
      sortable: false,
    },
    {
      key: "created_at",
      uid: "created_at",
      name: "Created on",
      sortable: false,
    },
    {
      key: "close_at",
      uid: "close_at",
      name: "Closed at",
      sortable: false,
    },
    { key: "priority", uid: "priority", name: "Priority", sortable: false },
    { key: "status", uid: "status", name: "Status", sortable: false },
    { key: "actions", uid: "actions", name: "", sortable: false },
  ]);

  const user = useMemo(() => {
    const user = JSON.parse(Cookie.get(USER) ?? "{}");
    return user;
  }, []);

  const paginationParams = useMemo(() => {
    if (qs.get("subject") !== null && qs.get("subject") !== "")
      setSubject(qs.get("subject") ?? "");
    return {
      page: Number(qs.get("page")) || 1,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      status: qs.get("status") || "",
      subject: qs.get("subject") || "",
      code: qs.get("code") || "",
      customerID: qs.get("customerID") || "",
    };
  }, [qs]);

  const { data: tickets, isFetching } = useTicketList(paginationParams);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const onsubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const search = target.search;
    router.push(`${path}?${createQueryString("subject", search.value)}`);
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
  

  const renderCell = useCallback(
    (data: ListTicketDatum, columnKey: React.Key) => {
      switch (columnKey) {
        case "subject":
          return (
            <div className="flex flex-col max-w-56">
              <p className="text-bold text-small text-ellipsis">
                {data?.subject ?? ""}
              </p>
            </div>
          );
        case "ticket_id":
          return (
            <div className="flex items-center gap-2">
              <p>{data?.code ?? ""}</p>
            </div>
          );
        case "project":
          return (
            <div className="flex items-center gap-2">
              <p>{data?.project.name ?? ""}</p>
            </div>
          );
        case "category":
          return (
            <div className="flex items-center gap-2">
              <p>{data?.category?.name || ""}</p>
            </div>
          );
        case "created_at":
          return (
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-lg text-warning-500 shrink-0" />
              <p className="text-bold text-small capitalize">
                {DateTime.fromISO(data?.createdAt)
                  .toLocal()
                  .toFormat("dd MMM yyyy, HH:mm")}
              </p>
            </div>
          );
        case "close_at":
          return (
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-lg text-warning-500 shrink-0" />
              <p className="text-bold text-small capitalize">
                {data.closedAt != null
                  ? DateTime.fromISO(data?.closedAt)
                      .toLocal()
                      .toFormat("dd MMM yyyy, HH:mm")
                  : "-"}
              </p>
            </div>
          );
        case "priority":
          return (
            <div className="flex items-center gap-2">
              <p>{data.priority}</p>
            </div>
          );
        case "status":
          return <>{renderStatus(data.status)}</>;
        case "actions":
          return (
            <div
              onClick={() => {
                router.push(`/detail/${data.id}`);
              }}
              role="button"
              className="relative cursor-pointer justify-start gap-2"
            >
              <p className="text-primary">View</p>
            </div>
          );
      }
    },
    [router, renderStatus],
  );

  const bottomContent = () => {
    return (
      <Suspense fallback={<div></div>}>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-gray-500">
            Total {tickets?.data.total} Items
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="bordered"
              isDisabled={paginationParams.page <= 1}
              onPress={() => {
                if (paginationParams.page > 1) {
                  router.push(
                    `${path}?${createQueryString(
                      "page",
                      (paginationParams.page - 1).toString(),
                    )}`,
                  );
                }
              }}
            >
              <FaChevronLeft />
              Prev
            </Button>
            <Pagination
              showControls={false}
              classNames={{
                cursor: "bg-black text-white",
              }}
              disableAnimation
              color="primary"
              initialPage={paginationParams.page}
              page={paginationParams.page}
              total={tickets?.data.totalPage ?? 0}
              variant="bordered"
              onChange={(value) => {
                router.push(
                  `${path}?${createQueryString("page", value.toString())}`,
                );
              }}
            />
            <Button
              size="sm"
              variant="bordered"
              isDisabled={
                paginationParams.page >= (tickets?.data?.totalPage ?? 1)
              }
              onPress={() => {
                if (
                  tickets?.data?.totalPage !== undefined &&
                  paginationParams.page < tickets?.data?.totalPage
                ) {
                  router.push(
                    `${path}?${createQueryString(
                      "page",
                      (paginationParams.page + 1).toString(),
                    )}`,
                  );
                }
              }}
            >
              Next
              <FaChevronRight />
            </Button>
          </div>
        </div>
      </Suspense>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full mt-4">
      <div className="flex items-center justify-between p-4 rounded-lg">
        <h1 className="text-xl font-semibold text-gray-800">Ticket List</h1>
        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={onsubmitSearch} className="flex justify-evenly">
            <Input
              id="search"
              aria-label="search"
              placeholder="Search by subject"
              size="sm"
              radius="sm"
              endContent={<FaSearch />}
              value={subject}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSubject(target.value);
                if (target.value === "") {
                  router.push(`${path}?${createQueryString("subject", "")}`);
                }
              }}
            />
          </form>
          <Tooltip content="Filter My Ticket" placement="bottom">
            <Button
              className={`rounded-md text-white bg-gray-700`}
              size="sm"
              radius="sm"
              onPress={() => {
                setOpenFilter(true);
              }}
              startContent={<HiOutlineFilter size={20} />}
            >
              Filter
            </Button>
          </Tooltip>
          <Button
            aria-label="submit"
            size="sm"
            radius="sm"
            onPress={() => {
              router.push(`/submit`);
            }}
            className="rounded-md bg-primary text-white"
            startContent={<HiPlus size={20} />}
          >
            Submit a Ticket
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Table
          isStriped
          bottomContent={bottomContent()}
          bottomContentPlacement="outside"
          classNames={{ wrapper: "p-0 rounded-md" }}
          aria-label="List Tickets"
        >
          <TableHeader aria-label="table header list tickets" columns={columns}>
            {(column) => (
              <TableColumn
                aria-label="table column list tickets"
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            aria-label="table body list tickets"
            isLoading={isFetching}
            loadingContent={
              <div className="flex h-60 flex-col items-center justify-center text-sm">
                <Spinner />
                <p className="mt-3 text-default-400">Loading...</p>
              </div>
            }
            emptyContent={
              <div className="flex h-60 flex-col items-center justify-center text-sm">
                <PiFolderMinusLight size={20} />
                <p className="mt-3 text-default-400">No Ticket</p>
              </div>
            }
            items={tickets?.data?.list ?? []}
          >
            {(item) => (
              <TableRow aria-label="table row list tickets" key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <FilterModal
        isOpen={openFilter}
        onClose={() => {
          setOpenFilter(false);
        }}
        selectedSort={qs.get("sort") || "createdAt"}
        selectedStatus={qs.get("status") || ""}
        subject={qs.get("subject") || ""}
        customerId={qs.get("customerID") || ""}
        reset={() => {
          setOpenFilter(false);
          router.push(path);
        }}
        submit={(
          data: {
            key: string;
            value: string;
          }[],
        ) => {
          setOpenFilter(false);
          let query = "";
          data.forEach((item) => {
            query +=
              item.key === "filterTicket"
                ? `customerID=${item.value === "my" ? user.id : ""}&`
                : `${item.key}=${item.value}&`;
          });
          router.push(`${path}?${query}`);
        }}
      />
    </div>
  );
}
