"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Phone, Shield, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { phoneLoginSchema, PhoneLoginFormData } from "@/schemas/auth/login";
import Image from "next/image";

interface LoginFormProps extends React.ComponentProps<"div"> {
  className?: string;
}

const OTP_RESEND_COOLDOWN = 60; // 60 seconds

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const { sendOTP, verifyOTP, isLoading, error, clearError } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<PhoneLoginFormData>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  const phoneValue = watch("phone");
  const otpValue = watch("otp");
  const errorShownTimeRef = useRef<number>(0);
  const prevPhoneRef = useRef<string>("");
  const prevOtpRef = useRef<string>("");

  // Cleanup countdown interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [countdown]);

  // Clear error when user types
  useEffect(() => {
    if (error) {
      errorShownTimeRef.current = Date.now();
      prevPhoneRef.current = phoneValue || "";
      prevOtpRef.current = otpValue || "";
    }
  }, [error, phoneValue, otpValue]);

  useEffect(() => {
    if (!error) {
      prevPhoneRef.current = phoneValue || "";
      prevOtpRef.current = otpValue || "";
      return;
    }

    const timeSinceError = Date.now() - errorShownTimeRef.current;
    if (timeSinceError < 3000) return;

    const phoneChanged = (phoneValue || "") !== prevPhoneRef.current;
    const otpChanged = (otpValue || "") !== prevOtpRef.current;

    if (phoneChanged || otpChanged) {
      clearError();
    }
  }, [phoneValue, otpValue, error, clearError]);

  const handleSendOTP = async () => {
    if (!phoneValue || errors.phone) {
      return;
    }

    setIsSendingOTP(true);
    clearError();

    try {
      await sendOTP(phoneValue);
      setOtpSent(true);
      setCountdown(OTP_RESEND_COOLDOWN);
      setValue("otp", "");
    } catch {
      // Error is handled by auth context
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
  };

  const onSubmit = async (data: PhoneLoginFormData) => {
    if (!otpSent) {
      await handleSendOTP();
      return;
    }

    try {
      clearError();
      await verifyOTP(data.phone, data.otp);
    } catch {
      reset({
        phone: data.phone,
        otp: "",
      }, {
        keepErrors: false,
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <Image src="/allneeda.png" alt="Allneeda Logo" width={100} height={100} />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Allneeda
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to access your professional dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <div
              className={cn(
                "bg-red-50 dark:bg-red-900/20",
                "text-red-600 dark:text-red-400 text-sm p-4 rounded-lg mb-6",
                "border border-red-200 dark:border-red-800",
                "flex items-center gap-3"
              )}
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              {/* Phone Number Input */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading || isSendingOTP || otpSent}
                    className={cn(
                      "pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700",
                      "focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]",
                      errors.phone && "border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Send OTP Button (shown when OTP not sent or can resend) */}
              {!otpSent && (
                <Button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading || isSendingOTP || !phoneValue || !!errors.phone}
                  className={cn(
                    "w-full h-12 rounded-lg font-semibold",
                    "bg-[#0077B6] hover:bg-[#03669b]",
                    "text-white shadow-md hover:shadow-lg transition-all duration-200",
                    "transform hover:-translate-y-0.5",
                    (isLoading || isSendingOTP) && "opacity-90 cursor-not-allowed"
                  )}
                >
                  {isSendingOTP ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      Send OTP
                    </span>
                  )}
                </Button>
              )}

              {/* OTP Input (shown after OTP is sent) */}
              {otpSent && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp" className="text-gray-700 dark:text-gray-300 font-medium">
                        Enter OTP
                      </Label>
                      {countdown > 0 ? (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Resend OTP in {countdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          disabled={isSendingOTP || isLoading}
                          className="text-sm font-medium text-[#0077B6] dark:text-blue-400 hover:underline disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        {...register("otp")}
                        placeholder="123456"
                        disabled={isLoading}
                        className={cn(
                          "pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700",
                          "focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6]",
                          "text-center text-2xl tracking-widest font-mono",
                          errors.otp && "border-red-500 focus:ring-red-500"
                        )}
                        onChange={(e) => {
                          // Only allow numeric input
                          const value = e.target.value.replace(/\D/g, "");
                          setValue("otp", value.slice(0, 6), { shouldValidate: true });
                        }}
                      />
                    </div>
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.otp.message}
                      </p>
                    )}
                  </div>

                  {/* Verify OTP Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !otpValue || otpValue.length !== 6}
                    className={cn(
                      "w-full h-12 rounded-lg font-semibold",
                      "bg-[#0077B6] hover:bg-[#03669b]",
                      "text-white shadow-md hover:shadow-lg transition-all duration-200",
                      "transform hover:-translate-y-0.5",
                      isLoading && "opacity-90 cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Verify OTP
                      </span>
                    )}
                  </Button>

                  {/* Change Phone Number Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOtpSent(false);
                      setCountdown(0);
                      setValue("otp", "");
                      clearError();
                    }}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Change Phone Number
                  </Button>
                </>
              )}
            </div>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#0077B6] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Create Professional Account
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-center text-gray-500 dark:text-gray-400">
        <p>
          By signing in, you agree to our{" "}
          <Link href="#" className="font-medium hover:text-[#0077B6] dark:hover:text-blue-400 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-medium hover:text-[#0077B6] dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
