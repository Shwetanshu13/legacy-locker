"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-200">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
