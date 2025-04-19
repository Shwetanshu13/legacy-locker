"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        console.log(user.id);
        while (!isLoaded)
          await new Promise((resolve) => setTimeout(resolve, 100));
        const res = await axios.post("/api/get/vaults", {
          clerkUserId: user.id,
        });
        console.log(res);
        const data = await res.data;
        setData(data.vaults);
      } catch (err) {
        console.error("Error fetching vaults:", err);
      }
    };

    fetchVaults();
  }, []);

  const handleViewContent = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleAddNew = () => {
    router.push("/add-new-legacy/password");
  };

  const handleEdit = (id) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id) => {
    const filtered = data.filter((item) => item.id !== id);
    setData(filtered);
    // optionally, call DELETE API here
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Decorations */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <button
            onClick={handleAddNew}
            className="w-full bg-[#111827] border border-gray-800 rounded-xl py-5 text-white font-semibold hover:bg-gray-800 transition-all shadow-md"
          >
            Add New Password
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-[#111827] border border-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Saved Titles</h1>

            <div className="space-y-6">
              {data.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No passwords saved yet
                </p>
              ) : (
                data.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={index + 2}
                    className="border-b border-gray-700 pb-6"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleViewContent(item.id)}
                    >
                      <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="ml-2 text-gray-400 text-sm">
                        {selectedId === item.id ? "▼" : "▶"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Click to view content
                    </p>

                    {selectedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="bg-[#0c1119] rounded-lg p-4 mb-4">
                          <p className="whitespace-pre-line text-gray-300">
                            {item.content}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="border border-white text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="py-6 text-center text-gray-500 border-t border-gray-800 mt-12">
        &copy; {new Date().getFullYear()} Legacy Locker. All rights reserved.
      </footer>
    </div>
  );
}
