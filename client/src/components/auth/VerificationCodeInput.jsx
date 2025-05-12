"use client";

import { useState } from "react";

const VerificationCodeInput = ({
  onChange,
  value = ["", "", "", ""],
  error,
}) => {
  const inputRefs = Array(4)
    .fill(0)
    .map(() => useState(null)[0]);

  const handleChange = (index, e) => {
    const newValue = [...value];
    newValue[index] = e.target.value;
    onChange(newValue);

    // Auto-focus next input after entry
    if (e.target.value && index < 3) {
      inputRefs[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate back on backspace if current field is empty
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // If we have exactly 4 digits, fill all inputs
    if (/^\d{4}$/.test(pastedData)) {
      const newValue = pastedData.split("");
      onChange(newValue);
      inputRefs[3].focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        {value.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => (inputRefs[index] = el)}
            className={`w-14 h-14 text-center text-xl font-semibold border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        ))}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default VerificationCodeInput;
