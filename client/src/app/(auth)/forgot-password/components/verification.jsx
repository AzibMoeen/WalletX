import React, { useState } from 'react';

export const VerificationCodeInput = ({ onChange, value = ['', '', '', '', '', ''], error }) => {
  const inputRefs = Array(6).fill(0).map(() => useState(null)[0]);

  const handleChange = (index, e) => {
    const newValue = [...value];
    newValue[index] = e.target.value.toUpperCase();
    onChange(newValue);

    if (e.target.value && index < 5) {
      inputRefs[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim().toUpperCase();
    
    // If we have exactly 6 characters, fill all inputs
    if (/^[A-Z0-9]{6}$/.test(pastedData)) {
      const newValue = pastedData.split('');
      onChange(newValue);
      inputRefs[5].focus();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between">
        {value.map((char, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            ref={(el) => (inputRefs[index] = el)}
            className={`w-10 h-12 text-center text-lg font-semibold border rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        ))}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};
