import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./components/StarRating";
import "./index.css";
import App from "./App";

function Test() {
  const [totalStar, setTotalStar] = useState(0);
  return (
    <div>
      <StarRating
        color="blue"
        maxRating={10}
        onGettingTotalStars={setTotalStar}
      />
      <p>The Review of the Movie is {totalStar} stars</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      message={["Bad", "Ok", "Good", "Best", "Amazing"]}
    />
    <StarRating size={24} color="red" className="test" defaultRating={2} />
    <Test /> */}
  </React.StrictMode>
);
