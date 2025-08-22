export const Input = ({ className, ...props }) => {
  return (
    <input
      className={`rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
};
