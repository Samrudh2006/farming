/**
 * Registration form component.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "@/lib/api";
import { pageTransition } from "@/lib/animations";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  college: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      const res = await authApi.register(data);
      setAuth(res.data.user, res.data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
  };

  return (
    <motion.div {...pageTransition} className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Start building your Skill Passport</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <p className="text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-2">{error}</p>
            )}
            <Input
              placeholder="Full Name"
              error={errors.full_name?.message}
              {...register("full_name")}
            />
            <Input
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              type="password"
              placeholder="Password (min 8 chars)"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              placeholder="College (optional)"
              error={errors.college?.message}
              {...register("college")}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create account
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
