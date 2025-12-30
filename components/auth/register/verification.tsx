// components/auth/OTPVerification.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ShieldCheck, RefreshCw, Phone, Key, Lock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface OTPVerificationProps {
  phoneNo: string;
  /* eslint-disable */
  onVerify: (otp: string) => Promise<void>;
  /* eslint-enable */
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  isResending?: boolean;
}

export default function OTPVerification({
  phoneNo,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  isResending = false
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [timer, setTimer] = useState<number>(30);
  const [verifying, setVerifying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  // Handle timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    // Auto focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setHasError(false);

    // Auto-focus next input
    if (value && index < 3) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit) && newOtp.length === 4) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setHasError(false);
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 10);
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        setHasError(false);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && otp.join('').length === 4) {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 4).split('');

    const newOtp = [...otp];
    numbers.forEach((num, index) => {
      if (index < 4) {
        newOtp[index] = num;
      }
    });

    setOtp(newOtp);
    setHasError(false);

    // Focus the next empty input after paste
    const lastFilledIndex = numbers.length - 1;
    if (lastFilledIndex < 3) {
      setTimeout(() => {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      }, 10);
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmit = async (otpValue?: string) => {
    const otpString = otpValue || otp.join('');

    if (otpString.length !== 4) {
      toast.error('Please enter all 4 digits');
      setHasError(true);
      return;
    }

    setVerifying(true);
    try {
      await onVerify(otpString);
    } catch {
      // Error animation
      setHasError(true);
      inputRefs.current.forEach(ref => {
        if (ref) {
          ref.classList.add('animate-shake');
          setTimeout(() => ref.classList.remove('animate-shake'), 500);
        }
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      await onResend();
      setTimer(30);
      setOtp(Array(4).fill(''));
      setHasError(false);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 10);
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  const clearOTP = () => {
    setOtp(Array(4).fill(''));
    setHasError(false);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 10);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={isLoading || verifying}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0077B6]" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Secure</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-[#0077B6]" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Phone Verification
              </h2>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enter the 4-digit code sent to your phone
            </p>
          </div>

          {/* Phone Display */}
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-sm">
            <Phone className="w-4 h-4 text-[#0077B6]" />
            <div className="text-left">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Verification code sent to</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{formatPhoneNumber(phoneNo)}</p>
            </div>
          </div>
        </div>

        {/* OTP Input - Now 4 digits */}
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
              4-digit verification code
            </label>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-10 h-10 text-center text-lg font-semibold border rounded-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none transition-colors ${hasError
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-700'
                      }`}
                    disabled={isLoading || verifying}
                    autoFocus={index === 0}
                  />
                  {index < 3 && (
                    <div className="absolute  top-1/2 transform -translate-y-1/2 w-1 h-2 bg-gray-300 dark:bg-gray-600"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Clear button */}
            {otp.some(digit => digit) && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={clearOTP}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center gap-1"
                  disabled={isLoading || verifying}
                >
                  Clear
                  <XCircle className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Timer & Resend */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className={`w-6 h-6 rounded-sm flex items-center justify-center ${timer > 0
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'bg-blue-50 dark:bg-blue-900/20'
                }`}>
                {timer > 0 ? (
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{timer}</span>
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#0077B6]" />
                )}
              </div>
              <div>
                {timer > 0 ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Resend in <span className="font-semibold">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0077B6] dark:text-blue-400 hover:text-[#005a8c] dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Resend code
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit()}
              disabled={isLoading || verifying || otp.join('').length !== 4}
              className="w-full bg-[#0077B6] hover:bg-[#016194] text-white text-sm font-medium rounded-sm transition-colors py-2.5"
            >
              {verifying ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" />
                  Verify & Continue
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading || verifying}
              className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm text-sm py-2.5"
            >
              Back to registration
            </Button>
          </div>
        </div>

        {/* Security Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">Security:</span> Code expires in 10 minutes. Never share your verification code.
              </p>
            </div>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Did not receive code? Check your SMS or{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="text-[#0077B6] dark:text-blue-400 hover:underline disabled:text-gray-400"
            >
              resend
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}