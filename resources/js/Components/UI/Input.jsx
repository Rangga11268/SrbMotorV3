export default function Input({
    label = "",
    error = "",
    helperText = "",
    icon = null,
    type = "text",
    className = "",
    ...props
}) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-900">
                    {label}
                    {props.required && (
                        <span className="text-red-600 ml-1">*</span>
                    )}
                </label>
            )}
            <div className="relative">
                <input
                    type={type}
                    className={`
            w-full px-3.5 py-2.5 border rounded-md text-sm font-normal
            transition-all duration-150
            ${
                error
                    ? "border-red-500 bg-red-50 focus:ring-red-500/20 focus:border-red-600"
                    : "border-gray-200 focus:border-blue-600 focus:ring-blue-600/20"
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400
            placeholder:text-gray-400
            ${icon ? "pr-10" : ""}
            ${className}
          `}
                    {...props}
                />
                {icon && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
}
