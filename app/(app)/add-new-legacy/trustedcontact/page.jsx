import TrustedContact from "@/components/add-new-legacy/TrustedContact";
import { useAuth } from "@clerk/nextjs";

function page() {
  const { user, isLoaded } = useAuth();
  const userId = user?.id;

  if (!isLoaded) return null;

  return (
    <div>
      <TrustedContact userId={userId} />
    </div>
  );
}

export default page;
