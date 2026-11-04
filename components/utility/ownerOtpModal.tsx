'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CORRECT_OTP = '999999';
const AUTH_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours
const STORAGE_KEY = 'np_owner_otp_auth_time';

export default function OwnerOtpModal() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true until checked on client
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Verify 24-hour authentication state on mount
    try {
      const storedTime = localStorage.getItem(STORAGE_KEY);
      if (storedTime) {
        const timestamp = parseInt(storedTime, 10);
        if (Date.now() - timestamp < AUTH_TTL_MS) {
          setIsAuthenticated(true);
          return;
        }
      }
      setIsAuthenticated(false);
    } catch (e) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric input
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue && value !== '') return;

    const newDigits = [...digits];
    
    // Handle paste of 6 digits
    if (cleanValue.length === 6) {
      const pasted = cleanValue.split('');
      setDigits(pasted);
      validateOtp(cleanValue);
      return;
    }

    newDigits[index] = cleanValue.slice(-1);
    setDigits(newDigits);
    setErrorMsg('');

    // Auto focus next input
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6 && !newDigits.includes('')) {
      validateOtp(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = (enteredOtp: string) => {
    if (enteredOtp === CORRECT_OTP) {
      setIsSuccess(true);
      setErrorMsg('');
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (e) {}

      setTimeout(() => {
        setIsAuthenticated(true);
      }, 600);
    } else {
      setErrorMsg('Incorrect OTP passcode. Please try again.');
      setIsSuccess(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-stone-900 rounded-[2.5rem] p-8 border border-stone-200/80 dark:border-stone-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Glowing Background Accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400 mb-6 shadow-inner">
          {isSuccess ? <ShieldCheck className="w-8 h-8 text-emerald-500 animate-bounce" /> : <Lock className="w-8 h-8 text-red-600" />}
        </div>

        {/* Title */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/50 mb-3">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>24-Hour Owner Verification</span>
        </div>

        <h2 className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100 mb-2">
          Enter App Passcode
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mb-8 leading-relaxed">
          Please enter your 6-digit owner OTP passcode to access NewsPulse. Re-verification required every 24 hours.
        </p>

        {/* 6 Digit Input Boxes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 w-full">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              autoFocus={idx === 0}
              className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-mono font-black rounded-2xl border transition-all outline-none ${
                isSuccess
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600'
                  : errorMsg
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600 animate-shake'
                  : digit
                  ? 'border-red-600 bg-red-50/20 dark:bg-red-950/30 text-stone-900 dark:text-stone-100'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/50 text-stone-900 dark:text-stone-100 focus:border-red-600 focus:bg-white dark:focus:bg-stone-900'
              }`}
            />
          ))}
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 mb-4 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {isSuccess && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Passcode Verified! Access Granted.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => validateOtp(digits.join(''))}
          disabled={digits.includes('') || isSuccess}
          className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-2"
        >
          <span>Unlock NewsPulse</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
