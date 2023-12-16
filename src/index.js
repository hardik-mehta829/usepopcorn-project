import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./StarRating";
import StarRating from "./StarRating";
import "./index.css";
import App from "./App";

function Test() {
  const [movierating, setmovie] = useState(0);
  return (
    <div>
      <StarRating color="blue" maxrating={10} setmovie={setmovie} />
      <p>The movie is rated {movierating} stars</p>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxrating={5}
      color="red"
      className="test"
      messages={["terrible", "bad", "okay", "good", "amazing"]}
      defaultRating={0}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>
);
