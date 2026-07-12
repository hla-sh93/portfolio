"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <GlassCard padding="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg text-center font-medium">
            {error}
          </div>
        )}
        
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button 
          type="submit" 
          className="w-full" 
          loading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </GlassCard>
  );
}
