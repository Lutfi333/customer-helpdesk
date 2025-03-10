"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import Cookies from "js-cookie";
import { AUTH_KEY, USER } from "@/constants/auth";
import { useAuthMe } from "@/services/auth";

export default function NavbarTop() {
  const { data: user, isFetching } = useAuthMe();

  return (
    <Navbar maxWidth="full" className="z-20 h-20 border-b">
      <NavbarContent justify="end" className="flex-1">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div role="button" className="flex">
                {!isFetching && (
                  <>
                    <div className="mr-2">
                      <p className="text-sm">{user?.data?.name ?? ""}</p>
                      <p className="text-xs text-gray-500 font-light">
                        {user?.data?.email ?? ""}
                      </p>
                    </div>
                    <Avatar
                      src={user?.data?.companyProduct?.image ?? ""}
                      className="text-gray-400 transition-transform"
                    />
                  </>
                )}
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                onPress={() => {
                  window.location.href = "/setting";
                }}
                key="setting"
              >
                Setting
              </DropdownItem>
              <DropdownItem
                onPress={() => {
                  Cookies.remove(AUTH_KEY);
                  Cookies.remove(USER);
                  window.location.href = "/login";
                }}
                key="logout"
                color="danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
