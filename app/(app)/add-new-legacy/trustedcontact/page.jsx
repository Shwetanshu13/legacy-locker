"use client";
import TrustedContact from "@/components/add-new-legacy/TrustedContact";
import TrustedContacts from "@/components/TrustedContacts";
import { useUser } from "@clerk/nextjs";

function page() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  if (!isLoaded) return null;

  return (
    <div>
      <TrustedContacts clerkUserId={userId} />
      <TrustedContact userId={userId} />
    </div>
  );
}

export default page;
