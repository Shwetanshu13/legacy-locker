import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useAuthLogic } from '../../hooks/useAuthLogic';

export default function SignupScreen() {
    const {
        email, setEmail,
        password, setPassword,
        otp, setOtp,
        masterPassword, setMasterPassword,
        setIsLoginMode,
        step, error, loading,
        handleAuth,
        handleVerifyOtp,
        handleBiometricAuth,
        handleMasterPassword
    } = useAuthLogic();

    useEffect(() => {
        setIsLoginMode(false);
    }, []);

    return (
        <View className="flex-1 bg-slate-50 justify-center p-6">
            <View className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md self-center border border-gray-100">
                <Text className="text-2xl font-bold text-slate-800 text-center mb-6">
                    {step === 4 ? "Master Password" : "Create Account"}
                </Text>
                
                {error ? (
                    <View className="bg-red-50 p-3 rounded-lg mb-4 border border-red-200">
                        <Text className="text-red-600 text-sm">{error}</Text>
                    </View>
                ) : null}

                {/* Step 1: Registration Form */}
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
                        <Text className="text-slate-600 mb-2 font-medium">Account Password</Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="At least 8 characters"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            onPress={() => handleAuth()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Send Verification Code</Text>}
                        </TouchableOpacity>
                        
                        <View className="mt-6 flex-row justify-center">
                            <Text className="text-slate-500">Already have an account? </Text>
                            <Link href="/login">
                                <Text className="text-teal-600 font-bold">Log in</Text>
                            </Link>
                        </View>
                    </View>
                )}

                {/* Step 2: Email OTP */}
                {step === 2 && (
                    <View>
                        <Text className="text-slate-600 mb-4 font-medium text-center">
                            We've sent a 6-digit code to {email}.
                        </Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 text-center text-2xl tracking-widest focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="000000"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}
                        />
                        <TouchableOpacity 
                            onPress={() => handleVerifyOtp()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Verify Email</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 3: Biometric Passkey */}
                {step === 3 && (
                    <View>
                        <View className="items-center mb-6">
                            <View className="w-16 h-16 bg-teal-100 rounded-full items-center justify-center mb-4">
                                <Text className="text-3xl">🛡️</Text>
                            </View>
                            <Text className="text-lg font-bold text-slate-800 text-center mb-2">
                                Register Biometric Passkey
                            </Text>
                            <Text className="text-slate-600 text-center">
                                To ensure maximum security, a biometric passkey (Face ID/Touch ID) is required to access your vaults.
                            </Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => handleBiometricAuth()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-teal-400' : 'bg-teal-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Register Passkey</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* Step 4: Master Password Setup */}
                {step === 4 && (
                    <View>
                        <Text className="text-slate-600 mb-4 font-medium text-center">
                            Set up your Master Password. This is used to encrypt your vaults and is never sent to our servers. If you lose this, your data is lost forever.
                        </Text>
                        <TextInput
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-slate-800 focus:border-teal-500 focus:bg-white transition-colors"
                            placeholder="Create Master Password"
                            value={masterPassword}
                            onChangeText={setMasterPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity 
                            onPress={() => handleMasterPassword()}
                            disabled={loading}
                            className={`w-full p-4 rounded-lg items-center ${loading ? 'bg-emerald-400' : 'bg-emerald-600'}`}
                        >
                            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Complete Setup</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}
