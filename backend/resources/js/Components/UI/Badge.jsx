export default function Badge({
    children,
    variant = "default", // default | blue | green | yellow | red
    size = "md", // sm | md | lg
    className = "",
}) {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        red: "bg-red-100 text-red-700",
    };

    const sizes = {
        sm: "px-2 py-1 text-xs font-medium",
        md: "px-3.5 py-1 text-sm font-medium",
        lg: "px-4 py-1.5 text-sm font-medium",
    };

    return (
        <span
            className={`
      inline-block rounded-full
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
        >
            {children}
        </span>
    );
}
