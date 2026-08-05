import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ id, name, value, onChange, placeholder, required = false, className = '' }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                required={required}
                value={value}
                onChange={onChange}
                className={`pr-10 ${className}`}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-500 cursor-pointer"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
}
