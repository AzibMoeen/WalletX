"use client"

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!accessToken) {
      
      router.push("/login");
    } else {
      console.log("Access Token:", accessToken);
      console.log("User:", JSON.parse(user));
    }
  }
  , []);
  const usser = JSON.parse(localStorage.getItem("user"))
  const accessToken = localStorage.getItem("accessToken");
  console.log("Access Token:", accessToken);
  console.log("User:", JSON.parse(localStorage.getItem("user")));
  console.log("User Full Name:", usser);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mb-4"
      />
      <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
      <p className="text-lg text-gray-700 mb-4">Hello {usser.email}</p>
      <p className="text-lg text-gray-700 mb-4">This is a simple Next.js app.</p>
    </div>
  );
}
