"use client";
import Dashboard from "@/components/Dashboard";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";

function Home() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.id) {
      axios.post("/api/vault/update-activity", {
        userId: user.id,
      });
    }
  }, [isLoaded, user?.id]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Home;
