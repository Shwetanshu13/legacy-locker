"use client";

import { useAuthLogic } from "@/hooks/useAuthLogic";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            router.push('/home');
        }
    }, [user, authLoading, router]);

    const {
        email, setEmail,
        password, setPassword,
        otp, setOtp,
        masterPassword, setMasterPassword,
        isLoginMode, setIsLoginMode,
        step, resetStep,
        error, setError, loading,
        tempUser,
        handleAuth,
        handleVerifyOtp,
        handleBiometricAuth,
        handleLoginFallbackInit,
        handleLoginFallbackVerify,
        handleMasterPassword
    } = useAuthLogic();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? (isLoginMode ? "Sign in to your account" : "Create a new account") 
                        : step === 1.5 ? "Verify Account Password"
                        : (step === 2 || step === 1.6) ? "Verify Email" 
                        : step === 3 ? "Setup Passkey" 
                        : "Master Password"}
                    </h2>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleAuth}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${(!isLoginMode) ? "rounded-t-md rounded-none" : "rounded-md"}`}
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {!isLoginMode && (
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Account Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : (isLoginMode ? "Continue" : "Sign Up with Password")}
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsLoginMode(!isLoginMode);
                                    setError("");
                                }}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </form>
                ) : step === 1.5 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleLoginFallbackInit}>
                        <div className="text-sm text-gray-600 text-center mb-4">
                            Biometric authentication failed. Please enter your account password to proceed.
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="fallback-password" className="sr-only">Password</label>
                                <input
                                    id="fallback-password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Account Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Verify Password"}
                            </button>
                        </div>
                    </form>
                ) : step === 1.6 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleLoginFallbackVerify}>
                        <div className="text-sm text-gray-600 text-center mb-4">
                            Please enter the 6-digit login verification code sent to {email}.
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="login-otp" className="sr-only">Verification Code</label>
                                <input
                                    id="login-otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest text-lg"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify Login Code"}
                            </button>
                        </div>
                    </form>
                ) : step === 2 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div className="text-sm text-gray-600 text-center mb-4">
                            Please enter the 6-digit verification code sent to {email}.
                        </div>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="otp" className="sr-only">Verification Code</label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center tracking-widest text-lg"
                                    placeholder="••••••"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>
                        </div>
                    </form>
                ) : step === 3 ? (
                    <div className="mt-8 space-y-6">
                        <div className="text-sm text-gray-600 text-center mb-4">
                            Secure your account by registering a compulsory biometric passkey (TouchID, FaceID, or Windows Hello).
                        </div>
                        <div>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleBiometricAuth}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Register Biometrics"}
                            </button>
                        </div>
                    </div>
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
