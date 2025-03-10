"use client";
import { COMPANY_DATA } from "@/constants/auth";
import Cookie from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { LuTicket } from "react-icons/lu";
import { SlScreenDesktop } from "react-icons/sl";
import { Menu, MenuItem, Sidebar, sidebarClasses } from "react-pro-sidebar";

import { useAuthMe } from "@/services/auth";
import { Image } from "@heroui/react";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isFetching } = useAuthMe();

  const user = useMemo(() => data?.data, [data]);

  const companyLogo = JSON.parse(Cookie.get(COMPANY_DATA) as string);

  const activeMenu = (path: string) => {
    if (pathname === path) return true;
    else return false;
  };

  return (
    <Sidebar
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "white",
          borderRight: "1px solid #ffffff",
          zIndex: 0,
        },
      }}
      className="h-screen"
    >
      <div className="px-4 flex items-center justify-center">
        <div className="rounded-md mb-5 mt-3">
          <Image
            width={150}
            alt="swo logo"
            src={
              companyLogo.logo
                ? companyLogo.logo.url
                : "/assets/solutionlabs-logo.png"
            }
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      <Menu
        className="px-2"
        menuItemStyles={{
          button: ({ active }) => {
            className: `${active ? "bg-primary" : ""}`;
            return {
              color: active ? "#FBF9F1" : "#64748B",
              backgroundColor: active ? "var(--primary-color)" : undefined,
              borderRadius: "8px",
              marginBottom: "8px",
              marginTop: "8px",
              paddingLeft: "5px",
              paddingRight: "5px",
              "&:hover": {
                color: "#FBF9F1",
                backgroundColor: "#758694",
                borderRadius: "8px",
                marginBottom: "8px",
                marginTop: "8px",
                paddingLeft: "5px",
                paddingRight: "5px",
              },
            };
          },
        }}
      >
        <MenuItem
          className="rounded-md"
          active={activeMenu("/")}
          icon={<SlScreenDesktop />}
          onClick={() => {
            router.push(`/`);
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          className="rounded-md"
          active={activeMenu("/ticket-list")}
          icon={<LuTicket />}
          onClick={() => {
            router.push(`/ticket-list`);
          }}
        >
          Tickets
        </MenuItem>
        {user?.role === "admin" && (
          <MenuItem
            className="rounded-md"
            active={activeMenu("/user-management")}
            icon={<FaRegUser />}
            onClick={() => {
              router.push(`/user-management`);
            }}
          >
            User Management
          </MenuItem>
        )}
        <MenuItem
          className="rounded-md"
          active={activeMenu("/project-management")}
          icon={<HiOutlineClipboardDocumentList />}
          onClick={() => {
            router.push(`/project-management`);
          }}
        >
          Project Manajement
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}
