"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import mockData from "@/data/mockData";

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
  const [data, setData] = useState(mockData);
  const [selectedId, setSelectedId] = useState(null);

  const handleViewContent = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleAddNew = () => {
    router.push("/add-new-legacy/password");
  };

  const handleEdit = (id) => {
    router.push(`/edit?id=${id}`);
  };

  return (
    <div className="relative bg-black text-white overflow-x-hidden min-h-screen">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

      {/* Top Action Box */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto pt-12 px-6"
      >
        <div
          className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden shadow-lg mb-8 transform-gpu transition-transform duration-300 hover:scale-[1.02]"
          onClick={handleAddNew}
        >
          <div className="w-full py-6 flex items-center justify-center cursor-pointer">
            <span className="text-white font-semibold text-lg">
              Add New Password
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="w-full max-w-4xl mx-auto px-6 pb-12"
      >
        <div className="bg-gray-900/80 p-8 rounded-xl border border-gray-700 shadow-lg backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-6">Your Saved Titles</h1>
          <div className="space-y-6">
            {data.length === 0 ? (
              <p className="text-gray-400 text-center py-6">
                No items yet. Add your first password.
              </p>
            ) : (
              data.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={index + 3}
                  className="border-b border-gray-700 pb-6"
                >
                  <h3
                    className="text-xl font-semibold text-purple-400 cursor-pointer hover:text-purple-300 transition-colors flex items-center"
                    onClick={() => handleViewContent(item.id)}
                  >
                    {item.title}
                    <span className="ml-2 text-gray-400 text-sm">
                      {selectedId === item.id ? "▼" : "▶"}
                    </span>
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Click to view content
                  </p>

                  {selectedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4"
                    >
                      <p className="whitespace-pre-line text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                        {item.content}
                      </p>
                      <div className="flex gap-4 mt-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="border border-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition"
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

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 border-t border-gray-800">
        &copy; {new Date().getFullYear()} Legacy Locker. All rights reserved.
      </footer>
    </div>
  );
}
