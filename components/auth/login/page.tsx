"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/auth/login";
interface LoginFormProps extends React.ComponentProps<"div"> {
  className?: string;
}
export default function LoginForm({ className, ...props }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAuth();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const errorShownTimeRef = useRef<number>(0);
  const prevValuesRef = useRef<{ email: string; password: string }>({ email: "", password: "" });
  useEffect(() => {
    if (error) {
      errorShownTimeRef.current = Date.now();
      // Store current values when error appears
      prevValuesRef.current = {
        email: emailValue || "",
        password: passwordValue || "",
      };
    }
  }, [error, emailValue, passwordValue]); 
  useEffect(() => {
    if (!error) {
      // No error, update refs to current values
      prevValuesRef.current = {
        email: emailValue || "",
        password: passwordValue || "",
      };
      return;
    }
    const timeSinceError = Date.now() - errorShownTimeRef.current;
    if (timeSinceError < 3000) {
      return;
    }
    const emailChanged = (emailValue || "") !== prevValuesRef.current.email;
    const passwordChanged = (passwordValue || "") !== prevValuesRef.current.password;
    
    if (emailChanged || passwordChanged) {
      clearError();
    }
  }, [emailValue, passwordValue, error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password);
    } catch {
      reset({ 
        email: data.email, 
        password: "" 
      }, { 
        keepErrors: false 
      });
    }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="rounded-lg bg-white dark:bg-gray-900 border shadow-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-gray-900 dark:text-white">
            Welcome back
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}


            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="info@allneeda.com"
                  disabled={isLoading}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0077B6] hover:bg-[#35a5e1] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#0077B6] hover:text-[#35a5e1] font-medium"
              >
                Sign up as Professional
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-xs text-center text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline hover:text-primary">Terms of Service</Link>{" "}
        and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
      </div>
    </div>
  );
}