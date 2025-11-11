"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { POST_LOGIN } from "@/connection/api";
import { GET_access_bynip } from "@/connection/access";

import { SetLoginCookie } from "@/function/cookie/loginData";
import { SetAccessCookie } from "@/function/cookie/access";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Get redirect parameter from URL or default to Dashboard
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("redirect") || "/Dashboard";

    const loginPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const loginData = await POST_LOGIN(username, password);

        if (loginData.Code === 200) {
          const userData = loginData.Data;
          const position = await getPosision(userData.nip);

          if (position) {
            await SetAccessCookie(position);
          }
          await SetLoginCookie(userData);

          resolve(loginData.Message);

          // Redirect after successful login
          router.push(redirectTo);
        } else {
          setPassword("");
          reject(loginData.Message);
        }
      } catch (error) {
        console.error("Error:", error);
        reject("Terjadi kesalahan saat login");
      } finally {
        setLoading(false);
      }
    });

    toast.promise(loginPromise, {
      loading: "Sedang memproses login...",
      success: (message: string) => `${message}`,
      error: (message: string) => `${message}`,
    });
  };

  const getPosision = async (nip: string) => {
    try {
      return await GET_access_bynip(nip);
    } catch (error) {
      console.error("Error fetching position:", error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/bg_login-singup.png')",
        backgroundSize: "cover",
        backgroundPosition: "58% 100%",
        backgroundRepeat: "no-repeat",
      }}
      className={`h-screen w-screen flex flex-col  ${
        loading ? "cursor-wait" : ""
      }`}
    >
      <div className="flex flex-wrap justify-center md:mt-10 mt-5">
        <div className="md:w-4/12 m-6">
          <Image
            src="/images/logo-long.png"
            alt="logo"
            width={900}
            height={0}
          />
        </div>
        <div className="md:w-6/12"></div>
        <div className="ml-4">
          <p className="md:mt-9 md:text-4xl text-2xl font-bold">
            SELAMAT DATANG
          </p>
          <p className="md:text-2xl font-bold text-orange-400">
            Sistem Informasi <span className="italic">CREDENTIAL PERAWAT</span>{" "}
            <br />
            RS. Elisabeth Semarang
          </p>
          <p className="mt-10 md:text-xl  font-bold italic text-slate-500">
            &quot;Pancaran Cintanya
            <br />
            Menyembuhkan Derita Sesama&quot;
          </p>
        </div>
        <div className="md:ml-56 md:mt-0 mt-10">
          <div className="border-2 border-white w-[600px] rounded-2xl shadow-xl/30 flex flex-col justify-center py-10 bg-yellow-100/20">
            <form onSubmit={handleSubmit}>
              <h1 className="text-5xl font-light text-stone-600  text-center mb-5 ">
                CREDENTIAL PERAWAT
              </h1>
              <p className="ml-4 font-bold">Masukkan Nomor Induk Pegawai</p>
              <div className="px-4 mb-4">
                <Input
                  placeholder="NIP"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  className="border-2 border-gray-500 p-3"
                />
              </div>
              <p className="ml-4 font-bold">Masukkan Password</p>
              <div className="px-4 mb-4">
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-gray-500 p-3"
                />
                <Button className="w-full mt-10 bg-blue-500" type="submit">
                  Masuk
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
