"use client";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/components/AuthProvider";
import api from "@/utils/api";
import { useEffect } from "react";

function Home() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      api.post("/vault/update-activity", {
        userId: user.id,
      }).catch(err => console.log("Activity update failed:", err));
    }
  }, [user?.id]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Home;
