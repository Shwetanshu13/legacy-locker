"use client";
import React, { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

function TrustedContactForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Private");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, relationship });
    setName("");
    setEmail("");
    setRelationship("Private");
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setRelationship("Private");
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#13151a] rounded-xl overflow-hidden">
      <div className="p-10 md:w-2/5 flex flex-col justify-center">
        <h2 className="text-white text-2xl font-bold mb-2">
          Add a Trusted Contact to Your Legacy
        </h2>
        <p className="text-gray-400 text-sm">
          Secure your digital assets for the future
        </p>
      </div>

      <div className="p-8 md:w-3/5 bg-[#1a1d24]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-[#22252d] text-white rounded-md focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-4 bg-[#22252d] text-white rounded-md focus:outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full p-4 bg-[#22252d] text-white rounded-md appearance-none focus:outline-none pr-10"
            >
              <option value="Private">Private</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-white text-black font-medium py-3 px-4 rounded-full hover:bg-gray-200 transition-colors"
            >
              Save Contact
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 border border-gray-600 text-white font-medium py-3 px-4 rounded-full hover:bg-[#22252d] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TrustedContact({ userId }) {
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const handleAddContact = async (contact) => {
    try {
      setLoading(true);
      console.log(user);
      const res = await axios.post("/api/add/add-trustedContact", {
        clerkUserId: user.id,
        ...contact,
      });

      console.log("Response:", res.data);
      alert("Trusted Contact added successfully.");
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding trusted contact.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <TrustedContactForm onSubmit={handleAddContact} />
      </div>
    </div>
  );
}
