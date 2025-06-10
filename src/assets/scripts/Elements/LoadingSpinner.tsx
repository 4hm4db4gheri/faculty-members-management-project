interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  showText?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  text = "در حال بارگذاری...",
  showText = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${showText ? "min-h-[200px] gap-4" : ""}`}
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
        role="status"
        aria-label="loading"
      />
      {showText && text && (
        <p className="text-lg font-semibold text-gray-600">{text}</p>
      )}
    </div>
  );
}
