"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

function TriggerForm({ onSubmit }) {
  const [type, setType] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [inactivityDays, setInactivityDays] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, scheduledAt, inactivityDays });
  };

  const handleReset = () => {
    setType("");
    setScheduledAt("");
    setInactivityDays("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <label className="block text-gray-400 mb-2 text-sm">Trigger Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="">Select Type</option>
          <option value="inactivity">Inactivity</option>
          <option value="scheduled">Scheduled</option>
          <option value="manual">Manual</option>
        </select>
      </motion.div>

      {type === "scheduled" && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <label className="block text-gray-400 mb-2 text-sm">
            Scheduled Date
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </motion.div>
      )}

      {type === "inactivity" && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <label className="block text-gray-400 mb-2 text-sm">
            Days of Inactivity
          </label>
          <input
            type="number"
            value={inactivityDays}
            onChange={(e) => setInactivityDays(e.target.value)}
            required
            min="1"
            placeholder="Number of days"
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </motion.div>
      )}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="flex flex-col sm:flex-row gap-4 mt-4"
      >
        <button
          type="submit"
          className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition flex-1"
        >
          Create Trigger
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition flex-1"
        >
          Reset Form
        </button>
      </motion.div>
    </form>
  );
}

export default function Trigger({ vaultId }) {
  const handleFormSubmit = async (data) => {
    if (!vaultId) return;

    try {
      const response = await axios.post("/api/add/add-trigger", {
        vaultId,
        ...data,
      });

      console.log("Trigger created successfully", response.data);
    } catch (error) {
      console.error("Error creating trigger:", error);
    }
  };

  return (
    <div className="relative bg-black text-white overflow-x-hidden min-h-screen flex items-center justify-center p-4">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden shadow-lg border border-gray-700"
      >
        {/* Left Section */}
        <div className="col-span-1 flex flex-col items-center justify-center p-12 bg-gray-900/80 backdrop-blur-md">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-3xl font-bold text-center mb-4"
          >
            Create a Trigger for <br /> Your Legacy
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-gray-400 text-center"
          >
            Set conditions to release your digital assets
          </motion.p>
        </div>

        {/* Right Section */}
        <div className="col-span-2 p-8 md:p-12 bg-gray-900/50 backdrop-blur-md">
          <TriggerForm onSubmit={handleFormSubmit} />
        </div>
      </motion.div>
    </div>
  );
}
