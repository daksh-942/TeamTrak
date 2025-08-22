export default function Badge({ text, color = "gray" }) {
  const colorClasses = {
    gray: "bg-gray-600 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-600 text-white",
    purple: "bg-purple-600 text-white",
    pink: "bg-pink-500 text-white",
  };

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
        colorClasses[color] || colorClasses.gray
      }`}
    >
      {text}
    </span>
  );
}
