"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/Breadcrump";
import { useEffect, useState } from "react";

import { GetLoginCookie } from "@/function/cookie/loginData";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<{
    nip: string;
    nama: string;
    roles: string;
  }>({
    nip: "",
    nama: "",
    roles: "",
  });
  const [profilePicture, setProfilePicture] = useState<string>("");

  useEffect(() => {
    getData();
    pictureData();
  }, []);

  const getData = async () => {
    setUserData(await GetLoginCookie());
  };
  const pictureData = () => {
    const picture = localStorage.getItem("pictureUser");
    setProfilePicture(`data:image/jpeg;base64,${picture}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster position="top-center" />
      <SidebarProvider>
        {userData?.roles && (
          <AppSidebar
            user={{
              nip: userData?.nip,
              nama: userData?.nama,
              avatar: profilePicture,
            }}
            userRole={Number(userData?.roles)}
          />
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white shadow-sm">
            <AppBreadcrumb />
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide bg-gray-50">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
