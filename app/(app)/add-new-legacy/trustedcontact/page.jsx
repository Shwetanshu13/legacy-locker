"use client";
import TrustedContact from "@/components/add-new-legacy/TrustedContact";
import { useUser } from "@clerk/nextjs";

function page() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  if (!isLoaded) return null;

  return (
    <div>
      <TrustedContact userId={userId} />
    </div>
  );
}

export default page;
