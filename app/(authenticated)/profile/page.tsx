"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    User as UserIcon,
    ShieldCheck,
    CalendarClock,
    LogOut,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/types";


const Page = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const router = useRouter();

    const fetchUser = async () => {
        setLoading(true);
        setError(false);

        try {
            const response = await api.get("/api/user/profile");
            setUser(response.data.data);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(true);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // --------------------------
    // SKELETON LOADING STATE
    // --------------------------
    if (loading) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-4">
                <Card className="rounded-2xl shadow-md p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>

                    <div className="space-y-4 mt-4">
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-4 w-48" />
                    </div>

                    <Skeleton className="h-10 w-24 rounded-md mt-6" />
                </Card>
            </div>
        );
    }

    // --------------------------
    // ERROR UI (NO CRASH)
    // --------------------------
    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-4">
                <Card className="rounded-2xl shadow-md p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                        <h2 className="text-lg font-semibold">Failed to load profile</h2>
                        <p className="text-muted-foreground">
                            Something went wrong while fetching your profile.
                            Please try again.
                        </p>

                        <Button onClick={fetchUser} className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // If still no user (safety)
    if (!user) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-4 text-center text-muted-foreground">
                No user data found.
            </div>
        );
    }

    // --------------------------
    // MAIN PROFILE UI
    // --------------------------
    return (
        <div className="max-w-xl mx-auto mt-10 p-4 space-y-4">
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                            {user.firstName[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle className="text-2xl font-semibold">
                            {user.firstName} {user.lastName}
                        </CardTitle>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-500"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>
            <Separator />
            <div className="space-y-5">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="font-medium">Role:</span>
                    <Badge variant="secondary">{user.role}</Badge>
                </div>

                <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <span className="font-medium">Status:</span>
                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                        {user.status}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-primary" />
                    <span className="font-medium">Joined:</span>
                    <span className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleString()}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <CalendarClock className="w-5 h-5 text-primary" />
                    <span className="font-medium">Last Updated:</span>
                    <span className="text-muted-foreground">
                        {new Date(user.updatedAt).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Page;
