'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Field, FieldDescription, FieldGroup, FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SentinelLogo from "@/components/ui/logo-sentinel";
import React from "react";
import { toast } from "sonner";
import api from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/store/slices/authSlice";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    toast.loading("Logging in...", { id: "login" });

    try {
      const response = await api.post(
        "/api/auth/login",
        { username, password },
        { withCredentials: true }   // refresh token (httpOnly)
      );

      const token = response.data?.accessToken;

      if (!token) {
        toast.error("Invalid login response from server.");
        toast.dismiss("login");
        return;
      }

      // save token in Redux store
      dispatch(setAccessToken(token));

      toast.success("Login successful!", { id: "login" });

      router.push("/mission");

    } catch (error: any) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login error:", error);
      toast.dismiss("login");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl flex items-baseline gap-1 justify-center">
            Welcome to <SentinelLogo size={4} />
          </CardTitle>
          <CardDescription>
            Login to your sentinel account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
