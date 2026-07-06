"use client";

import { useAuthLogic } from "@/hooks/useAuthLogic";

export default function Login() {
    const {
        email, setEmail,
        otp, setOtp,
        masterPassword, setMasterPassword,
        step, resetStep,
        error, loading,
        tempUser,
        handleSendOtp,
        handleVerifyOtp,
        handleMasterPassword
    } = useAuthLogic();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? "Sign in to your account" : step === 2 ? "Enter Verification Code" : "Master Password"}
                    </h2>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>
                        </div>
                    </form>
                ) : step === 2 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="otp" className="sr-only">Verification Code</label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <button 
                                type="button" 
                                onClick={() => resetStep(1)}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Use a different email
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleMasterPassword}>
                        <div className="text-sm text-gray-600 text-center mb-4">
                            {!tempUser?.publicKey ? (
                                "Welcome! Please create a Master Password to encrypt your vaults. Do not forget this password, or you will lose access forever."
                            ) : (
                                "Please enter your Master Password to unlock your encryption keys."
                            )}
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="master-password" className="sr-only">Master Password</label>
                                <input
                                    id="master-password"
                                    name="masterPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Master Password"
                                    value={masterPassword}
                                    onChange={(e) => setMasterPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : (!tempUser?.publicKey ? "Create Master Password" : "Unlock & Sign In")}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
