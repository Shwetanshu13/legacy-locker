"use client";
import { useState } from "react";
import { encrypt, decrypt } from "@/utils/encrypt";

export default function Password() {
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    content: "",
    visibility: "private",
  });

  function handleFormSubmit(event) {
    event.preventDefault();
    const encryptedContent = encrypt(formData.content);
    const decryptedContent = decrypt(encryptedContent);

    console.log("Encrypted:", encryptedContent);
    console.log("Decrypted:", decryptedContent);
    console.log("Form Submitted:", formData);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl grid grid-cols-1 md:grid-cols-3">
        {/* Left Section */}
        <div className="col-span-1 flex items-center justify-center p-8 bg-white">
          <h2 className="text-2xl font-bold text-center">
            Add a content to <br /> Pass On Your Legacy
          </h2>
        </div>

        {/* Right Section */}
        <div className="col-span-2 p-8 bg-white">
          <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            />
            <input
              type="text"
              name="title"
              placeholder="Title here.."
              value={formData.title}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            />
            <textarea
              name="content"
              placeholder="Add your content here..."
              required
              value={formData.content}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            />

            {/* Dropdown for visibility */}
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="trusted">Trusted Only</option>
            </select>

            <button
              type="submit"
              className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-all"
            >
              Save it!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
