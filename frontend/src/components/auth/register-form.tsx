"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";
import authApi from "@/lib/axios";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log("User: ", data);

    try {
      setServerError(null);

      await authApi.post(
        "/api/account/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Show success toast notification
      toast.success("Account created successfully!");

      // Redirect user to the login page
      router.push("/login");
    } catch (error: any) {
      const detail = error?.response?.data?.detail;

      if (typeof detail === "string") {
        setServerError(detail);
      } else if (Array.isArray(detail)) {
        setServerError(detail.map((err) => err.msg).join(", "));
      } else if (detail && typeof detail === "object") {
        setServerError(detail.msg || "Registration failed.");
      } else {
        setServerError("Failed to create an account. Please try again.");
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

      {/* Name Field */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-xs font-semibold uppercase text-muted-foreground"
        >
          Full Name
        </Label>
        <div className="relative group flex items-center">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register("name")}
            className="pl-10 h-11 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
          />
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-xs font-semibold uppercase text-muted-foreground"
        >
          Email Address
        </Label>
        <div className="relative group flex items-center">
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className="pl-10 h-11 border-border/80 focus-visible:ring-primary/40 focus-visible:border-primary transition-all"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-xs font-semibold uppercase text-muted-foreground"
        >
          Password
        </Label>
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

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 font-semibold gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-base mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
