"use client";
import { USER } from "@/constants/auth";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import Cookie from "js-cookie";
import { Fragment } from "react";
import { HiCheck } from "react-icons/hi";

type FilterModalProps = {
  isOpen: boolean;
  onClose: (success: boolean) => void;
  selectedStatus: string;
  selectedSort: string;
  subject: string;
  customerId: string;
  submit: (data: SubmitData[]) => void;
  reset: () => void;
};

type Status = {
  id: string;
  name: string;
  selected: boolean;
};

type SubmitData = {
  key: string;
  value: string;
};

function FilterModal(props: FilterModalProps) {
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [ticketID, setTicketID] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [selectedFlterTicket, setSelectedFlterTicket] = useState<string>("");

  const data: Status[] = useMemo(
    () => [
      { id: "open", name: "Open", selected: false },
      { id: "closed", name: "Closed", selected: false },
      { id: "in_progress", name: "In Progress", selected: false },
      { id: "resolve", name: "Resolve", selected: false },
      { id: "cancel", name: "Cancel", selected: false },
    ],
    [],
  );

  const user = useMemo(() => {
    const user = JSON.parse(Cookie.get(USER) ?? "{}");
    return user;
  }, []);

  useEffect(() => {
    let temp: Status[] = data.map((item) => {
      if (props.selectedStatus == "") {
        return item;
      }
      var listStatus = props.selectedStatus.split(",");
      for (let i = 0; i < listStatus.length; i++) {
        if (item.id == listStatus[i]) {
          return { ...item, selected: true };
        }
      }
      return item; // Add a default return value
    });
    setStatusList(temp);
    setSelectedSort(props.selectedSort);
    setSubject(props.subject);
    setSelectedFlterTicket(props.customerId == "" ? "all" : "my");
  }, [props, data]);

  const onReset = () => {
    let temp = statusList.map((item) => {
      return { ...item, selected: false };
    });
    setStatusList(temp);
    setSelectedSort("");
    setSubject("");
    setTicketID("");
    setSelectedFlterTicket("");
    props.reset();
  };

  const onSubmitFilter = () => {
    let status = statusList
      .filter((item) => item.selected)
      .map((item) => item.id)
      .join(",");
    var data: SubmitData[] = [
      { key: "status", value: status },
      { key: "sort", value: selectedSort },
      { key: "subject", value: subject },
      { key: "code", value: ticketID },
      { key: "filterTicket", value: selectedFlterTicket },
    ];
    props.submit(data);
  };

  const onAddSelectedStatus = (status: Status) => {
    let temp = statusList.map((item) => {
      if (item.id == status.id) {
        if (item.selected) {
          return { ...item, selected: false };
        }
        return { ...item, selected: true };
      }
      return item;
    });
    setStatusList(temp);
  };

  const renderStatus = (status: Status) => {
    let color = "";
    switch (status.id) {
      case "open":
        color = "bg-green-500";
        break;
      case "close":
        color = "bg-blue-500";
        break;
      case "in_progress":
        color = "bg-violet-500";
        break;
      case "resolve":
        color = "bg-orange-400";
        break;
      case "cancel":
        color = "bg-red-400";
        break;
      default:
        color = "bg-blue-500";
    }

    return (
      <Fragment key={status.id}>
        <Chip
          aria-label="status"
          onClick={() => {
            onAddSelectedStatus(status);
          }}
          startContent={
            <div className={`mr-1 h-2 w-2 rounded-full ${color}`}></div>
          }
          endContent={
            status.selected && (
              <div className="ml-1 h-4 w-4 rounded-full bg-green-400 flex items-center justify-center">
                <HiCheck className="h-3 w-3 text-white" />
              </div>
            )
          }
          className="capitalize cursor-pointer"
          size="sm"
          variant="bordered"
          color={status.selected ? "primary" : "default"}
        >
          {status.name}
        </Chip>
      </Fragment>
    );
  };

  return (
    <Modal
      aria-label="filter"
      size="xl"
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose(false);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Filter</ModalHeader>
            <ModalBody className="space-y-2">
              <form className="space-y-2">
              <Select
                    aria-label="sort"
                    id="sort"
                    size="sm"
                    label="Sort by"
                    className="w-full"
                    defaultSelectedKeys={[selectedSort || "createdAt"]}
                    onChange={(e) => {
                      const target = e.target as HTMLSelectElement;
                      if (!target.value) {
                        return;
                      }
                      setSelectedSort(target.value);
                    }}
                  >
                    <SelectItem
                      key="createdAt"
                      value="createdAt"
                      isDisabled={selectedSort === "createdAt"} // Disable if already selected
                    >
                      Date Created
                    </SelectItem>
                    <SelectItem
                      key="updatedAt"
                      value="updatedAt"
                      isDisabled={selectedSort === "updatedAt"} // Disable if already selected
                    >
                      Last Modified
                    </SelectItem>
                  </Select>
                <Input
                  id="id"
                  aria-label="search"
                  placeholder="Search by Ticket ID"
                  size="lg"
                  radius="sm"
                  value={ticketID}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setTicketID(target.value);
                  }}
                />
                <Input
                  id="searchSubject"
                  aria-label="search"
                  placeholder="Search by subject"
                  size="lg"
                  radius="sm"
                  value={subject}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setSubject(target.value);
                  }}
                />
                {/* <Select
                  aria-label="my-filter"
                  id="sort"
                  size="sm"
                  label="Filter Ticket by"
                  className="w-full"
                  value={selectedFlterTicket || "all"}
                  defaultSelectedKeys={[selectedFlterTicket || "all"]}
                  onChange={(e) => {
                    const target = e.target as HTMLSelectElement;
                    setSelectedFlterTicket(target.value);
                  }}
                >
                  <SelectItem value="all" key={"all"}>
                    All Ticket
                  </SelectItem>
                  <SelectItem value="my" key={"my"}>
                    My Ticket
                  </SelectItem>
                </Select> */}
              </form>
              <div className="grid-cols space-x-2">
                {statusList.map((status) => renderStatus(status))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                aria-label="close"
                variant="bordered"
                color="primary"
                onPress={() => {
                  onReset();
                }}
                className="bg-red text-default-700 px-4 py-2 rounded-md"
              >
                Reset
              </Button>
              <Button
                aria-label="filter"
                color="primary"
                onPress={() => {
                  onSubmitFilter();
                }}
                className="text-white rounded-md ml-2"
              >
                Filter
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default FilterModal;
