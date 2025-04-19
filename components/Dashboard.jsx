"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import mockData from "@/data/mockData"; // adjust path based on where you place the file

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

  const handleDelete = (id) => {
    const filtered = data.filter((item) => item.id !== id);
    setData(filtered);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      {/* Top Red Box */}
      <div className="w-full max-w-4xl mx-auto rounded-xl bg-red-500 h-20 overflow-hidden shadow-md mb-8">
        <div
          className="w-full h-1/2 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all"
          onClick={handleAddNew}
        >
          <span className="text-white font-semibold">Add New Password</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Your Saved Titles</h1>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="border-b pb-4">
              <h3
                className="text-lg font-semibold text-red-600 cursor-pointer hover:underline"
                onClick={() => handleViewContent(item.id)}
              >
                {item.title}
              </h3>
              <p className="text-gray-500">Click to view content</p>

              {selectedId === item.id && (
                <div className="mt-2 space-y-2">
                  <p className="whitespace-pre-line text-gray-700">
                    {item.content}
                  </p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
