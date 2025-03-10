"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Chip,
  Spinner,
  Input,
  Tooltip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { HiOutlineClock, HiOutlineFilter, HiPlus } from "react-icons/hi";
import { PiFolderMinusLight } from "react-icons/pi";
import Cookie from "js-cookie";
import { USER } from "@/constants/auth";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";
import { useDeleteUser, useUserList } from "@/services/user";
import { UserList } from "@/services/user/types";
import DeleteUserModal from "./delete-user-modal";
import toast from "react-hot-toast";
import { useAuthMe } from "@/services/auth";

export default function UserManagementWrapper() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [columns, setColumns] = useState([
    { key: "name", uid: "name", name: "Name", sortable: false },
    { key: "email", uid: "email", name: "Email", sortable: false },
    {
      key: "position",
      uid: "position",
      name: "Position",
      sortable: false,
    },
    {
      key: "role",
      uid: "role",
      name: "Role",
      sortable: false,
    },
    {
      key: "last_activity",
      uid: "last_activity",
      name: "Last Activity",
      sortable: false,
    },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const { data: userData, isFetching: isFetchingUser } = useAuthMe();

  const user = useMemo(() => userData?.data, [userData]);

  const paginationParams = useMemo(() => {
    if (qs.get("q") !== null && qs.get("q") !== "")
      setSearchValue(qs.get("q") ?? "");
    return {
      page: currentPage,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      q: qs.get("q") || "",
    };
  }, [qs, currentPage]);

  const { data, isFetching, refetch } = useUserList(paginationParams);

  const { mutate: deleteUser } = useDeleteUser(selectedUser);

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
    router.push(`${path}?${createQueryString("q", search.value)}`);
  };

  const onHandleDelete = () => {
    selectedUser &&
      deleteUser(selectedUser, {
        onSuccess: () => {
          setIsOpenDelete(false);
          toast.success("Delete user successfully");
          refetch();
        },
        onError: (e) => {
          toast.error(e.data.message);
        },
      });
  };

  const renderCell = useCallback(
    (data: UserList, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col max-w-56">
              <p className="text-bold text-small text-ellipsis">
                {data?.name ?? ""}
              </p>
            </div>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{data?.email ?? ""}</p>
            </div>
          );
        case "position":
          return (
            <div className="flex items-center gap-2">
              <p>{data?.jobTitle ?? ""}</p>
            </div>
          );
        case "role":
          return (
            <div className="flex items-center gap-2 capitalize">
              <p>{data?.role ?? ""}</p>
            </div>
          );
        case "last_activity":
          return (
            <p className="text-bold text-small capitalize">
              {data.lastActivityAt !== null
                ? DateTime.fromISO(data?.lastActivityAt ?? "")
                    .toLocal()
                    .toFormat("dd MMM yyyy, HH:mm")
                : "-"}
            </p>
          );
        case "actions":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <FaEllipsisV />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem
                  onPress={() =>
                    router.push(`/user-management/update/${data.id}`)
                  }
                  key="edit"
                >
                  Edit
                </DropdownItem>
                <>
                  {data.id !== user?.id && (
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onPress={() => {
                        setIsOpenDelete(true);
                        setSelectedUser(data.id);
                      }}
                    >
                      Delete
                    </DropdownItem>
                  )}
                </>
              </DropdownMenu>
            </Dropdown>
          );
      }
    },
    [router, user?.id],
  );

  const bottomContent = () => {
    return (
      <Suspense aria-label="suspense" fallback={<div></div>}>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-gray-500">
            Total {data?.data?.total ?? 0} Item
          </p>
          {paginationParams && (
            <div className="flex items-center gap-2">
              <Button
                onPress={() => {
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                disabled={currentPage <= 1}
                isDisabled={currentPage <= 1}
                className="h-9"
                variant="bordered"
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
                initialPage={currentPage}
                page={currentPage}
                total={Math.ceil(
                  (data?.data.total ?? 0) / paginationParams.limit,
                )}
                variant="bordered"
                onChange={(value) => {
                  setCurrentPage(value);
                  // router.push(
                  //   `${path}?${createQueryString("page", value.toString())}`,
                  // );
                }}
              />
              <Button
                onPress={() => {
                  if (
                    Math.ceil(
                      (data?.data.total ?? 0) / paginationParams.limit,
                    ) > currentPage
                  ) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                disabled={
                  Math.ceil((data?.data.total ?? 0) / paginationParams.limit) <=
                  currentPage
                }
                isDisabled={
                  Math.ceil((data?.data.total ?? 0) / paginationParams.limit) <=
                  currentPage
                }
                className="h-9"
                variant="bordered"
              >
                Next
                <FaChevronRight />
              </Button>
            </div>
          )}
        </div>
      </Suspense>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full mt-4">
      <div className="flex items-center justify-between p-4 border-b">
        <p className="text-lg font-semibold">User Management</p>
        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={onsubmitSearch} className="flex justify-evenly">
            <Input
              id="search"
              aria-label="search"
              placeholder="Search by Name"
              size="sm"
              radius="sm"
              endContent={<FaSearch />}
              value={searchValue}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setSearchValue(target.value);
                if (target.value === "") {
                  router.push(`${path}?${createQueryString("q", "")}`);
                }
              }}
            />
          </form>
          <Button
            aria-label="create"
            size="sm"
            radius="sm"
            onPress={() => {
              router.push(`/user-management/create`);
            }}
            className="rounded-md bg-primary text-white"
            startContent={<HiPlus size={20} />}
          >
            Create New User
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Table
          isStriped
          bottomContent={bottomContent()}
          bottomContentPlacement="outside"
          classNames={{ wrapper: "p-0 rounded-md" }}
          aria-label="List User"
        >
          <TableHeader aria-label="table header list user" columns={columns}>
            {(column) => (
              <TableColumn
                aria-label="table column list user"
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
            items={data?.data.list ?? []}
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
      <DeleteUserModal
        isOpen={isOpenDelete}
        onClose={() => {
          setIsOpenDelete(false);
        }}
        onSubmit={() => {
          onHandleDelete();
        }}
      />
    </div>
  );
}
