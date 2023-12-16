import { useState } from "react";
import Proptypes from "prop-types";
//Write styles outside function otherwise they will be re-rendered each time the function is called.
const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const StarContainerStyle = {
  display: "flex",
};

const textStyle = {
  lineHeight: "1",
  margin: "0",
};
//To verify the data type of prop
StarRating.propTypes = {
  maxrating: Proptypes.number,
  color: Proptypes.string,
  size: Proptypes.number,
  className: Proptypes.string,
  messages: Proptypes.array,
  defaultRating: Proptypes.number,
  setmovie: Proptypes.func,
};
export default function StarRating({
  maxrating = 10,
  color = "#fcc419",
  size = 24,
  className = "",
  messages = [],
  defaultRating = 0,
  setuserRating,
}) {
  const [rate, setRating] = useState(defaultRating);
  const [temprating, setTemprating] = useState(0);
  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size}px`,
  };
  return (
    <div style={containerStyle} className={className}>
      <div style={StarContainerStyle}>
        {Array.from({ length: maxrating }, (_, i) => (
          <Star
            key={i}
            onRate={() => {
              setRating(i + 1);
              setuserRating(i + 1);
            }}
            full={temprating ? temprating >= i + 1 : rate >= i + 1}
            onhoverin={() => {
              return setTemprating(i + 1);
            }}
            onhoverout={() => {
              return setTemprating(0);
            }}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length == maxrating
          ? messages[temprating ? temprating - 1 : rate - 1]
          : temprating || rate || ""}
      </p>
    </div>
  );
}
function Star({ onRate, full, onhoverin, onhoverout, size, color }) {
  // role for accessibility
  const starstyle = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starstyle}
      onClick={onRate}
      onMouseEnter={onhoverin}
      onMouseLeave={onhoverout}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}
