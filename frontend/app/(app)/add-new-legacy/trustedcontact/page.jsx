"use client";
import TrustedContact from "@/components/add-new-legacy/TrustedContact";
import TrustedContacts from "@/components/TrustedContacts";
import { useAuth } from "@/components/AuthProvider";
import { motion } from "framer-motion";

function Page() {
  const { user } = useAuth();
  const userId = user?.id;

  if (!user) return null;
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="bg-bg text-ink min-h-screen p-4 pt-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <TrustedContacts clerkUserId={user.id} />
        <div className="w-full">
            <TrustedContact onSubmit={TrustedContact} />
        </div>
      </motion.div>
    </div>
  );
}

export default Page;
