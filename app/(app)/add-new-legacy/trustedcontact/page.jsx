"use client";
import TrustedContact from "@/components/add-new-legacy/TrustedContact";
import TrustedContacts from "@/components/TrustedContacts";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

function Page() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  if (!isLoaded) return null;
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 pt-8">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl mx-auto"
      >
        <TrustedContacts clerkUserId={user.id} />
        <TrustedContact onSubmit={TrustedContact} />
      </motion.div>
    </div>
  );
}

export default Page;
