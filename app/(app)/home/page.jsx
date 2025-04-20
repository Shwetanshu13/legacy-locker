import Dashboard from "@/components/Dashboard";
import { useUser } from "@clerk/nextjs";

function Home() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded) {
      axios.post("/api/vault/update-activity", {
        clerkUserId: user.id,
      });
    }
  }, [isLoaded]);

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Home;
