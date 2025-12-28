"use client" // Added "use client" as is common for components using interactive hooks/state

import { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hook";
import { Mission } from "@/lib/types";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
// Importing toast directly from sonner
import { toast } from "sonner"; 

// Assume these imports are correct for your shadcn/ui setup
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MissionCreateButton from "./mission-create-button"; // Assuming this path is correct

type Props = {}

// --- MissionCard Component (No Change) ---
const MissionCard = ({ mission }: { mission: Mission }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800";
            case "IN_PROGRESS":
                return "bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800";
            case "PENDING":
                return "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-800";
            default:
                return "";
        }
    };

    return (
        <Card className="shadow-md transition-all py-4 hover:shadow-lg dark:hover:border-primary h-full"> 
            <CardHeader className="px-4">
                <CardTitle className="text-lg truncate">
                    {mission.name}
                </CardTitle>
                <CardDescription className="text-sm">
                    Type: {mission.type}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 ">
                    {mission.description || "No description provided."}
                </p>
                <div className="mt-3 flex justify-between items-center">
                    <Badge
                        className={`text-xs font-semibold uppercase ${getStatusColor(mission.status)}`}
                    >
                        {mission?.status?.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        Start: {new Date(mission.startTime).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

// --- Skeleton Card Component (No Change) ---
const MissionCardSkeleton = () => (
    <Card className="shadow-sm h-full">
        <CardHeader className="px-4 py-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/3 mt-2" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
            <div className="mt-3 flex justify-between items-center">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </CardContent>
    </Card>
);

// --- Main Component ---
const MissionGridList = (props: Props) => {
    // Redux Selectors
    const missions = useAppSelector((state: RootState) => state.missions.items);
    const loading = useAppSelector((state: RootState) => state.missions.loading);
    const error = useAppSelector((state: RootState) => state.missions.error);
    const [searchQuery, setSearchQuery] = useState("");
    
    // 1. Error Toast Effect using sonner's direct toast function
    useEffect(() => {
        if (error) {
            // Using toast.error() for a clear error message, following the sonner pattern
            toast.error("Failed to fetch missions", {
                description: error,
                // Optional action button similar to your example
                action: {
                    label: "Dismiss",
                    onClick: () => console.log("Error dismissed"),
                }
            });
        }
    }, [error]); // Dependency array ensures it runs only when error changes

    // 2. Memoized Filtering Logic (No Change)
    const filteredMissions = useMemo(() => {
        if (!searchQuery) {
            return missions;
        }

        const lowerCaseQuery = searchQuery.toLowerCase();

        return missions.filter((mission: Mission) =>
            mission.name.toLowerCase().includes(lowerCaseQuery) ||
            mission.type.toLowerCase().includes(lowerCaseQuery) ||
            (mission.description && mission.description.toLowerCase().includes(lowerCaseQuery))
        );
    }, [missions, searchQuery]);

    // 3. Determine content to render (No Change in logic)
    const renderContent = () => {
        if (loading) {
            return Array.from({ length: 8 }).map((_, index) => (
                <MissionCardSkeleton key={index} />
            ));
        }

        if (filteredMissions.length === 0) {
            return (
                <div className="col-span-full text-center py-10">
                    <h3 className="text-xl font-semibold text-muted-foreground">
                        No missions found.
                    </h3>
                    <p className="text-sm text-gray-500">
                        {searchQuery
                            ? `Try adjusting your search for "${searchQuery}".`
                            : "The mission list is currently empty."
                        }
                    </p>
                </div>
            );
        }

        return filteredMissions.map((mission: Mission) => (
            <Link 
                href={`/mission/${mission.id}`} 
                key={mission.id} 
                className="block h-full hover:no-underline"
            >
                <MissionCard mission={mission} />
            </Link>
        ));
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            
            {/* Search and Create Controls */}
            <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
                <Input
                    type="text"
                    placeholder="Search missions by name, type, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-xl"
                    disabled={loading}
                />
                <MissionCreateButton />
            </div>

            {/* Mission Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {renderContent()}
            </div>

        </div>
    )
}

export default MissionGridList