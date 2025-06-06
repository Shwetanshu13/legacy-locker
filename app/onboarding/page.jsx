"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const waitForToken = async (getTokenFn, maxRetries = 5) => {
    let retries = maxRetries;
    let token = null;

    while (!token && retries > 0) {
      token = await getTokenFn();
      if (!token) {
        await new Promise((res) => setTimeout(res, 300));
        retries--;
      }
    }

    return token;
  };

  // Save onboarding details
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !fullName) return;

    setLoading(true);
    try {
      console.log(user.id, user.primaryEmailAddress.emailAddress, fullName);
      const res = await axios.post("/api/newUser", {
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName,
      });
      console.log(res);
      // await getToken(); // this will refresh session under the hood
      const token = await waitForToken(getToken);

      // 3. Redirect or reload
      // window.location.href = "/home";
    } catch (err) {
      console.error("Failed onboarding:", err);
    } finally {
      setLoading(false);
      router.replace("/home");
      router.replace("/home");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-black shadow-md rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      <p className="text-sm mb-6">
        Finish setting up your profile to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="text"
            disabled
            value={user?.primaryEmailAddress?.emailAddress}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Complete Onboarding"}
        </button>
      </form>
    </div>
  );
}
