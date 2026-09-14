"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <Card className="relative w-full max-w-md overflow-hidden border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl transition-all">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

        <div className="px-8 pt-8 pb-6 text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your store account
          </p>
        </div>

        <CardContent className="px-8 space-y-5">
          <LoginForm />
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-border/40 bg-muted/20 px-8 py-5">
          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
