export default function Button({
    children,
    variant = "primary", // primary | secondary | ghost | danger
    size = "md", // sm | md | lg
    disabled = false,
    className = "",
    fullWidth = false,
    ...props
}) {
    const baseStyles =
        "font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600/20";

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:text-gray-500",
        secondary:
            "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400",
        ghost: "text-blue-600 hover:bg-blue-50 active:bg-blue-100 disabled:text-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-300 disabled:text-gray-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
