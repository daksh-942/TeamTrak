const CircularLoader = ({ size = 20, color = "#363636", borderWidth = 2 }) => {
  const borderClass = `border-${color}`;

  return (
    <div
      className={`rounded-full border-t-transparent animate-spin`}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
        borderStyle: "solid",
        borderColor: `${color} transparent ${color} ${color}`,
      }}
    />
  );
};

export default CircularLoader;
