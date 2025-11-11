"use client";

import type * as React from "react";

import {
  FilePlus2,
  FileSearch,
  Layers,
  UsersRound,
  UserRoundSearch,
  ShieldUser,
  FolderClock,
  FileBadge,
  LucideIcon,
  ClipboardClock,
  ClipboardPen,
} from "lucide-react";

import Image from "next/image";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  icon: LucideIcon;
  roles: number[];
  url?: string;
  items?: Array<{
    title: string;
    url: string;
    roles: number[];
  }>;
};

const navConfig: NavItem[] = [
  {
    title: "DASHBOARD",
    url: "/Dashboard",
    icon: Layers,
    roles: [0, 1, 2], // Example roles: 0 - Komite, 1 - Admin, 2 - Nakes
  },

  {
    title: "LOG-BOOK",
    url: "/Dashboard/Log_Book",
    icon: ClipboardClock,
    roles: [0, 1, 2], // Example roles: 0 - Komite, 1 - Admin, 2 - Nakes
  },
  {
    title: "LIST LOG-BOOK",
    url: "/Dashboard/List_Log_Book",
    icon: FolderClock,
    roles: [0, 1], // Example roles: 0 - Komite, 1 - Admin
  },
  {
    title: "MANAGE LOG-BOOK",
    icon: ClipboardPen,
    items: [
      {
        title: "Manage Dokument",
        url: "/Dashboard/Manage_Category_Log_Book",
        roles: [0], // Example roles: 0 - Komite,
      },
      {
        title: "Manage Jenis Ketrampilan",
        url: "/Dashboard/Manage_Jenis_Ketrampilan",
        roles: [0], // Example roles: 0 - Komite,
      },
    ],
    roles: [0], // Example roles: 0 - Komite,
  },
  // {
  //   title: "MANAGE LOG-BOOK",
  //   url: "/Dashboard/Manage_Category_Log_Book",
  //   icon: ClipboardPen,
  //   roles: [0, 1], // Example roles: 0 - Komite, 1 - Admin
  // },
  {
    title: "DATA NAKES",
    url: "/Dashboard/Data_Nakes",
    icon: UsersRound,
    roles: [0, 1, 2], // Example roles: 0 - Komite, 1 - Admin, 2 - Nakes
  },
  {
    title: "LIST DATA NAKES",
    url: "/Dashboard/List_Data_Nakes",
    icon: UserRoundSearch,
    roles: [0, 1], // Example roles: 0 - Komite, 1 - Admin
  },
  {
    title: "MANAGE ACCESS NAKES",
    url: "/Dashboard/Manage_Access_Nakes",
    icon: ShieldUser,
    roles: [0], // Example roles: 0 - Komite
  },
  {
    title: "APLIKASI KREDENSIAL",
    url: "/Dashboard/Aplikasi_Kredensial",
    icon: FileSearch,
    roles: [0, 1, 2], // Example roles: 0 - Komite, 1 - Admin, 2 - Nakes
  },
  {
    title: "MANAGE KREDENSIAL",
    url: "/Dashboard/Manage_Kredensial",
    icon: FilePlus2,
    roles: [0], // Example roles: 0 - Komite
  },
  {
    title: "MANAGE SK APLIKASI",
    url: "/Dashboard/Manage_SK_Aplikasi",
    icon: FileBadge,
    roles: [0], // Example roles: 0 - Komite
  },
];

export function AppSidebar({
  user,
  userRole,
  ...props
}: {
  user: { nip: string; nama: string; avatar: string };
  userRole: number;
} & React.ComponentProps<typeof Sidebar>) {
  // const filterNavByRole = (navItems: typeof navConfig) => {
  //   return navItems
  //     .filter((item) => item.roles.includes(userRole))
  //     .map((item) => ({
  //       ...item,
  //       items: item.items
  //         ? item.items.filter((subItem) => subItem.roles.includes(userRole))
  //         : undefined,
  //     }))
  //     .filter((item) => !item.items || item.items.length > 0); // Remove empty parent items
  // };
  const filterNavByRole = (navItems: typeof navConfig) => {
    return navItems
      .filter((item) => item.roles.includes(userRole))
      .map((item) => ({
        title: item.title,
        url: item.url,
        icon: item.icon,
        items: item.items
          ?.filter((subItem) => subItem.roles.includes(userRole))
          .map((subItem) => ({
            title: subItem.title,
            url: subItem.url,
          })),
      }))
      .filter((item) => !item.items || item.items.length > 0);
  };

  const navigationItems = filterNavByRole(navConfig);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup className="flex items-center">
          <Image
            src={"/favicon.ico"}
            alt="RS Elisabeth"
            width={90}
            height={0}
          />
          <SidebarGroupLabel className="mb-16">
            <div className="text-3xl  text-fuchsia-400 mt-12 flex flex-col items-center ">
              <p>KREDENSIAL</p>
            </div>
          </SidebarGroupLabel>
        </SidebarGroup>
        {/* <NavMain items={data.navMain} /> */}
        <NavMain items={navigationItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
