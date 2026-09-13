import React from "react";

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse rounded-none bg-gray-200 ${className}`}
            {...props}
        >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-gray-100/50 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]" />
        </div>
    );
};

export default Skeleton;
