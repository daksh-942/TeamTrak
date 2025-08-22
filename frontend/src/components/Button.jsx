export const Button = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  const baseStyle =
    "rounded-2xl px-4 py-2 font-semibold focus:outline-none focus:ring transition";
  const variants = {
    default: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-300",
    outline:
      "border border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-300",
  };

  return (
    <button
      className={`${baseStyle} ${
        variants[variant] || variants.default
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
