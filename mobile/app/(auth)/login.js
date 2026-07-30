import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuthLogic } from '../../hooks/useAuthLogic';

export default function LoginScreen() {
    const {
        email, setEmail,
        password, setPassword,
        otp, setOtp,
        masterPassword, setMasterPassword,
        step, error, loading,
        handleAuth,
        handleLoginFallbackInit,
        handleLoginFallbackVerify,
        handleMasterPassword
    } = useAuthLogic();

    return (
        <View className="flex-1 bg-slate-50 justify-center p-6">
            <View className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md self-center border border-gray-100">
                <Text className="text-2xl font-bold text-slate-800 text-center mb-6">
                    {step === 4 ? "Master Password" : "Login to Legacy Locker"}
                </Text>
                
                {error ? (
                    <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                        <Text className="text-red-600 text-sm">{error}</Text>
                    </View>
                ) : null}

                {/* Step 1: Email */}
                {step === 1 && (
                    <View>
                        <Text className="text-slate-600 mb-2 font-medium">Email Address</Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TouchableOpacity 
                            onPress={() => handleAuth()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Continue with Passkey</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 1.5: Fallback Password */}
                {step === 1.5 && (
                    <View>
                        <Text className="text-slate-600 mb-2 font-medium">Account Password</Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            onPress={() => handleLoginFallbackInit()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Send 2FA Code</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 1.6: Fallback OTP */}
                {step === 1.6 && (
                    <View>
                        <Text className="text-slate-600 mb-2 font-medium">2FA Code</Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 text-center text-2xl tracking-widest focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="000000"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <TouchableOpacity 
                            onPress={() => handleLoginFallbackVerify()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Verify & Login</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 4: Master Password */}
                {step === 4 && (
                    <View>
                        <Text className="text-slate-600 mb-4 font-medium text-center">
                            Enter your master password to unlock your vault keys. This password is never sent to our servers.
                        </Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="Master Password"
                            value={masterPassword}
                            onChangeText={setMasterPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            onPress={() => handleMasterPassword()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Unlock Vaults</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {(step === 1 || step === 1.5) && (
                    <View className="mt-6 flex-row justify-center">
                        <Text className="text-slate-500">Don't have an account? </Text>
                        <Link href="/signup">
                            <Text className="text-teal-600 font-bold">Sign up</Text>
                        </Link>
                    </View>
                )}
            </View>
        </View>
    );
}
