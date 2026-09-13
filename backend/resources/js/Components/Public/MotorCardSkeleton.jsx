import React from "react";
import Skeleton from "@/Components/UI/Skeleton";

const MotorCardSkeleton = () => {
    return (
        <div className="bg-white border-b border-gray-100 flex flex-col h-full">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] bg-white overflow-hidden p-6 border-b border-gray-100 flex items-center justify-center">
                <Skeleton className="w-4/5 h-4/5" />
                
                {/* Brand Tag Skeleton */}
                <div className="absolute top-4 left-4">
                    <Skeleton className="w-16 h-6" />
                </div>
            </div>

            {/* Body Skeleton */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Year | Type Skeleton */}
                <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-10 h-3" />
                    <div className="w-1 h-1 bg-gray-200" />
                    <Skeleton className="w-20 h-3" />
                </div>

                {/* Title Skeleton */}
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-2/3 h-8 mb-6" />

                {/* Footer Skeleton */}
                <div className="mt-auto flex items-end justify-between pt-6 border-t border-gray-100">
                    <div className="space-y-1">
                        <Skeleton className="w-24 h-6" />
                    </div>
                    <Skeleton className="w-10 h-10" />
                </div>
            </div>
        </div>
    );
};

export default MotorCardSkeleton;
