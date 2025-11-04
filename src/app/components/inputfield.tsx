"use client";

import React, { useState } from "react";

interface InputFieldProps {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    defaultText?: string;
}

export default function InputField({
    label,
    type = "text",
    placeholder,
    defaultText = "", // デフォルト値
}: InputFieldProps) {
    const [value, setValue] = useState(defaultText);

    return (
        <div className="w-67 flex flex-col">
            {label && (
                <label className="mb-2 text-gray-700 font-medium text-sm">
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                defaultValue={value}
                className="w-full px-4 py-2 border border-gray-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            />
        </div>
    );
}
