'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import SentinelLogo from "@/components/ui/logo-sentinel"
import React from "react"
import { toast } from "sonner"
import { serverURL } from "@/lib/constants"
import api, {setAccessToken} from "@/lib/auth"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            toast.loading("Logging in...", { id: "login" });
            e.preventDefault();
            if (!username || !password) {
                toast.error("Please enter both username and password");
                toast.dismiss("login");
                return;
            }
            const response = await api.post(`${serverURL}/api/auth/login`, {
                username,
                password,
            });
            console.log(response);
            if (response.status === 200) {
                toast.success("Login successful!");
                console.log("Access Token:", response.data.accessToken);
                setAccessToken(response.data.accessToken);
            } else {
                toast.error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            toast.error("An error occurred during login. Or your credentials are incorrect.");
            console.error("Login error:", error);
        } finally {
            toast.dismiss("login");
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl flex items-baseline gap-1 justify-center">Welcome to <SentinelLogo size={4} /></CardTitle>
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
                                    type="username"
                                    placeholder="Enter your username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
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
                                <Button type="submit">Login</Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
