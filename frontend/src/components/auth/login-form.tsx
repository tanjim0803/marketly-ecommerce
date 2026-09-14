"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import authApi from "@/lib/axios";

const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { fetchUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);

      const formData = new URLSearchParams();
      formData.append("username", data.username);
      formData.append("password", data.password);

      await authApi.post("/api/account/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      await fetchUser();
    } catch (error: any) {
      const detail = error?.response?.data?.detail;

      if (typeof detail === "string") {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((err) => err.msg).join(", "));
      } else if (detail && typeof detail === "object") {
        setServerError(detail.msg || "Invalid credentials.");
      } else {
        setServerError("Invalid username or password.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label
          htmlFor="username"
          className="text-xs font-semibold uppercase text-muted-foreground"
        >
          Username / Email
        </Label>
        <div className="relative group flex items-center">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          <Input
            id="username"
            type="text"
            placeholder="username or email"
            {...register("username")}
            className="pl-10 h-11 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
          />
        </div>
        {errors.username && (
          <p className="text-xs text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-xs font-semibold uppercase text-muted-foreground"
          >
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary font-medium hover:underline transition-all"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative group flex items-center">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="pl-10 h-11 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
          />
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-base mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
