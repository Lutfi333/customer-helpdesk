"use client";
import { useDeleteProject, useProjectList } from "@/services/project";
import { ProjectList } from "@/services/project/types";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@heroui/react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaSearch,
} from "react-icons/fa";
import { HiOutlineClock, HiPlus } from "react-icons/hi";
import { PiFolderMinusLight } from "react-icons/pi";

export default function ProjectManagementWrapper() {
  const router = useRouter();
  const path = usePathname();
  const qs = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string>("");

  const [columns, setColumns] = useState([
    {
      key: "projectName",
      uid: "projectName",
      name: "Project Name",
      sortable: false,
    },
    {
      key: "description",
      uid: "description",
      name: "Description",
      sortable: false,
    },
    { key: "createdAt", uid: "createdAt", name: "Created at", sortable: false },
    { key: "actions", uid: "actions", name: "Action", sortable: false },
  ]);

  const paginationParams = useMemo(() => {
    if (qs.get("q") !== null && qs.get("q") !== "")
      setSearchValue(qs.get("q") ?? "");
    return {
      page: Number(qs.get("page")) || 1,
      limit: Number(qs.get("limit")) || 10,
      sort: qs.get("sort") || "createdAt",
      dir: "desc",
      q: qs.get("q") || "",
    };
  }, [qs]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(qs.toString());
      params.set(name, value);
      return params.toString();
    },
    [qs],
  );

  const { data, isLoading, refetch } = useProjectList(paginationParams);

  const { mutate: deleteProject } = useDeleteProject(projectToDelete);

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    deleteProject(
      {},
      {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setProjectToDelete("");
          toast.success("Delete project successfully");
          refetch();
        },
        onError: () => {
          toast.error("Failed to delete project");
        },
      },
    );
  };

  const renderCell = useCallback(
    (item: ProjectList, columnKey: React.Key) => {
      switch (columnKey) {
        case "projectName":
          return (
            <div className="flex flex-col max-w-56">
              <p className="text-bold text-small text-ellipsis">{item.name}</p>
            </div>
          );
        case "description":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{item.description}</p>
            </div>
          );
        case "createdAt":
          return (
            <div className="flex items-center gap-2">
              <HiOutlineClock className="text-lg text-warning-500 shrink-0" />
              <p className="text-bold text-small">
                {DateTime.fromISO(item.createdAt).toFormat("dd MMM yyyy")}
              </p>
            </div>
          );
        case "actions":
          return (
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <FaEllipsisV />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="edit"
                  onPress={() =>
                    router.push(`/project-management/edit/${item.id}`)
                  }
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onPress={() => handleDelete(item.id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          );
        default:
          return null;
      }
    },
    [router],
  );

  const bottomContent = useCallback(() => {
    return (
      <Suspense fallback={<div></div>}>
        <div className="flex items-center justify-center gap-4">
          <p className="text-sm text-gray-500">
            Total {data?.data.total} Items
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
              total={data?.data.totalPage ?? 0}
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
              isDisabled={paginationParams.page >= (data?.data?.totalPage ?? 1 )}
              onPress={() => {
                if (
                  data?.data?.totalPage !== undefined &&
                  paginationParams.page < data?.data?.totalPage
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
  }, [data?.data, paginationParams.page, router, path, createQueryString]);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md w-full mt-4">
        <div className="flex items-center justify-between p-4 border-b">
          <p className="text-lg font-semibold">Your Project List</p>
          <div className="ml-auto flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as HTMLFormElement;
                const search = target.search;
                router.push(`${path}?${createQueryString("q", search.value)}`);
              }}
            >
              <Input
                id="search"
                aria-label="search"
                placeholder="Search by Project Name"
                size="sm"
                radius="sm"
                endContent={<FaSearch />}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value === "") {
                    router.push(`${path}?${createQueryString("q", "")}`);
                  }
                }}
              />
            </form>
            <Button
              aria-label="submit"
              size="sm"
              radius="sm"
              onPress={() => router.push("/project-management/create")} // Updated path
              className="rounded-md bg-primary text-white"
              startContent={<HiPlus size={20} />}
            >
              Add New Project
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Table
            isStriped
            bottomContent={bottomContent()}
            bottomContentPlacement="outside"
            classNames={{ wrapper: "p-0 rounded-md" }}
            aria-label="Project list table"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              loadingContent={
                <div className="flex h-60 flex-col items-center justify-center text-sm">
                  <Spinner />
                  <p className="mt-3 text-default-400">Loading...</p>
                </div>
              }
              emptyContent={
                <div className="flex h-60 flex-col items-center justify-center text-sm">
                  <PiFolderMinusLight size={20} />
                  <p className="mt-3 text-default-400">No Project Yet</p>
                </div>
              }
              items={data?.data.list ?? []}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>ATTENTION</ModalHeader>
          <ModalBody>Are you sure to delete this project?</ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              onPress={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button color="danger" onPress={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

