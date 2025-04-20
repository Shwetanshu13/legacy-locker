// "use client";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { encrypt, decrypt } from "@/utils/encrypt";

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i = 1) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.2 },
//   }),
// };

// export default function Password() {
//   const [formData, setFormData] = useState({
//     email: "",
//     title: "",
//     content: "",
//     visibility: "private",
//   });

//   function handleFormSubmit(event) {
//     event.preventDefault();
//     const encryptedContent = encrypt(formData.content);
//     const decryptedContent = decrypt(encryptedContent);

//     console.log("Encrypted:", encryptedContent);
//     console.log("Decrypted:", decryptedContent);
//     console.log("Form Submitted:", formData);
//   }

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   }

//   return (
//     <div className="relative bg-black text-white overflow-x-hidden min-h-screen flex items-center justify-center p-4">
//       {/* Decorative background shapes */}
//       <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -z-10" />
//       <div className="absolute bottom-[-200px] right-[-100px] w-[400px] h-[400px] bg-blue-500 rounded-full opacity-10 blur-2xl -z-10" />

//       <motion.div
//         variants={fadeUp}
//         initial="hidden"
//         animate="visible"
//         className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 rounded-xl overflow-hidden shadow-lg border border-gray-700"
//       >
//         {/* Left Section */}
//         <div className="col-span-1 flex flex-col items-center justify-center p-12 bg-gray-900/80 backdrop-blur-md">
//           <motion.h2
//             variants={fadeUp}
//             initial="hidden"
//             animate="visible"
//             className="text-3xl font-bold text-center mb-4"
//           >
//             Add a Password to <br /> Your Legacy
//           </motion.h2>
//           <motion.p
//             variants={fadeUp}
//             initial="hidden"
//             animate="visible"
//             custom={2}
//             className="text-gray-400 text-center"
//           >
//             Secure your digital assets for the future
//           </motion.p>
//         </div>

//         {/* Right Section */}
//         <div className="col-span-2 p-8 md:p-12 bg-gray-900/50 backdrop-blur-md">
//           <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
//             <motion.div
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               custom={1}
//             >
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 required
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//               />
//             </motion.div>

//             <motion.div
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               custom={2}
//             >
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Title here..."
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//               />
//             </motion.div>

//             <motion.div
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               custom={3}
//             >
//               <textarea
//                 name="content"
//                 placeholder="Add your password details here..."
//                 required
//                 rows={5}
//                 value={formData.content}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//               />
//             </motion.div>

//             {/* Dropdown for visibility */}
//             <motion.div
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               custom={4}
//             >
//               <select
//                 name="visibility"
//                 value={formData.visibility}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
//                 style={{
//                   backgroundImage:
//                     "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
//                   backgroundRepeat: "no-repeat",
//                   backgroundPosition: "right 0.75rem center",
//                   backgroundSize: "1rem",
//                 }}
//               >
//                 <option value="private">Private</option>
//                 <option value="public">Public</option>
//                 <option value="trusted">Trusted Only</option>
//               </select>
//             </motion.div>

//             <motion.div
//               variants={fadeUp}
//               initial="hidden"
//               animate="visible"
//               custom={5}
//               className="flex flex-col md:flex-row gap-4 mt-4"
//             >
//               <button
//                 type="submit"
//                 className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition flex-1"
//               >
//                 Save Password
//               </button>
//               <button
//                 type="button"
//                 onClick={() =>
//                   setFormData({
//                     email: "",
//                     title: "",
//                     content: "",
//                     visibility: "private",
//                   })
//                 }
//                 className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition flex-1"
//               >
//                 Reset Form
//               </button>
//             </motion.div>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { encrypt, decrypt } from "@/utils/encrypt";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2 },
  }),
};

export default function Password() {
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    content: "",
    visibility: "private",
  });

  const [suggestions, setSuggestions] = useState([]);

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

    if (name === "content") {
      getSuggestions(value);
    }
  }

  async function getSuggestions(input) {
    if (!input.trim()) return;
    try {
      const res = await fetch("http://localhost:8000/autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log("Received suggestions:", data.suggestions);  // Check the suggestions in the console
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  }
  

  function applySuggestion(suggestion) {
    setFormData((prev) => ({
      ...prev,
      content: prev.content.trim() + " " + suggestion + " ",
    }));
    setSuggestions([]);
  }
  

  return (
    <div className="relative bg-black text-white overflow-x-hidden min-h-screen flex items-center justify-center p-4">
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
            Add a Password to <br /> Your Legacy
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-gray-400 text-center"
          >
            Secure your digital assets for the future
          </motion.p>
        </div>

        {/* Right Section */}
        <div className="col-span-2 p-8 md:p-12 bg-gray-900/50 backdrop-blur-md">
          <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
            {/* Email */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </motion.div>

            {/* Title */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              <input
                type="text"
                name="title"
                placeholder="Title here..."
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </motion.div>

            {/* Content with autocomplete */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <textarea
                name="content"
                placeholder="Add your password details here..."
                required
                rows={5}
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {/* Suggestions list */}
              {suggestions.length > 0 && (
                <ul className="mt-2 bg-gray-800 border border-gray-700 rounded-lg max-h-40 overflow-y-auto text-sm">
                  {suggestions.map((s, index) => (
                    <li
                      key={index}
                      onClick={() => applySuggestion(s)}
                      className="p-2 hover:bg-gray-700 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* Visibility dropdown */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="trusted">Trusted Only</option>
              </select>
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-col md:flex-row gap-4 mt-4"
            >
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-200 transition flex-1"
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    email: "",
                    title: "",
                    content: "",
                    visibility: "private",
                  })
                }
                className="border border-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition flex-1"
              >
                Reset Form
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
