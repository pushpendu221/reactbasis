const containerStyle = {
  display: "flex",
  allignItem: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  gap: "4px",
};

const textStyle = {
  lineHeight: "1",
  margin: "0",
};

export default function StarRating({ maxRating = 5 }) {
  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => {
          return <span>S{i + 1}</span>;
        })}
      </div>
      <div style={textStyle}>10</div>
    </div>
  );
}
