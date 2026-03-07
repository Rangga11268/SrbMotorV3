export default function Card({ children, className = "", hoverable = false }) {
    return (
        <div
            className={`
      bg-white border border-gray-200 rounded-lg shadow-sm
      ${hoverable ? "hover:shadow-md hover:border-gray-300 transition-all duration-150 cursor-pointer" : ""}
      ${className}
    `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }) {
    return (
        <div
            className={`
      px-6 py-4 border-b border-gray-200
      ${className}
    `}
        >
            {children}
        </div>
    );
}

export function CardBody({ children, className = "" }) {
    return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    return (
        <div
            className={`
      px-6 py-4 border-t border-gray-200
      flex justify-between items-center
      ${className}
    `}
        >
            {children}
        </div>
    );
}
